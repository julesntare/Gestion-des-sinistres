import Sidenav from "./sidenav.tsx"
import Topbar from "./topbar.tsx"
import { useState, useEffect } from "react"
import axios from "axios"

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

function Sinistre() {
  const [sinistres, setSinistres] = useState<Sinistres[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [polices, setPolices] = useState<Police[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [selectedSinistre, setSelectedSinistre] = useState<Sinistres | null>(null)

  const [search, setSearch] = useState("")
  const [numeroSinistre, setNumeroSinistre] = useState("") // ✅ ADDED
  const [utilisateurId, setUtilisateurId] = useState("")
  const [policeId, setPoliceId] = useState("")
  const [expertId, setExpertId] = useState("")
  const [dateDeclaration, setDateDeclaration] = useState("")
  const [type, setType] = useState("")
  const [description, setDescription] = useState("")
  const [statut, setStatut] = useState("")
  const [montantRequis, setMontantRequis] = useState("")
  const [montantApprouve, setMontantApprouve] = useState("")

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
    axios.get("http://localhost:3000/viewsinistres")
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
    axios.get("http://localhost:3000/viewuser")
      .then(res => setUsers(Array.isArray(res.data) ? res.data : []))
      .catch(err => console.log(err))
  }

  const fetchPolices = () => {
    axios.get("http://localhost:3000/viewpolices")
      .then(res => setPolices(Array.isArray(res.data) ? res.data : []))
      .catch(err => console.log(err))
  }

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3000/deletesinistres/${id}`)
      setSinistres(prev => prev.filter(s => s.id !== id))
    } catch (err: any) {
      console.log(err.response?.data || err)
    }
  }

  const chosenExpertNumber = (): number | null => {
    if (expertId && expertId !== "") {
      const n = Number(expertId)
      return Number.isNaN(n) ? null : n
    }
    return currentExpertId ? Number(currentExpertId) : null
  }

  const handleAddSinistre = async () => {
    const expertToSend = chosenExpertNumber()
    if (!expertToSend) return alert("Veuillez choisir un expert.")

    try {
      await axios.post("http://localhost:3000/createsinistres", {
        Numero_Sinistre: numeroSinistre, // ✅ ADDED
        utilisateur_id: Number(utilisateurId),
        police_id: Number(policeId),
        expert: expertToSend,
        date_declaration: dateDeclaration,
        type,
        description,
        statut,
        montant_requis: Number(montantRequis),
        montant_approuvé: Number(montantApprouve),
      })
      fetchSinistres()
      clearForm()
      setShowAddModal(false)
    } catch (err: any) {
      console.error(err)
      alert("Erreur lors de l'ajout.")
    }
  }

  const handleUpdateSinistre = async () => {
    if (!selectedSinistre) return
    const expertToSend = chosenExpertNumber()
    if (!expertToSend) return alert("Veuillez choisir un expert.")

    try {
      await axios.put(`http://localhost:3000/updatesinistres/${selectedSinistre.id}`, {
        Numero_Sinistre: numeroSinistre, // ✅ ADDED
        utilisateur_id: Number(utilisateurId),
        police_id: Number(policeId),
        expert: expertToSend,
        date_declaration: dateDeclaration,
        type,
        description,
        statut,
        montant_requis: Number(montantRequis),
        montant_approuvé: Number(montantApprouve),
      })
      fetchSinistres()
      clearForm()
      setSelectedSinistre(null)
      setShowUpdateModal(false)
    } catch (err: any) {
      console.error(err)
      alert("Erreur lors de la mise à jour.")
    }
  }

  const clearForm = () => {
    setNumeroSinistre("") // ✅ ADDED
    setUtilisateurId("")
    setPoliceId("")
    setExpertId("")
    setDateDeclaration("")
    setType("")
    setDescription("")
    setStatut("")
    setMontantRequis("")
    setMontantApprouve("")
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

      {/* Add Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)}>
        <h2 className="text-xl font-bold mb-4">Ajouter un Sinistre</h2>

        <input
          type="text"
          placeholder="Numero du Sinistre"
          className="w-full p-2 border rounded mb-2"
          value={numeroSinistre}
          onChange={(e) => setNumeroSinistre(e.target.value)}
        />

        {/* Rest of modal stays same */}
      </Modal>

      {/* Update Modal */}
      <Modal isOpen={showUpdateModal} onClose={() => setShowUpdateModal(false)}>
        <h2 className="text-xl font-bold mb-4">Modifier Sinistre</h2>

        <input
          type="text"
          placeholder="Numero du Sinistre"
          className="w-full p-2 border rounded mb-2"
          value={numeroSinistre}
          onChange={(e) => setNumeroSinistre(e.target.value)}
        />

        {/* Rest of modal stays same */}
      </Modal>

    </div>
  )
}

export default Sinistre
