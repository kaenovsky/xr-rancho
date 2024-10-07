import { useState, useEffect } from 'react'
import supabase from '../utils/supabaseClient'
import { Github, Download, Edit2, Trash2, User } from 'lucide-react'

// Define the type for the release structure
interface Release {
  id: string
  version: string
  description: string
  download_link: string
  created_at?: string
}

export default function HomePage() {
  const [releases, setReleases] = useState<Release[]>([])
  const [version, setVersion] = useState('')
  const [description, setDescription] = useState('')
  const [downloadLink, setDownloadLink] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)

  // Function to fetch all releases
  const fetchReleases = async () => {
    const response = await fetch('/api/releases')
    const data = await response.json()
    setReleases(data)
  }

  // Check user session on mount
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setIsLoggedIn(!!session)
      // @ts-expect-error - Assuming user is typed correctly from Supabase, and should have 'user'
      setUser(session?.user || null)
      fetchReleases() // Fetch releases on component mount
    }
    checkSession()
  }, [])

  const handleLogin = async () => {
    const redirectTo = 
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000'
        : 'https://xr-rancho.vercel.app';
  
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo }
    });
    
    if (error) console.error('Login Error:', error.message);
  };
  

  // Handle logout
  const handleLogout = async () => {
    await supabase.auth.signOut()
    setIsLoggedIn(false)
    setUser(null)
  }

  const isAdmin = () => {
    // Check if the user's ID or email matches the admin credentials
    // @ts-expect-error - Assuming user is typed correctly from Supabase, and should have 'id'
    return user?.id === process.env.NEXT_PUBLIC_ADMIN_GITHUB_ID;
  };
  

  // Handle form submission for creating a new release
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const response = await fetch('/api/releases', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ version, description, download_link: downloadLink }),
    })

    if (response.ok) {
      await fetchReleases() // Refetch releases after successful creation
      setVersion('') // Reset form fields
      setDescription('')
      setDownloadLink('')
    } else {
      console.error('Failed to create release:', await response.json())
    }
  }

  // Handle edit release (same as before)
  const handleEdit = async (id: string) => {
    const updatedVersion = prompt('Enter new version:', '')
    const updatedDescription = prompt('Enter new description:', '')
    const updatedDownloadLink = prompt('Enter new download link:', '')

    if (updatedVersion && updatedDescription && updatedDownloadLink) {
      const response = await fetch(`/api/releases/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ version: updatedVersion, description: updatedDescription, download_link: updatedDownloadLink }),
      })

      if (response.ok) await fetchReleases()
      else console.error('Failed to update release:', await response.json())
    }
  }

  // Handle delete release
  const handleDelete = async (id: string) => {
    const response = await fetch(`/api/releases/${id}`, {
      method: 'DELETE',
    })

    if (response.ok) await fetchReleases()
    else console.error('Failed to delete release:', await response.json())
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      
      {/* Navbar */}
      <nav id="navbar" className="bg-gray-800 p-4 flex justify-between items-center">

      <h1 className="text-xl font-bold flex items-center">
        <img
          src="/icon-small.png"
          alt="Spacepong VR icon"
          className="w-12 h-12 mr-2"
        />
        Spacepong VR
      </h1>
      </nav>

      {/* Now on Sidequest banner */}
      <section id="banner" className="sticky top-0 z-50">
        <div className="w-full bg-gradient-to-r from-[#101227] to-[#4C518B] text-white py-4 px-4 flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
          <p className="font-medium text-center sm:text-left">
            <span className="md:hidden">Spacepong VR on SideQuest!</span>
            <span className="hidden md:inline">Spacepong VR is now available on the SideQuest store!</span>
          </p>
          <a
            href="https://sidequestvr.com/app/38206"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <img 
              src="https://sidequestvr.com/assets/images/branding/Get-it-on-SIDEQUEST.png" 
              alt="Get it on SideQuest" 
              className="h-10 w-auto"
            />
          </a>
        </div>      
      </section>

      {/* Hero Section */}
      <header id="hero" className="relative h-screen w-full overflow-hidden bg-fixed bg-center bg-cover" style={{ backgroundImage: "url('/hero.png')" }}>
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg">Spacepong VR 🚀</h2>
          <p className="text-xl md:text-2xl text-white mb-8 max-w-2xl drop-shadow-md">
            Experience intergalactic beer pong on Meta Quest.
          </p>
          <a
            href="#video"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded text-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            Watch Gameplay
          </a>
        </div>
      </header>

      {/* Releases Section */}
      <main className="container mx-auto px-4 py-8">
        <section id="releases" className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-center">Download release files (.apk)</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {releases.map((release, index) => (
              <div key={release.id} className={`bg-gray-800 rounded-lg shadow-lg overflow-hidden ${index === 0 ? 'ring-2 ring-blue-500' : 'opacity-80'}`}>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{release.version}</h3>
                  <p className="text-gray-300 mb-4">{release.description}</p>
                  <div className="flex justify-between items-center">
                    <a
                      href={release.download_link}
                      className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition duration-300"
                    >
                      <Download className="mr-2" /> Download
                    </a>
                    {isLoggedIn && isAdmin() && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(release.id)}
                          className="p-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md transition duration-300"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(release.id)}
                          className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition duration-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Form to add a new release */}
        {isLoggedIn && isAdmin() && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 text-center">Add New Release</h2>
            <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
              <div>
                <label htmlFor="version" className="block text-sm font-medium text-gray-300 mb-1">Version</label>
                <input
                  id="version"
                  type="text"
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              <div>
                <label htmlFor="downloadLink" className="block text-sm font-medium text-gray-300 mb-1">Download Link</label>
                <input
                  id="downloadLink"
                  type="text"
                  value={downloadLink}
                  onChange={(e) => setDownloadLink(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300"
              >
                Add Release
              </button>
            </form>
          </section>
        )}

        {/* Features Section */}
        <section id="features" className="py-12 bg-gray-900">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center text-white">Game Features</h2>
            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  title: "🥽 Target Devices",
                  content: "Meta Quest 2 & 3 available.",
                  image: "/img-bar-meta.png?height=200&width=400",
                  alt: "Meta Quest 2 headset"
                },
                {
                  title: "🌟 Game Mode",
                  content: "Single player Beer Pong. Feel the vastness of outer space.",
                  image: "/img-bar-game.png?height=200&width=400",
                  alt: "Image of NASA's satellite"
                },
                {
                  title: "🥚 Alpha Release",
                  content: "You are testing an early version of the game.",
                  image: "/img-bar-test.png?height=200&width=400",
                  alt: "Eggs in nest"
                }
              ].map((feature, index) => (
                <div key={index} className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105">
                  <img
                    src={feature.image}
                    alt={feature.alt}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
                    <p className="text-gray-300">{feature.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* Video Section */}
        <section id="video" className="py-16 bg-gray-900">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center text-white">Demo</h2>
            <div className="max-w-3xl mx-auto bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <video 
                className="w-full h-auto"
                controls
                preload="metadata"
                poster="/video-placeholder.png?height=720&width=1280"
              >
                <source src="/beer-pong-xr-gameplay.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="p-6">
                <p className="text-gray-300 text-center">
                  Watch the gameplay to know more about this beer pong in space experience.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section>
          <div className='text-center'>
            <h2 className="text-3xl font-bold mb-8 text-center">Contribute</h2>
            <a
              href="https://github.com/kaenovsky/xr-rancho"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition-colors duration-300"
            >
            <Github className="mr-2" />
              Follow up on GitHub
            </a>
          </div>
        </section>
      </main>

      <footer id="footer" className="bg-gray-800 text-center mt-12">
        <p className="pt-6">2024 Spacepong VR. 🍺🎮</p>
        <p className="mt-2 pb-6">Drink responsibly, play virtually! 🌠</p>

        {/* Admin Bar */}
        <div className="w-full bg-black text-gray-300 py-3 px-4 flex items-center justify-between mt-6">
          <div className="flex items-center space-x-2">
            <span className="text-gray-400">🔒 Admin Access</span>
          </div>
          <div>
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                  {/* @ts-expect-error - Assuming user_metadata is typed correctly from Supabase, and should have 'avatar_url' */}
                  {user?.user_metadata?.avatar_url ? (
                    /* @ts-expect-error - Assuming user_metadata is typed correctly from Supabase, and should have 'avatar_url' */
                    <img src={user.user_metadata.avatar_url} alt="User Avatar" className="w-full h-full rounded-full" />
                  ) : (
                    <User className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-gray-700 hover:bg-gray-600 text-gray-300 font-semibold py-1 px-3 rounded flex items-center space-x-1"
                >
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={handleLogin}
                className="bg-gray-700 hover:bg-gray-600 text-gray-300 font-semibold py-1 px-3 rounded flex items-center space-x-1"
              >
                <span>Login with GitHub</span>
              </button>
            )}
          </div>
        </div>
      </footer>
    </div>
  )
}
