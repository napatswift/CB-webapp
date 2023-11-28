interface SongOptionsProps {
  songs: {
    name: string;
    id: string;
    current_time: number;
  }[];
  selectingSongId?: string;
  setSongId: React.Dispatch<string | undefined>;
}

function SongOptions({ songs, setSongId, selectingSongId }: SongOptionsProps) {
  return (
    <div>
      {songs.map((song) => 
      {
        const time = new Date(song.current_time);
        const timeString = `${time.getMinutes()}:${time.getSeconds()}`;
        return <button
          key={song.id}
          onClick={() =>
            setSongId(song.id === selectingSongId ? undefined : song.id)
          }
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#eee",
            border:
              selectingSongId == song.id ? "1px solid #000" : "1px solid #fff",
            borderRadius: "0.5rem",
          }}
        >
          {song.name} {timeString}
        </button>}
      )}
    </div>
  );
}

export default SongOptions;
