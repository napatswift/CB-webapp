"use client";

import LyricPlayer from "@/components/LyricPlayer";

const sampleLyrics = {
  id: "spotify:track:7712gjoih4QoDbXpljEk21",
  name: "Paris",
  current_time: 31220,
  time_stamp: new Date().toISOString(),
  lyric: [
    {
      start_time_ms: 0,
      words: "-",
      spotify_uri: "spotify:track:7712gjoih4QoDbXpljEk21",
    },
    {
      start_time_ms: 167400,
      words: "Yes, we were somewhere else",
      spotify_uri: "spotify:track:7712gjoih4QoDbXpljEk21",
    },
    {
      start_time_ms: 162070,
      words: "My love, we were in Paris",
      spotify_uri: "spotify:track:7712gjoih4QoDbXpljEk21",
    },
    {
      start_time_ms: 158790,
      words: "Yes, we were somewhere else",
      spotify_uri: "spotify:track:7712gjoih4QoDbXpljEk21",
    },
    {
      start_time_ms: 154390,
      words: "'Cause we were in Paris",
      spotify_uri: "spotify:track:7712gjoih4QoDbXpljEk21",
    },
    {
      start_time_ms: 150660,
      words: "Drinking Champagne",
      spotify_uri: "spotify:track:7712gjoih4QoDbXpljEk21",
    },
    {
      start_time_ms: 148410,
      words: "In an alleyway",
      spotify_uri: "spotify:track:7712gjoih4QoDbXpljEk21",
    },
    {
      start_time_ms: 145970,
      words: "'Cause we were somewhere else",
      spotify_uri: "spotify:track:7712gjoih4QoDbXpljEk21",
    },
    {
      start_time_ms: 143610,
      words: "No, I didn't see the news",
      spotify_uri: "spotify:track:7712gjoih4QoDbXpljEk21",
    },
    {
      start_time_ms: 141050,
      words: "We drew a map on your bedroom ceiling",
      spotify_uri: "spotify:track:7712gjoih4QoDbXpljEk21",
    },
    {
      start_time_ms: 138100,
      words: "In my mind",
      spotify_uri: "spotify:track:7712gjoih4QoDbXpljEk21",
    },
    {
      start_time_ms: 136020,
      words: "Be the tower at midnight",
      spotify_uri: "spotify:track:7712gjoih4QoDbXpljEk21",
    },
    {
      start_time_ms: 134450,
      words: "Let the only flashing lights",
      spotify_uri: "spotify:track:7712gjoih4QoDbXpljEk21",
    },
    {
      start_time_ms: 129470,
      words: "Confess my truth in swooping, sloping, cursive letters",
      spotify_uri: "spotify:track:7712gjoih4QoDbXpljEk21",
    },
    {
      start_time_ms: 125200,
      words: "I want to transport you to somewhere the culture's clever",
      spotify_uri: "spotify:track:7712gjoih4QoDbXpljEk21",
    },
    {
      start_time_ms: 120630,
      words: "I want to brainwash you into loving me forever",
      spotify_uri: "spotify:track:7712gjoih4QoDbXpljEk21",
    },
    {
      start_time_ms: 115970,
      words: "We were somewhere else",
      spotify_uri: "spotify:track:7712gjoih4QoDbXpljEk21",
    },
    {
      start_time_ms: 111200,
      words: "Like we were in Paris",
      spotify_uri: "spotify:track:7712gjoih4QoDbXpljEk21",
    },
    {
      start_time_ms: 106760,
      words: "Like we were somewhere else",
      spotify_uri: "spotify:track:7712gjoih4QoDbXpljEk21",
    },
    {
      start_time_ms: 102450,
      words: "Like we were in Paris",
      spotify_uri: "spotify:track:7712gjoih4QoDbXpljEk21",
    },
    {
      start_time_ms: 100170,
      words: "I was taken by the view",
      spotify_uri: "spotify:track:7712gjoih4QoDbXpljEk21",
    },
    {
      start_time_ms: 97660,
      words: "Cheap wine make-believe it's Champagne",
      spotify_uri: "spotify:track:7712gjoih4QoDbXpljEk21",
    },
    {
      start_time_ms: 95620,
      words: "Stumble down pretend alleyways",
      spotify_uri: "spotify:track:7712gjoih4QoDbXpljEk21",
    },
    {
      start_time_ms: 93590,
      words: "'Cause we were somewhere else",
      spotify_uri: "spotify:track:7712gjoih4QoDbXpljEk21",
    },
    {
      start_time_ms: 91550,
      words: "No, I didn't see the news",
      spotify_uri: "spotify:track:7712gjoih4QoDbXpljEk21",
    },
    {
      start_time_ms: 89360,
      words: "Drew a map on your bedroom ceiling",
      spotify_uri: "spotify:track:7712gjoih4QoDbXpljEk21",
    },
    {
      start_time_ms: 86930,
      words: "I'm so in love that I might stop breathing",
      spotify_uri: "spotify:track:7712gjoih4QoDbXpljEk21",
    },
    {
      start_time_ms: 84480,
      words: "The kind under where a tree has grown",
      spotify_uri: "spotify:track:7712gjoih4QoDbXpljEk21",
    },
    {
      start_time_ms: 82250,
      words: "And not the kind that's thrown, I mean",
      spotify_uri: "spotify:track:7712gjoih4QoDbXpljEk21",
    },
    {
      start_time_ms: 80020,
      words: "Sit quiet by my side in the shade",
      spotify_uri: "spotify:track:7712gjoih4QoDbXpljEk21",
    },
    {
      start_time_ms: 77950,
      words: "Levitate above all the messes made",
      spotify_uri: "spotify:track:7712gjoih4QoDbXpljEk21",
    },
    {
      start_time_ms: 75540,
      words: "If you keep it just yours",
      spotify_uri: "spotify:track:7712gjoih4QoDbXpljEk21",
    },
    {
      start_time_ms: 74020,
      words: "Romance is not dead",
      spotify_uri: "spotify:track:7712gjoih4QoDbXpljEk21",
    },
    {
      start_time_ms: 72010,
      words: "And on my page and on the whole world",
      spotify_uri: "spotify:track:7712gjoih4QoDbXpljEk21",
    },
    {
      start_time_ms: 69770,
      words: "Privacy sign on the door",
      spotify_uri: "spotify:track:7712gjoih4QoDbXpljEk21",
    },
    {
      start_time_ms: 63810,
      words: "We were somewhere else",
      spotify_uri: "spotify:track:7712gjoih4QoDbXpljEk21",
    },
    {
      start_time_ms: 59340,
      words: "Like we were in Paris",
      spotify_uri: "spotify:track:7712gjoih4QoDbXpljEk21",
    },
    {
      start_time_ms: 55060,
      words: "Like we were somewhere else",
      spotify_uri: "spotify:track:7712gjoih4QoDbXpljEk21",
    },
    {
      start_time_ms: 50460,
      words: "Like we were in Paris",
      spotify_uri: "spotify:track:7712gjoih4QoDbXpljEk21",
    },
    {
      start_time_ms: 48290,
      words: "I was taken by the view",
      spotify_uri: "spotify:track:7712gjoih4QoDbXpljEk21",
    },
    {
      start_time_ms: 45700,
      words: "Cheap wine make-believe it's Champagne",
      spotify_uri: "spotify:track:7712gjoih4QoDbXpljEk21",
    },
    {
      start_time_ms: 43720,
      words: "Stumble down pretend alleyways",
      spotify_uri: "spotify:track:7712gjoih4QoDbXpljEk21",
    },
    {
      start_time_ms: 41720,
      words: "'Cause we were somewhere else",
      spotify_uri: "spotify:track:7712gjoih4QoDbXpljEk21",
    },
    {
      start_time_ms: 39710,
      words: "No, I didn't see the news",
      spotify_uri: "spotify:track:7712gjoih4QoDbXpljEk21",
    },
    {
      start_time_ms: 37200,
      words: "Drew a map on your bedroom ceiling",
      spotify_uri: "spotify:track:7712gjoih4QoDbXpljEk21",
    },
    {
      start_time_ms: 35090,
      words: "I'm so in love that I might stop breathing",
      spotify_uri: "spotify:track:7712gjoih4QoDbXpljEk21",
    },
    {
      start_time_ms: 33570,
      words: "No, I didn't but thanks though",
      spotify_uri: "spotify:track:7712gjoih4QoDbXpljEk21",
    },
    {
      start_time_ms: 31220,
      words: "Did you see the photos?",
      spotify_uri: "spotify:track:7712gjoih4QoDbXpljEk21",
    },
    {
      start_time_ms: 28930,
      words: "2003, unbearable",
      spotify_uri: "spotify:track:7712gjoih4QoDbXpljEk21",
    },
    {
      start_time_ms: 26790,
      words: "And all the outfits were terrible",
      spotify_uri: "spotify:track:7712gjoih4QoDbXpljEk21",
    },
    {
      start_time_ms: 24820,
      words: "Some wannabe Z-lister",
      spotify_uri: "spotify:track:7712gjoih4QoDbXpljEk21",
    },
    {
      start_time_ms: 22170,
      words: "Turns out it was that guy you hooked up with ages ago",
      spotify_uri: "spotify:track:7712gjoih4QoDbXpljEk21",
    },
    {
      start_time_ms: 18010,
      words: "Your ex-friend's sister met someone at a club, and he kissed her",
      spotify_uri: "spotify:track:7712gjoih4QoDbXpljEk21",
    },
  ],
  score: 5.582268114481092,
};

function index() {
  return (
    <div>
      <LyricPlayer
        startAt={sampleLyrics.time_stamp}
        startTimeMsAt={sampleLyrics.current_time}
        lyrics={sampleLyrics.lyric.sort(
          (a, b) => a.start_time_ms - b.start_time_ms
        )}
      />
    </div>
  );
}

export default index;
