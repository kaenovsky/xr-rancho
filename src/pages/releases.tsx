import { useState, useEffect } from 'react';

interface Release {
  id: number;
  version: string;
  description: string;
  download_link: string;
  created_at?: string;
}

export default function ReleasesPage() {
  const [releases, setReleases] = useState<Release[]>([]);
  const [version, setVersion] = useState('');
  const [description, setDescription] = useState('');
  const [downloadLink, setDownloadLink] = useState('');

  // Fetch releases on component mount
  useEffect(() => {
    fetchReleases();
  }, []);

  // Function to fetch all releases
  const fetchReleases = async () => {
    const response = await fetch('/api/releases');
    const data = await response.json();
    setReleases(data);
  };

  // Handle form submission for creating a new release
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Send the POST request to create a new release
    const response = await fetch('/api/releases', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ version, description, download_link: downloadLink }),
    });

    // Refetch all releases after successful creation
    if (response.ok) {
      await fetchReleases(); // Fetch the updated list of releases
      setVersion(''); // Reset form fields
      setDescription('');
      setDownloadLink('');
    } else {
      console.error('Failed to create release:', await response.json());
    }
  };

  return (
    <div>
      <h1>Releases</h1>

      {/* List of Releases */}
      <ul>
        {releases.map((release) => (
          <li key={release.id}>
            <strong>Version:</strong> {release.version} <br />
            <strong>Description:</strong> {release.description} <br />
            <strong>Download Link:</strong> {release.download_link} <br />
            <hr />
          </li>
        ))}
      </ul>

      {/* Form to add a new release */}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Version</label>
          <input value={version} onChange={(e) => setVersion(e.target.value)} required />
        </div>
        <div>
          <label>Description</label>
          <input value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>
        <div>
          <label>Download Link</label>
          <input value={downloadLink} onChange={(e) => setDownloadLink(e.target.value)} required />
        </div>
        <button type="submit">Add Release</button>
      </form>
    </div>
  );
}
