import Sidenav from "./sidenav.tsx"
import Topbar from "./topbar.tsx"
import { useNavigate } from "react-router-dom"
// import { useEffect, useState } from "react"

function HomeExpert() {
   const navigate = useNavigate()
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidenav />

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <Topbar />

        {/* Dashboard content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <h1 className="text-2xl font-bold mb-6">Bienvenue sur votre espace expert</h1>

          {/* Dashboard cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-white rounded-2xl shadow p-6">
              <h2 className="text-lg font-semibold">📌 Sinistres assignés</h2>
              <p className="text-gray-600 mt-2">
                Consultez et traitez les dossiers de sinistres qui vous sont attribués.
              </p>
             <button
                onClick={() => navigate("/sinistres")}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Gérer les sinistres
              </button>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-lg font-semibold">📂 Gestion des documents</h2>
            <p className="text-gray-600 mt-2">
              Gérez vos rapports d’expertise, ajoutez et consultez vos documents liés aux sinistres.
            </p>
            <button
            onClick={() => navigate("/documents")} 
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              Gérer les documents
            </button>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-2xl shadow p-6">
              <h2 className="text-lg font-semibold">⚖️ Gestion des expertises</h2>
              <p className="text-gray-600 mt-2">
                Planifiez et suivez vos missions d’expertise, de l’évaluation à la résolution des sinistres.
              </p>
              <button
              onClick={() => navigate("/expertises")} 
              className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                Gérer les expertises
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default HomeExpert
