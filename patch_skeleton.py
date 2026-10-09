import re

with open('components/music-visualizer.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

target = r"""          \{/\* Skeleton Loading Rows \*/\}
            \{isLoadingSongs && \(
              <>
                <section>
                  <div className="h-6 w-48 bg-white/10 rounded mb-4 animate-pulse" />
                  <div className="flex overflow-x-hidden gap-4 pb-4 -mx-4 px-4">
                    \{\[\.\.\.Array\(6\)\].map\(\(_, i\) => \(
                      <div key=\{`hits-skel-\$\{i\}`} className="shrink-0 w-\[120px\] sm:w-\[160px\] animate-pulse">
                        <div className="w-\[120px\] sm:w-\[160px\] h-\[120px\] sm:h-\[160px\] mb-3 bg-white/10 rounded-md" />
                        <div className="h-3 bg-white/10 rounded w-3/4 mb-2" />
                        <div className="h-2 bg-white/10 rounded w-1/2" />
                      </div>
                    \)\)}
                  </div>
                </section>
                <section className="mt-8">
                  <div className="h-6 w-32 bg-white/10 rounded mb-4 animate-pulse" />
                  <div className="flex overflow-x-hidden gap-4 pb-4 -mx-4 px-4">
                    \{\[\.\.\.Array\(6\)\].map\(\(_, i\) => \(
                      <div key=\{`chill-skel-\$\{i\}`} className="shrink-0 w-\[120px\] sm:w-\[160px\] animate-pulse">
                        <div className="w-\[120px\] sm:w-\[160px\] h-\[120px\] sm:h-\[160px\] mb-3 bg-white/10 rounded-md" />
                        <div className="h-3 bg-white/10 rounded w-2/3 mb-2" />
                        <div className="h-2 bg-white/10 rounded w-1/3" />
                      </div>
                    \)\)}
                  </div>
                </section>
              </>
            \)}"""

replacement = """          {/* Skeleton Loading Rows */}
            {isLoadingSongs && (
              <>
                <section className="px-6 mt-4 animate-pulse">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-5 w-32 bg-white/10 rounded-full" />
                    <div className="h-3 w-12 bg-white/10 rounded-full" />
                  </div>
                  <div className="flex flex-col gap-3">
                    {[...Array(5)].map((_, i) => (
                      <div key={`hits-skel-${i}`} className="flex items-center gap-4 p-2 bg-white/[0.05] border border-white/5 rounded-[24px]">
                        <div className="w-12 h-12 shrink-0 rounded-full bg-white/10" />
                        <div className="flex-1 min-w-0">
                          <div className="h-3.5 bg-white/10 rounded-full w-2/3 mb-2" />
                          <div className="h-2.5 bg-white/10 rounded-full w-1/3" />
                        </div>
                        <div className="w-8 h-8 mr-2 rounded-full bg-white/10 shrink-0" />
                      </div>
                    ))}
                  </div>
                </section>
                <section className="px-6 mt-8 animate-pulse">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-5 w-32 bg-white/10 rounded-full" />
                    <div className="h-3 w-12 bg-white/10 rounded-full" />
                  </div>
                  <div className="flex flex-col gap-3">
                    {[...Array(5)].map((_, i) => (
                      <div key={`chill-skel-${i}`} className="flex items-center gap-4 p-2 bg-white/[0.05] border border-white/5 rounded-[24px]">
                        <div className="w-12 h-12 shrink-0 rounded-full bg-white/10" />
                        <div className="flex-1 min-w-0">
                          <div className="h-3.5 bg-white/10 rounded-full w-2/3 mb-2" />
                          <div className="h-2.5 bg-white/10 rounded-full w-1/3" />
                        </div>
                        <div className="w-8 h-8 mr-2 rounded-full bg-white/10 shrink-0" />
                      </div>
                    ))}
                  </div>
                </section>
              </>
            )}"""

content = re.sub(target, replacement, content, flags=re.DOTALL)

with open('components/music-visualizer.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Applied vertical skeleton loader")
