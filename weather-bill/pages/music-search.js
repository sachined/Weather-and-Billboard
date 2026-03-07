import { useState } from 'react';

export default function MusicSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const res = await fetch(`/api/spotify-search?query=${query}`);
    const data = await res.json();
    
    setResults(data.tracks?.items || []);
    setLoading(false);
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a track..."
        />
        <button type="submit">Search</button>
      </form>
      
      {loading && <p>Searching...</p>}
      {results.map((track) => (
        <div key={track.id}>
          <p>{track.name} - {track.artists[0]?.name}</p>
        </div>
      ))}
    </div>
  );
}