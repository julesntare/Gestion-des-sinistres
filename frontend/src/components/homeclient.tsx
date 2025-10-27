import { useState, useEffect } from "react"
import Topbar from "./topbar.tsx"
import axios from "axios"
import { useNavigate } from "react-router-dom"



interface Sinistre {
  id: number
  utilisateur_id: number
  police_id: number
  date_declaration: string
  type: string
  description: string
  statut: string
  montant_requis: number
  montant_approuvé: number
}

interface Police {
  id: number
  numero_police: string
  type: string
}


// Reuse the same modal component from Claims
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

  const [sinistres, setSinistres] = useState<Sinistre[]>([])
  const [polices, setPolices] = useState<Police[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDocModal, setShowDocModal] = useState(false)
  const [expanded, setExpanded] = useState<{ [key: number]: boolean }>({})
  const [selectedSinistreId, setSelectedSinistreId] = useState<number | null>(null)

  // sinistre form
  const [policeId, setPoliceId] = useState("")
  const [dateDeclaration, setDateDeclaration] = useState("")
  const [type, setType] = useState("")
  const [description, setDescription] = useState("")
  const [userId, setUserId] = useState("")

  // document form
  // const [titre, setTitre] = useState("")
  // const [docType, setDocType] = useState("")
  // const [docDescription, setDocDescription] = useState("")
  // const [documentFile, setDocumentFile] = useState<File | null>(null)

  useEffect(() => {
    const storedUserId = localStorage.getItem("user-id")
    if (storedUserId) {
      setUserId(storedUserId)
      fetchSinistres(storedUserId)
    }
    fetchPolices()
  }, [])

  const fetchSinistres = (uid: string) => {
    axios.get(`http://localhost:3000/viewsinistres/${uid}`)
      .then(res => setSinistres(res.data))
      .catch(err => console.log(err))
  }

  const fetchPolices = () => {
    axios.get("http://localhost:3000/viewpolices")
      .then(res => setPolices(res.data))
      .catch(err => console.log(err))
  }

  const handleAddSinistre = async () => {
    try {
      await axios.post("http://localhost:3000/createsinistres", {
        utilisateur_id: userId,
        police_id: policeId,
        date_declaration: dateDeclaration,
        type,
        description,
        statut: "en attente",
        montant_requis: 0.0,
        montant_approuvé: 0.0,
      })
      if (userId) fetchSinistres(userId)
      clearSinistreForm()
      setShowAddModal(false)
    } catch (err: any) {
      console.log(err.response?.data || err)
    }
  }

  // const handleAddDocument = async () => {
  //   if (!selectedSinistreId) return
  //   try {
  //     const formData = new FormData()
  //     formData.append("sinistre_id", selectedSinistreId.toString())
  //     formData.append("titre", titre)
  //     formData.append("type", docType)
  //     formData.append("description", docDescription)
  //     if (documentFile) formData.append("chemin_fichier", documentFile)

  //     await axios.post("http://localhost:3000/createdocument", formData, {
  //       headers: { "Content-Type": "multipart/form-data" },
  //     })

  //     setShowDocModal(false)
  //     clearDocumentForm()
  //   } catch (err: any) {
  //     console.log(err.response?.data || err)
  //   }
  // }

  const clearSinistreForm = () => {
    setPoliceId("")
    setDateDeclaration("")
    setType("")
    setDescription("")
  }

  // const clearDocumentForm = () => {
  //   setTitre("")
  //   setDocType("")
  //   setDocDescription("")
  //   setDocumentFile(null)
  // }
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Topbar */}
      <Topbar />

      {/* Main content */}
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">Bienvenue sur votre espace client</h1>

        {/* Dashboard cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-lg font-semibold">📌 Déclarer un sinistre</h2>
            <p className="text-gray-600 mt-2">
              Signalez rapidement un nouvel incident auprès de votre assurance.
            </p>
            <button
            onClick={() => setShowAddModal(true)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Déclarer
          </button>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-lg font-semibold">📑 Mes sinistres</h2>
            <p className="text-gray-600 mt-2">
              Consultez l’état de vos sinistres en cours et leur historique.
            </p>
            <button
              onClick={() => navigate("/claims")}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Voir mes sinistres
            </button>
          </div>

          {/* Card 3 */}
          {/* <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-lg font-semibold">📂 Mes documents</h2>
            <p className="text-gray-600 mt-2">
              Téléchargez ou visualisez vos pièces justificatives.
            </p>
            <button
            onClick={() => navigate("/Documents")}
              className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Gérer mes documents
            </button>
          </div> */}
        </div>
      </main>

      {/* Add Sinistre Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)}>
        <h2 className="text-xl font-bold mb-4">Ajouter un Sinistre</h2>

        <select
          className="w-full p-2 border rounded mb-2"
          value={policeId}
          onChange={e => setPoliceId(e.target.value)}
        >
          <option value="">Sélectionner une Police</option>
          {polices.map(p => (
            <option key={p.id} value={p.id}>{p.type}</option>
          ))}
        </select>

        <input type="date" className="w-full p-2 border rounded mb-2" value={dateDeclaration} onChange={e => setDateDeclaration(e.target.value)} />
        <input type="text" placeholder="Type" className="w-full p-2 border rounded mb-2" value={type} onChange={e => setType(e.target.value)} />
        <textarea placeholder="Description" className="w-full p-2 border rounded mb-4" value={description} onChange={e => setDescription(e.target.value)} />

        <div className="flex justify-end gap-2">
          <button onClick={() => setShowAddModal(false)} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
          <button onClick={handleAddSinistre} className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
        </div>
      </Modal>
    </div>
  )
}

export default HomeClient
