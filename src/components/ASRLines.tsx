import style from "./asrlines.module.css";

interface ASRLinesProps {
  lineList: {
    line: string;
    timestamp: string;
  }[];
}

function sortByTimestamp(a: { timestamp: string }, b: { timestamp: string }) {
  return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
}

function ASRLines({ lineList }: ASRLinesProps) {
  return (
    <div>
      {lineList
        .sort(sortByTimestamp)
        .slice(0, 3)
        .map((lyricLine) => (
        <p key={lyricLine.timestamp} className={style.asrLyricLine}>
          {lyricLine.line}
        </p>
      ))}
    </div>
  );
}

export default ASRLines;
