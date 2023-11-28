import { useEffect, useRef, useState } from "react";

interface LyricPlayerProps {
  startAt: string; // datetime string
  startTimeMsAt: number; // line at the `startAt` datetime
  lyrics: {
    start_time_ms: number;
    words: string;
  }[]; // sorted by `start_time_ms`
}

function LyricPlayer({ startAt, startTimeMsAt, lyrics }: LyricPlayerProps) {
  const [currLyricLineIdx, setCurrLyricLineIdx] = useState(0);
  const currentTime = useRef<number>(0);
  const container = useRef<HTMLDivElement>(null);
  const activeLine = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setCurrLyricLineIdx(0);
    currentTime.current = 0;
    const startAtMs = new Date(startAt).getTime();
    const nowMs = Date.now();
    const diffMs = nowMs - startAtMs;
    const lyricLineIdx = lyrics.findIndex(
      (lyric) => lyric.start_time_ms > diffMs + startTimeMsAt
    );

    if (lyricLineIdx === -1) {
      return;
    }

    setCurrLyricLineIdx(lyricLineIdx);
    currentTime.current = Date.now() - startAtMs + startTimeMsAt;

    const intervalId = setInterval(() => {
      currentTime.current += 100;

      const lyricLineIdx = lyrics.findIndex(
        (lyric) => lyric.start_time_ms > currentTime.current
      );
      setCurrLyricLineIdx(
        lyricLineIdx === -1 ? lyrics.length - 1 : lyricLineIdx - 1
      );
      if (lyricLineIdx === -1) {
        clearInterval(intervalId);
      }
    }, 100);

    return () => {
      clearInterval(intervalId);
    };
  }, [lyrics]);

  useEffect(() => {
    if (activeLine.current && container.current) {
      // scroll to center of active line
      const activeLineRect = activeLine.current.getBoundingClientRect();
      const containerRect = container.current.getBoundingClientRect();
      const diff = activeLineRect.top - containerRect.top;
      activeLine.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
  }, [currLyricLineIdx]);

  return (
    <div ref={container} className="max-h-[25rem] overflow-scroll p-4">
      {lyrics.map((lyric, idx) => {
        const ref = idx === currLyricLineIdx ? activeLine : null;
        return (
          <div
            key={idx}
            ref={ref}
            className={
              idx === currLyricLineIdx ? "lyric-line active" : "lyric-line"
            }
          >
            {lyric.words}
          </div>
        );
      })}
    </div>
  );
}

export default LyricPlayer;
