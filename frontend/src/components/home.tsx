import Sidenav from "./sidenav.tsx"
import Topbar from "./topbar.tsx"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"

function Home() {
  const navigate = useNavigate()

  const [stats, setStats] = useState({
    totalSinistres: 0,
    enAttente: 0,
    resolus: 0,
    expertsActifs: 0,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all sinistres
        const resSinistres = await fetch("http://localhost:3000/viewsinistres")
        const sinistres = await resSinistres.json()
        

        // ⚡️ If you have an experts endpoint, replace below with the correct one
        const resExperts = await fetch("http://localhost:3000/viewexpert")
        const experts = await resExperts.json()

        const total = sinistres.length
        const enAttente = sinistres.filter((s: any) => s.statut === "en attente").length
        const resolus = sinistres.filter((s: any) => s.statut === "resolu").length

        setStats({
          totalSinistres: total,
          enAttente,
          resolus,
          expertsActifs: experts.length,
        })
      } catch (error) {
        console.error("Erreur lors du chargement des stats:", error)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidenav />

      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="flex-1 p-6 overflow-y-auto">
          <h1 className="text-2xl font-bold mb-6">
            Bienvenue sur le tableau de bord administrateur
          </h1>

          {/* Statistics section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatCard label="Total des sinistres" value={stats.totalSinistres.toString()} />
            <StatCard label="En attente" value={stats.enAttente.toString()} />
            <StatCard label="Résolus" value={stats.resolus.toString()} />
            <StatCard label="Experts actifs" value={stats.expertsActifs.toString()} />
          </div>

          {/* Quick actions */}
          <h2 className="text-xl font-semibold mb-4">Gestion rapide</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Users */}
            <div className="bg-white rounded-2xl shadow p-6">
              <h3 className="text-lg font-semibold">👥 Utilisateurs</h3>
              <p className="text-gray-600 mt-2">Créez, modifiez ou supprimez des comptes utilisateurs.</p>
              <button
                onClick={() => navigate("/users")}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Gérer les utilisateurs
              </button>
            </div>

            {/* Sinistres */}
            <div className="bg-white rounded-2xl shadow p-6">
              <h3 className="text-lg font-semibold">📌 Les sinistres</h3>
              <p className="text-gray-600 mt-2">Consultez, attribuez et suivez les sinistres en cours.</p>
              <button
                onClick={() => navigate("/sinistres")}
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Gérer les sinistres
              </button>
            </div>

            {/* Experts */}
            <div className="bg-white rounded-2xl shadow p-6">
              <h3 className="text-lg font-semibold">👨‍💼 Experts</h3>
              <p className="text-gray-600 mt-2">Gérez les comptes et les activités des experts.</p>
              <button
                onClick={() => navigate("/experts")}
                className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Gérer les experts
              </button>
            </div>
          </div>
        </main>
      </div>
      </div>
    </div>
  )
}

export default Home

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  )
}
