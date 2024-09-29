import { useState, useEffect } from 'react';
import supabase from '../utils/supabaseClient';

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
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check user session on mount
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session); // Set login state based on session
    };

    checkUser();
    fetchReleases();
  }, []);

  // Function to fetch all releases
  const fetchReleases = async () => {
    const response = await fetch('/api/releases');
    const data = await response.json();
    setReleases(data);
  };

  // Handle GitHub OAuth login
  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/releases`,
      },
    });
    if (error) console.error('Login Error:', error.message);
  };

  // Handle logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
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

  // Handle delete release
const handleDelete = async (id: string) => {
  const response = await fetch(`/api/releases/${id}`, {
    method: 'DELETE',
  });

  if (response.ok) {
    // Filter out the deleted release from the state
    setReleases((prevReleases) => prevReleases.filter((release) => release.id !== id));
  } else {
    console.error('Failed to delete release:', await response.json());
  }
};

// Handle edit release
const handleEdit = async (id: string) => {
  const updatedVersion = prompt('Enter new version:', ''); // Prompt for new version
  const updatedDescription = prompt('Enter new description:', ''); // Prompt for new description
  const updatedDownloadLink = prompt('Enter new download link:', ''); // Prompt for new download link

  if (updatedVersion && updatedDescription && updatedDownloadLink) {
    const response = await fetch(`/api/releases/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        version: updatedVersion,
        description: updatedDescription,
        download_link: updatedDownloadLink,
      }),
    });

    if (response.ok) {
      // Refetch releases after successful update
      await fetchReleases();
    } else {
      console.error('Failed to update release:', await response.json());
    }
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
            {/* Show Edit/Delete options only if logged in */}
            {isLoggedIn && (
              <>
                <button onClick={() => handleEdit(release.id)}>Edit</button>
                <button onClick={() => handleDelete(release.id)}>Delete</button>
              </>
            )}
            <hr />
          </li>
        ))}
      </ul>

      {/* Show Create Form only if logged in */}
      {isLoggedIn ? (
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
      ) : (
        <p>Please log in to add new releases.</p>
      )}

      {/* Show login/logout buttons */}
      {!isLoggedIn ? (
        <button onClick={handleLogin}>Login with GitHub</button>
      ) : (
        <button onClick={handleLogout}>Logout</button>
      )}
    </div>
  );
}
