import Sidenav from "./sidenav.tsx"
import Topbar from "./topbar.tsx"
import { useState, useEffect } from "react"
import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"

interface Sinistres {
  id: number
  Numero_Sinistre: string   // ✅ ADDED
  utilisateur_id: number
  police_id: number
  expert?: number | null
  date_declaration: string
  type: string
  description: string
  statut: string
  montant_requis: number
  montant_approuvé: number
}

interface User {
  id: number
  nom: string
  role_id: number
}

interface Police {
  id: number
  numero_police: string
  type: string
}

function Sinistre() {
  const [sinistres, setSinistres] = useState<Sinistres[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [polices, setPolices] = useState<Police[]>([])

  const [search, setSearch] = useState("")

  const [currentExpertId, setCurrentExpertId] = useState<string>("")

  useEffect(() => {
    const storedExpertId = localStorage.getItem("user-id")
    if (storedExpertId) {
      setCurrentExpertId(storedExpertId)
    }
    fetchSinistres()
    fetchUsers()
    fetchPolices()
  }, [])

  const fetchSinistres = () => {
    axios.get(`${API_URL}/viewsinistres`)
      .then(res => {
        const arr: any[] = Array.isArray(res.data) ? res.data : []
        const normalized: Sinistres[] = arr.map((s: any) => ({
          ...s,
          expert: s.expert === null || s.expert === undefined ? null : Number(s.expert)
        }))
        setSinistres(normalized)
      })
      .catch(err => console.error(err))
  }

  const fetchUsers = () => {
    axios.get(`${API_URL}/viewuser`)
      .then(res => setUsers(Array.isArray(res.data) ? res.data : []))
      .catch(err => console.log(err))
  }

  const fetchPolices = () => {
    axios.get(`${API_URL}/viewpolices`)
      .then(res => setPolices(Array.isArray(res.data) ? res.data : []))
      .catch(err => console.log(err))
  }

  const filteredSinistres = sinistres
    .filter(s => s.expert === Number(currentExpertId))
    .filter((s) => {
      const clientName = users.find(u => u.id === s.utilisateur_id)?.nom || ""
      return (
        s.Numero_Sinistre?.toLowerCase().includes(search.toLowerCase()) ||
        clientName.toLowerCase().includes(search.toLowerCase()) ||
        s.type.toLowerCase().includes(search.toLowerCase())
      )
    })

  const expertNameFor = (id?: number | null) => {
    if (id == null) return "N/A"
    return users.find(u => u.id === id)?.nom || String(id)
  }

  return (
    <div className="flex">
      <Sidenav />
      <div className="bg-gray-100 h-screen w-screen">
        <Topbar />
        <div className="p-3 m-5 mt-1">

          <div className="flex justify-between items-center mb-4">
            <input
              type="text"
              placeholder="Rechercher un sinistre..."
              className="w-1/3 p-2 border rounded"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="w-full bg-white rounded-lg flex flex-col">
            <h1 className="font-medium text-xl px-6 py-4">Liste Des Sinistres</h1>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <table className="min-w-full gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th>#</th>
                    <th>Numero du Sinistre</th> {/* ✅ ADDED */}
                    <th>Client</th>
                    <th>Police</th>
                    <th>Expert</th>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSinistres.map((s, i) => (
                    <tr key={s.id}>
                      <td>{i + 1}</td>
                      <td>{s.Numero_Sinistre}</td> {/* ✅ ADDED */}
                      <td>{users.find(u => u.id === s.utilisateur_id)?.nom}</td>
                      <td>{polices.find(p => p.id === s.police_id)?.type}</td>
                      <td>{expertNameFor(s.expert)}</td>
                      <td>{s.date_declaration}</td>
                      <td>{s.type}</td>
                      <td>{s.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Sinistre
