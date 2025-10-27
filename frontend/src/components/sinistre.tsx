import Sidenav from "./sidenav.tsx"
import Topbar from "./topbar.tsx"
import { useState, useEffect } from "react"
import axios from "axios"

interface Sinistres {
  id: number
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
    // Get the logged-in expert's ID from localStorage
    const storedExpertId = localStorage.getItem("user-id")
    if (storedExpertId) {
      setCurrentExpertId(storedExpertId)
      console.log("[SUCCESS] ✅ Found expert ID from localStorage['user-id']:", storedExpertId)
    } else {
      console.warn("[WARNING] ⚠️ No user-id found in localStorage")
    }
    fetchSinistres()
    fetchUsers()
    fetchPolices()
  }, [])

  // Fetch ALL sinistres, then filter by expert on frontend
  const fetchSinistres = () => {
    axios.get("http://localhost:3000/viewsinistres")
      .then(res => {
        const arr: any[] = Array.isArray(res.data) ? res.data : []
        const normalized: Sinistres[] = arr.map((s: any) => {
          let rawExpert = undefined
          if (s.expert !== undefined) rawExpert = s.expert
          else if (s.expert_id !== undefined) rawExpert = s.expert_id
          else if (s.expertId !== undefined) rawExpert = s.expertId

          const parsedExpert = rawExpert === null || rawExpert === undefined || rawExpert === "" ? null : Number(rawExpert)
          return {
            ...s,
            expert: parsedExpert === null || Number.isNaN(parsedExpert) ? null : parsedExpert
          }
        })
        setSinistres(normalized)
        console.log(`[Sinistre] Fetched ${normalized.length} total sinistres from database`)
      })
      .catch(err => {
        console.error("[Sinistre] fetchSinistres error:", err)
      })
  }

  const fetchUsers = () => {
    axios.get("http://localhost:3000/viewuser")
      .then(res => {
        setUsers(Array.isArray(res.data) ? res.data : [])
      })
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
    if (!utilisateurId || !policeId) return alert("Veuillez choisir un client et une police.")
    const expertToSend = chosenExpertNumber()
    if (expertToSend === null) return alert("Veuillez choisir un expert.")

    try {
      await axios.post("http://localhost:3000/createsinistres", {
        utilisateur_id: Number(utilisateurId),
        police_id: Number(policeId),
        expert: expertToSend,
        date_declaration: dateDeclaration,
        type,
        description,
        statut,
        montant_requis: montantRequis ? Number(montantRequis) : 0,
        montant_approuvé: montantApprouve ? Number(montantApprouve) : 0,
      })
      fetchSinistres()
      clearForm()
      setShowAddModal(false)
    } catch (err: any) {
      console.error("[Sinistre] handleAddSinistre error:", err.response?.data || err)
      alert("Server error when creating sinistre.")
    }
  }

  const handleUpdateSinistre = async () => {
    if (!selectedSinistre) return
    if (!utilisateurId || !policeId) return alert("Veuillez choisir un client et une police.")
    const expertToSend = chosenExpertNumber()
    if (expertToSend === null) return alert("Veuillez choisir un expert.")

    try {
      await axios.put(`http://localhost:3000/updatesinistres/${selectedSinistre.id}`, {
        utilisateur_id: Number(utilisateurId),
        police_id: Number(policeId),
        expert: expertToSend,
        date_declaration: dateDeclaration,
        type,
        description,
        statut,
        montant_requis: montantRequis ? Number(montantRequis) : 0,
        montant_approuvé: montantApprouve ? Number(montantApprouve) : 0,
      })
      fetchSinistres()
      clearForm()
      setSelectedSinistre(null)
      setShowUpdateModal(false)
    } catch (err: any) {
      console.error("[Sinistre] handleUpdateSinistre error:", err.response?.data || err)
      alert("Server error when updating sinistre.")
    }
  }

  const clearForm = () => {
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

  // Filter sinistres: FIRST by expert, THEN by search term
  const filteredSinistres = sinistres
    .filter(s => {
      // Filter by logged-in expert ID
      if (!currentExpertId) {
        return false;
      }
      
      const expertMatch = s.expert === Number(currentExpertId);
      return expertMatch;
    })
    .filter((s) => {
      // Then filter by search term
      const clientName = users.find(u => u.id === s.utilisateur_id)?.nom || ""
      const policeType = polices.find(p => p.id === s.police_id)?.type || ""
      return (
        s.id.toString().includes(search.toLowerCase()) ||
        clientName.toLowerCase().includes(search.toLowerCase()) ||
        policeType.toLowerCase().includes(search.toLowerCase()) ||
        s.type.toLowerCase().includes(search.toLowerCase()) ||
        s.description.toLowerCase().includes(search.toLowerCase()) ||
        s.statut.toLowerCase().includes(search.toLowerCase())
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
          {/* Header */}
          <div className="flex justify-between items-center mt-2 ml-2 mb-5">
            <div>
              <h1 className="font-bold text-2xl">Gestion Des Sinistres</h1>
              <h2 className="font-light">Suivi des Sinistres</h2>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 text-sm h-10 px-4 py-2 bg-blue-600 hover:bg-blue-500 shadow text-white rounded-sm"
            >
              + Nouveau Sinistre
            </button>
          </div>

          {/* Search Bar */}
          <div className="flex justify-between items-center mb-4">
            <input
              type="text"
              placeholder="Rechercher un sinistre..."
              className="w-1/3 p-2 border rounded"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Table */}
          <div className="w-full h-110 mt-2 bg-white rounded-lg flex flex-col">
            <h1 className="font-medium text-xl px-6 py-4">Liste Des Sinistres</h1>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <table className="min-w-full gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2">#</th>
                    <th className="px-4 py-2">Client</th>
                    <th className="px-4 py-2">Police</th>
                    <th className="px-4 py-2">Expert</th>
                    <th className="px-4 py-2">Date Déclaration</th>
                    <th className="px-4 py-2">Type</th>
                    <th className="px-4 py-2">Description</th>
                    <th className="px-4 py-2">Statut</th>
                    <th className="px-4 py-2">Montant Requis</th>
                    <th className="px-4 py-2">Montant Approuvé</th>
                    <th className="px-4 py-2 text-center" colSpan={2}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSinistres.map((s, i) => (
                    <tr key={s.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2">{i + 1}</td>
                      <td className="px-4 py-2">{users.find(u => u.id === s.utilisateur_id)?.nom || s.utilisateur_id}</td>
                      <td className="px-4 py-2">{polices.find(p => p.id === s.police_id)?.type || s.police_id}</td>
                      <td className="px-4 py-2">{expertNameFor(s.expert)}</td>
                      <td className="px-4 py-2">{s.date_declaration}</td>
                      <td className="px-4 py-2">{s.type}</td>
                      <td className="px-4 py-2">{s.description}</td>
                      <td className="px-4 py-2">{s.statut}</td>
                      <td className="px-4 py-2">{s.montant_requis}</td>
                      <td className="px-4 py-2">{s.montant_approuvé}</td>
                      <td className="px-4 py-2 text-center">
                        <button
                          onClick={() => {
                            setSelectedSinistre(s)
                            setUtilisateurId(String(s.utilisateur_id))
                            setPoliceId(String(s.police_id))
                            setExpertId(s.expert ? String(s.expert) : "")
                            setDateDeclaration(s.date_declaration)
                            setType(s.type)
                            setDescription(s.description)
                            setStatut(s.statut)
                            setMontantRequis(String(s.montant_requis))
                            setMontantApprouve(String(s.montant_approuvé))
                            setShowUpdateModal(true)
                          }}
                          className="text-blue-600 hover:underline"
                        >
                          Update
                        </button>
                      </td>
                      <td className="px-4 py-2 text-center">
                        <button onClick={() => handleDelete(s.id)} className="text-red-600 hover:underline">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredSinistres.length === 0 && (
                    <tr>
                      <td colSpan={12} className="text-center py-4 text-gray-500">
                        {currentExpertId 
                          ? `Aucun sinistre assigné à l'expert #${currentExpertId}` 
                          : "⚠️ Expert ID non trouvé"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Add Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)}>
        <h2 className="text-xl font-bold mb-4">Ajouter un Sinistre</h2>

        <select
          className="w-full p-2 border rounded mb-2"
          value={utilisateurId}
          onChange={e => setUtilisateurId(e.target.value)}
        >
          <option value="">Sélectionner un Client</option>
          {users.filter(u => u.role_id === 6).map(u => (
            <option key={u.id} value={u.id}>{u.nom}</option>
          ))}
        </select>

        <select
          className="w-full p-2 border rounded mb-2"
          value={expertId}
          onChange={e => setExpertId(e.target.value)}
        >
          <option value="">Sélectionner un Expert</option>
          {users.filter(u => u.role_id === 8).map(u => (
            <option key={u.id} value={u.id}>{u.nom}</option>
          ))}
        </select>

        <select className="w-full p-2 border rounded mb-2" value={policeId} onChange={e => setPoliceId(e.target.value)}>
          <option value="">Sélectionner une Police</option>
          {polices.map(p => (
            <option key={p.id} value={p.id}>{p.type}</option>
          ))}
        </select>

        <input type="date" className="w-full p-2 border rounded mb-2" value={dateDeclaration} onChange={e => setDateDeclaration(e.target.value)} />
        <input type="text" placeholder="Type" className="w-full p-2 border rounded mb-2" value={type} onChange={e => setType(e.target.value)} />
        <textarea placeholder="Description" className="w-full p-2 border rounded mb-2" value={description} onChange={e => setDescription(e.target.value)} />
        <select className="w-full p-2 border rounded mb-2" value={statut} onChange={e => setStatut(e.target.value)}>
          <option value="">Sélectionner un Statut</option>
          <option value="en attente">En attente</option>
          <option value="resolu">Résolu</option>
          <option value="Rejeté">Rejeté</option>
        </select>

        <input type="number" placeholder="Montant Requis" className="w-full p-2 border rounded mb-2" value={montantRequis} onChange={e => setMontantRequis(e.target.value)} />
        <input type="number" placeholder="Montant Approuvé" className="w-full p-2 border rounded mb-4" value={montantApprouve} onChange={e => setMontantApprouve(e.target.value)} />

        <div className="flex justify-end gap-2">
          <button onClick={() => setShowAddModal(false)} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
          <button onClick={handleAddSinistre} className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
        </div>
      </Modal>

      {/* Update Modal */}
      <Modal isOpen={showUpdateModal} onClose={() => setShowUpdateModal(false)}>
        <h2 className="text-xl font-bold mb-4">Mettre à jour le Sinistre</h2>

        <select
          className="w-full p-2 border rounded mb-2"
          value={utilisateurId}
          onChange={e => setUtilisateurId(e.target.value)}
        >
          <option value="">Sélectionner un Client</option>
          {users.filter(u => u.role_id === 6).map(u => (
            <option key={u.id} value={u.id}>{u.nom}</option>
          ))}
        </select>

        <select
          className="w-full p-2 border rounded mb-2"
          value={expertId}
          onChange={e => setExpertId(e.target.value)}
        >
          <option value="">Sélectionner un Expert</option>
          {users.filter(u => u.role_id === 8).map(u => (
            <option key={u.id} value={u.id}>{u.nom}</option>
          ))}
        </select>

        <select className="w-full p-2 border rounded mb-2" value={policeId} onChange={e => setPoliceId(e.target.value)}>
          <option value="">Sélectionner une Police</option>
          {polices.map(p => (
            <option key={p.id} value={p.id}>{p.type}</option>
          ))}
        </select>

        <input type="date" className="w-full p-2 border rounded mb-2" value={dateDeclaration} onChange={e => setDateDeclaration(e.target.value)} />
        <input type="text" placeholder="Type" className="w-full p-2 border rounded mb-2" value={type} onChange={e => setType(e.target.value)} />
        <textarea placeholder="Description" className="w-full p-2 border rounded mb-2" value={description} onChange={e => setDescription(e.target.value)} />
        <select className="w-full p-2 border rounded mb-2" value={statut} onChange={e => setStatut(e.target.value)}>
          <option value="">Sélectionner un Statut</option>
          <option value="en attente">En attente</option>
          <option value="resolu">Résolu</option>
          <option value="Rejeté">Rejeté</option>
        </select>

        <input type="number" placeholder="Montant Requis" className="w-full p-2 border rounded mb-2" value={montantRequis} onChange={e => setMontantRequis(e.target.value)} />
        <input type="number" placeholder="Montant Approuvé" className="w-full p-2 border rounded mb-4" value={montantApprouve} onChange={e => setMontantApprouve(e.target.value)} />

        <div className="flex justify-end gap-2">
          <button onClick={() => setShowUpdateModal(false)} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
          <button onClick={handleUpdateSinistre} className="px-4 py-2 bg-blue-600 text-white rounded">Update</button>
        </div>
      </Modal>
    </div>
  )
}

export default Sinistre