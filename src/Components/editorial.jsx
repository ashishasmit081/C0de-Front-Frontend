import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Maximize2, Minimize2 } from "lucide-react";

const Editorial = ({ secureUrl, thumbnailUrl, duration }) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const togglePlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    const updateTime = () => setCurrentTime(video.currentTime);
    if (video) {
      video.addEventListener("timeupdate", updateTime);
      return () => video.removeEventListener("timeupdate", updateTime);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-3xl mx-auto rounded-xl overflow-hidden shadow-xl group"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <video
        ref={videoRef}
        src={secureUrl}
        poster={thumbnailUrl}
        onClick={togglePlayPause}
        className="w-full aspect-video bg-black cursor-pointer"
      />

      {/* Controls Overlay */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-3 transition-opacity duration-300 ${
          isHovering || !isPlaying ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          {/* Play/Pause */}
          <button
            onClick={togglePlayPause}
            className="btn btn-sm btn-circle btn-primary"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause /> : <Play />}
          </button>

          {/* Progress */}
          <div className="flex items-center gap-2 flex-1">
            <span className="text-xs text-white w-10 text-right">{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={duration}
              value={currentTime}
              onChange={(e) => {
                if (videoRef.current) {
                  videoRef.current.currentTime = Number(e.target.value);
                }
              }}
              className="range range-sm range-primary flex-1"
            />
            <span className="text-xs text-white w-10 text-left">{formatTime(duration)}</span>
          </div>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="btn btn-sm  btn-warning text-black border-black border-2"
            aria-label="Fullscreen Toggle"
          >
            {isFullscreen ? <Minimize2 /> : <Maximize2 />}
          </button>
        </div>
      </div>
    </div>
  );
};


export default Editorial;