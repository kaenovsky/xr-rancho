import { useEffect, useState } from 'react';

// Define the type for Release
interface Release {
  id: number;
  version: string;
  description: string;
  download_link: string;
}

export default function Releases() {
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReleases() {
      try {
        const res = await fetch('/api/releases');
        if (!res.ok) throw new Error('Failed to fetch releases');
        const data = await res.json();
        setReleases(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchReleases();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Releases</h1>
      {releases.length > 0 ? (
        <ul>
          {releases.map((release) => (
            <li key={release.id}>
              <strong>Version:</strong> {release.version} <br />
              <strong>Description:</strong> {release.description} <br />
              <strong>Download Link:</strong> <a href={release.download_link}>{release.download_link}</a> <br />
            </li>
          ))}
        </ul>
      ) : (
        <p>No releases found</p>
      )}
    </div>
  );
}
