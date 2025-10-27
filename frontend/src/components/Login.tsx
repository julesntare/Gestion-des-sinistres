import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import axios from "axios"

function Login() {
  const [name, setUsername] = useState('')
  const [mot_de_passe, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await axios.post('http://localhost:3000/login', { name, mot_de_passe })
      localStorage.setItem("session", res.data.user.role_id)
      localStorage.setItem("user-id", res.data.user.id)
      const roleId = Number(localStorage.getItem("session"))

      alert("✅ Connexion réussie")

      if (roleId === 6) {
        navigate('/homeclient')
      } else if (roleId === 8) {
        navigate('/homeexpert')
      } else {
        navigate('/home')
      }
    } catch (err: any) {
      console.error(err)
      alert(err.response?.data?.message || "❌ Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-2xl">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          🔐 Connectez-vous à votre compte
        </h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Nom d'Utilisateur</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-2 w-full h-11 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Entrez votre nom d'utilisateur"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
            <input
              type="password"
              value={mot_de_passe}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full h-11 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Entrez votre mot de passe"
              required
            />
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center">
            <Link
              to="/register"
              className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition"
            >
              Créer un compte
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
