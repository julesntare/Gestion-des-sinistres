import { useState, useEffect } from "react"
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"

const API_URL = import.meta.env.VITE_API_URL || "${API_URL}"

function Registration() {
  const [name, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [password1, setPassword1] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setTelephone] = useState("")
  const [role_id, setRole] = useState("")
  const [date_inscription, setDate_Inscription] = useState("")
  const [roles, setRoles] = useState<{ id: string | number; nom: string }[]>([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // Fetch roles when component mounts
  useEffect(() => {
    axios
      .get(`${API_URL}/viewrole`)
      .then((res) => setRoles(res.data))
      .catch((err) => console.error("Error fetching roles:", err))
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (password !== password1) {
      alert("❌ Passwords do not match")
      return
    }

    setLoading(true)
    axios
      .post(`${API_URL}/register`, {
        name,
        password,
        email,
        phone,
        role_id,
        date_inscription,
      })
      .then((res) => {
        alert("✅ Registration successful")
        console.log(res.data)
        navigate("/")
      })
      .catch((err) => {
        console.error(err)
        alert(err.response?.data?.message || "❌ Registration Failed")
      })
      .finally(() => setLoading(false))
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="w-full max-w-4xl p-8 bg-white rounded-2xl shadow-2xl">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          📝 Créer un compte
        </h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Nom d'Utilisateur</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-2 w-full h-11 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Entrez le nom d'utilisateur"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full h-11 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Entrez l'adresse e-mail"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Téléphone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setTelephone(e.target.value)}
              className="mt-2 w-full h-11 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Entrez le numéro de téléphone"
              required
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Rôle</label>
            <select
              value={role_id}
              onChange={(e) => setRole(e.target.value)}
              className="mt-2 w-full h-11 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              required
            >
              <option value="">-- Sélectionnez un rôle --</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.nom}
                </option>
              ))}
            </select>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full h-11 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Entrez le mot de passe"
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Confirmez le mot de passe</label>
            <input
              type="password"
              value={password1}
              onChange={(e) => setPassword1(e.target.value)}
              className="mt-2 w-full h-11 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Confirmez le mot de passe"
              required
            />
          </div>

          {/* Hidden Date */}
          <input
            type="date"
            value={date_inscription}
            onChange={(e) => setDate_Inscription(e.target.value)}
            hidden
          />
        </form>

        {/* Actions */}
        <div className="flex justify-between items-center mt-6">
          <Link
            to="/"
            className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition"
          >
            &larr; Retour
          </Link>
          <button
            onClick={handleSubmit as any}
            disabled={loading}
            className="px-6 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Enregistrement..." : "s'inscrire"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Registration
