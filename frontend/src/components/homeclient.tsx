import { useState, useEffect } from "react"
import Topbar from "./topbar.tsx"
import axios from "axios"
import { useNavigate } from "react-router-dom"

const API_URL = import.meta.env.VITE_API_URL || "${API_URL}"

interface Police {
  id: number
  numero_police: string
  type: string
  // add owner field in case backend provides it
  utilisateur_id?: number | string
}

function Modal({ isOpen, onClose, children }: { isOpen: boolean, onClose: () => void, children: React.ReactNode }) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96 relative">
        {children}
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
          onClick={onClose}
        >
          ✕
        </button>
      </div>
    </div>
  )
}

function HomeClient() {
  const navigate = useNavigate()

  const [polices, setPolices] = useState<Police[]>([])
  const [showAddModal, setShowAddModal] = useState(false)

  // sinistre form
  const [policeId, setPoliceId] = useState("")
  const [dateDeclaration, setDateDeclaration] = useState("")
  const [type, setType] = useState("")
  const [description, setDescription] = useState("")
  const [userId, setUserId] = useState<string>("")

  useEffect(() => {
    const storedUserId = localStorage.getItem("user-id")
    if (storedUserId) {
      setUserId(storedUserId)
      // fetch only polices for that user
      fetchPolices(storedUserId)
    } else {
      // still try to fetch all polices (fallback) or set empty
      fetchPolices()
    }
  }, [])

  /**
   * fetchPolices(uid?)
   * - Preferred: call backend endpoint that returns policies for a user:
   *     GET /viewpolices/:uid  OR  GET /viewpolices?utilisateur_id=uid
   * - Fallback: GET /viewpolices (all) then filter locally by utilisateur_id if that field exists
   */
  const fetchPolices = async (uid?: string) => {
    try {
      if (uid) {
        // try endpoint that accepts user id in path
        try {
          const res = await axios.get(`${API_URL}/viewpolices/${uid}`)
          setPolices(res.data)
          return
        } catch (e) {
          // path-style endpoint failed — try query param style
          try {
            const res2 = await axios.get(`${API_URL}/viewpolices`, { params: { utilisateur_id: uid } })
            setPolices(res2.data)
            return
          } catch (e2) {
            // fall through to generic fetch and local filter
          }
        }
      }

      // Generic fetch (returns all policies). We'll filter locally if possible.
      const all = await axios.get("${API_URL}/viewpolices")
      const data: Police[] = all.data

      if (uid) {
        // try to filter locally using utilisateur_id field if present
        const filtered = data.filter(p => {
          // compare as string to be robust
          return (p as any).utilisateur_id !== undefined
            ? String((p as any).utilisateur_id) === String(uid)
            : false
        })

        // if filtered list is non-empty, use it, otherwise keep empty (safer than showing all)
        setPolices(filtered.length ? filtered : [])
      } else {
        setPolices(data)
      }
    } catch (err) {
      console.log("fetchPolices error:", err)
    }
  }

  const handleAddSinistre = async () => {
    try {
      await axios.post("${API_URL}/createsinistres", {
        utilisateur_id: userId,
        police_id: policeId,
        date_declaration: dateDeclaration,
        type,
        description,
        statut: "en attente",
        montant_requis: 0.0,
        montant_approuvé: 0.0,
      })
      clearSinistreForm()
      setShowAddModal(false)
      alert("✅ Sinistre ajouté avec succès!")
    } catch (err: any) {
      console.log(err.response?.data || err)
    }
  }

  const clearSinistreForm = () => {
    setPoliceId("")
    setDateDeclaration("")
    setType("")
    setDescription("")
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Topbar />
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">Bienvenue sur votre espace client</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-lg font-semibold">📌 Déclarer un sinistre</h2>
            <p className="text-gray-600 mt-2">Signalez rapidement un nouvel incident auprès de votre assurance.</p>
            <button onClick={() => setShowAddModal(true)} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Déclarer
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-lg font-semibold">📑 Mes sinistres</h2>
            <p className="text-gray-600 mt-2">Consultez l’état de vos sinistres en cours et leur historique.</p>
            <button onClick={() => navigate("/claims")} className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              Voir mes sinistres
            </button>
          </div>
        </div>
      </main>

      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)}>
        <h2 className="text-xl font-bold mb-4">Ajouter un Sinistre</h2>

        <select
          className="w-full p-2 border rounded mb-2"
          value={policeId}
          onChange={e => setPoliceId(e.target.value)}
        >
          <option value="">Sélectionner une Police</option>
          {polices.map(p => (
            <option key={p.id} value={p.id}>{p.numero_police}</option>
          ))}
        </select>

        <input type="date" className="w-full p-2 border rounded mb-2" value={dateDeclaration} onChange={e => setDateDeclaration(e.target.value)} />
        <input type="text" placeholder="Type" className="w-full p-2 border rounded mb-2" value={type} onChange={e => setType(e.target.value)} />
        <textarea placeholder="Description" className="w-full p-2 border rounded mb-4" value={description} onChange={e => setDescription(e.target.value)} />

        <div className="flex justify-end gap-2">
          <button onClick={() => setShowAddModal(false)} className="px-4 py-2 bg-gray-200 rounded">Annuler</button>
          <button onClick={handleAddSinistre} className="px-4 py-2 bg-blue-600 text-white rounded">Enregistrer</button>
        </div>
      </Modal>
    </div>
  )
}

export default HomeClient
