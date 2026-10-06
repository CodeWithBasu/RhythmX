import re

with open('components/music-visualizer.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

old_loop = """  // useEffect para manejar el loop de visualización
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null

    if (isPlaying) {
      setIsLooping(true)
      console.log("Starting visualization loop")

      intervalId = setInterval(() => {
        updateAudioData()
      }, 25) // 40 FPS para fluidez de ola
    } else {
      setIsLooping(false)
      console.log("Stopping visualization loop")
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [isPlaying, isInitialized])"""

new_loop = """  // useEffect para manejar el loop de visualización
  useEffect(() => {
    let animationFrame: number;
    let lastTime = 0;

    const loop = (time: number) => {
      if (time - lastTime >= 25) { // Throttle to ~40fps
        updateAudioData();
        lastTime = time;
      }
      animationFrame = requestAnimationFrame(loop);
    };

    if (isPlaying) {
      setIsLooping(true);
      console.log("Starting visualization loop");
      animationFrame = requestAnimationFrame(loop);
    } else {
      setIsLooping(false);
      console.log("Stopping visualization loop");
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isPlaying, isInitialized]);"""

code = code.replace(old_loop, new_loop)

with open('components/music-visualizer.tsx', 'w', encoding='utf-8') as f:
    f.write(code)

print("Replaced setInterval with requestAnimationFrame")
