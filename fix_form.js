const fs = require('fs');
const code = fs.readFileSync('components/music-visualizer.tsx', 'utf8');

const startStr = '<form onSubmit={async (e) => {';
const endStr = '</form>';

const startIndex = code.indexOf(startStr);
const endIndex = code.indexOf(endStr, startIndex) + endStr.length;

if (startIndex === -1 || endIndex === -1) {
    console.error("Could not find form block.");
    process.exit(1);
}

const newForm = `<form onSubmit={async (e) => {
                  e.preventDefault()
                  if (selectedFile) {
                    setIsBuffering(true) // Loading State
                    
                    const audio = new Audio()
                    const blobUrl = URL.createObjectURL(selectedFile)
                    audio.src = blobUrl
                    
                    audio.onloadedmetadata = async () => {
                      const duration = Math.floor(audio.duration)
                      URL.revokeObjectURL(blobUrl)
                      
                      try {
                        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dlmpk5juu'; 
                        const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'rhythmx_unsigned'; 
                        
                        setUploadProgress(10);
                        
                        // 1. Upload Cover Image (if exists)
                        let uploadedImageUrl = null;
                        if (newSongMeta.imageUrl && newSongMeta.imageUrl.startsWith('data:image')) {
                           const imgFormData = new FormData();
                           imgFormData.append('file', newSongMeta.imageUrl);
                           imgFormData.append('upload_preset', uploadPreset);
                           const imgRes = await fetch(\`https://api.cloudinary.com/v1_1/\${cloudName}/image/upload\`, {
                             method: 'POST',
                             body: imgFormData
                           });
                           if (imgRes.ok) {
                             const imgData = await imgRes.json();
                             uploadedImageUrl = imgData.secure_url;
                           }
                        }

                        // 2. Upload Audio File (with progress)
                        const formData = new FormData();
                        formData.append('file', selectedFile);
                        formData.append('upload_preset', uploadPreset);
                        
                        await new Promise((resolve, reject) => {
                          const xhr = new XMLHttpRequest();
                          xhr.open('POST', \`https://api.cloudinary.com/v1_1/\${cloudName}/video/upload\`);
                          
                          xhr.upload.onprogress = (event) => {
                            if (event.lengthComputable) {
                              const progress = 10 + Math.round((event.loaded / event.total) * 85); // 10-95%
                              setUploadProgress(progress);
                            }
                          };
                          
                          xhr.onload = async () => {
                            if (xhr.status >= 200 && xhr.status < 300) {
                              const res = JSON.parse(xhr.responseText);
                              const uploadedUrl = res.secure_url;
                              setUploadProgress(96);
                              
                              // 3. Save to MongoDB
                              const songData = {
                                title: newSongMeta.title,
                                artist: newSongMeta.artist || "Unknown Artist",
                                language: newSongMeta.language,
                                url: uploadedUrl,
                                imageUrl: uploadedImageUrl || null,
                                duration: duration
                              };
                              
                              const token = await user?.getIdToken(true);
                              const dbRes = await fetch(\`\${API_BASE}/api/songs\`, {
                                method: 'POST',
                                headers: { 
                                  'Content-Type': 'application/json',
                                  'Authorization': \`Bearer \${token}\`
                                },
                                body: JSON.stringify(songData),
                              });
                              
                              if (dbRes.ok) {
                                const dbData = await dbRes.json();
                                setSongs([...songs, dbData.song]);
                                resolve(null);
                              } else {
                                reject(new Error('Failed to save to database'));
                              }
                            } else {
                              reject(new Error('Cloudinary upload failed'));
                            }
                          };
                          
                          xhr.onerror = () => reject(new Error('Network error'));
                          xhr.send(formData);
                        });

                        setIsBuffering(false);
                        setUploadProgress(0);
                        setIsAddingSong(false);
                        setSelectedFile(null);
                        setNewSongMeta({ title: "", artist: "", url: "", imageUrl: "", language: "English" });
                      } catch (err) {
                        setIsBuffering(false);
                        setUploadProgress(0);
                        setError("Failed to upload song. Check console.");
                        console.error(err);
                      }
                    }
                  }
                }}>
                  <div className="flex flex-col gap-4">
                    
                    {/* Cover Art Preview */}
                    {newSongMeta.imageUrl && (
                      <div className="flex justify-center mb-2">
                        <img src={newSongMeta.imageUrl} alt="Cover Preview" className="w-24 h-24 rounded-lg object-cover shadow-lg border border-white/10" />
                      </div>
                    )}

                    <input 
                      type="file" 
                      accept="audio/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          setSelectedFile(file)
                          setNewSongMeta({ ...newSongMeta, title: file.name.replace(/\.[^/.]+$/, "") })
                          
                          // Dynamically import jsmediatags and Extract ID3 Tags (Cover Art)
                          import('jsmediatags').then((jsmediatags) => {
                            jsmediatags.read(file, {
                              onSuccess: function(tag) {
                                const picture = tag.tags.picture;
                                if (picture) {
                                  let base64String = "";
                                  for (let i = 0; i < picture.data.length; i++) {
                                      base64String += String.fromCharCode(picture.data[i]);
                                  }
                                  const base64 = btoa(base64String);
                                  const imageUrl = \`data:\${picture.format};base64,\${base64}\`;
                                  setNewSongMeta(prev => ({ ...prev, imageUrl, artist: tag.tags.artist || prev.artist, title: tag.tags.title || prev.title }));
                                }
                              },
                              onError: function(error) {
                                console.log("No ID3 tags found.", error);
                              }
                            });
                          }).catch(err => console.log('Failed to load jsmediatags', err));
                        }
                      }}
                      className="text-sm text-white/60 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-500/20 file:text-purple-400 hover:file:bg-purple-500/30"
                    />
                    <input 
                      type="text" 
                      placeholder="Song Title" 
                      value={newSongMeta.title}
                      onChange={(e) => setNewSongMeta({...newSongMeta, title: e.target.value})}
                      className="w-full bg-[#222] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500/50"
                      required
                    />
                    <input 
                      type="text" 
                      placeholder="Artist (Optional)" 
                      value={newSongMeta.artist || ''}
                      onChange={(e) => setNewSongMeta({...newSongMeta, artist: e.target.value})}
                      className="w-full bg-[#222] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500/50"
                    />
                    <select
                      value={newSongMeta.language}
                      onChange={(e) => setNewSongMeta({...newSongMeta, language: e.target.value})}
                      className="w-full bg-[#222] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500/50"
                    >
                      <option value="English">English</option>
                      <option value="Hindi">Hindi</option>
                      <option value="Spanish">Spanish</option>
                      <option value="Korean">Korean</option>
                      <option value="Instrumental">Instrumental</option>
                    </select>
                    
                    <div className="flex gap-4">
                      <button 
                        type="button" 
                        onClick={() => {
                          setIsAddingSong(false)
                          setSelectedFile(null)
                          setNewSongMeta({ title: "", artist: "", url: "", imageUrl: "", language: "English" })
                        }}
                        className="flex-1 py-3 px-4 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors text-sm font-medium"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        disabled={!selectedFile || isBuffering || uploadProgress > 0}
                        className="flex-1 py-3 px-4 bg-[#C084FC] hover:bg-[#A855F7] text-white rounded-lg transition-colors text-sm font-medium shadow-[0_0_15px_rgba(192,132,252,0.3)] disabled:opacity-50"
                      >
                        {uploadProgress > 0 ? \`Uploading (\${uploadProgress}%)...\` : isBuffering ? "Processing..." : "Add to Library"}
                      </button>
                    </div>
                  </div>
                </form>`;

const newCode = code.substring(0, startIndex) + newForm + code.substring(endIndex);
fs.writeFileSync('components/music-visualizer.tsx', newCode);
console.log("Successfully replaced form.");
