import Sidenav from "./sidenav.tsx"
import Topbar from "./topbar.tsx"
import { useState, useEffect } from "react"
import axios from "axios"

interface Sinistre {
  id: number
  Numero_Sinistre: string
  utilisateur_id: number
  police_id: number
  expert?: number
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

function Sinistres() {
  const [sinistres, setSinistres] = useState<Sinistre[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [polices, setPolices] = useState<Police[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [selectedSinistre, setSelectedSinistre] = useState<Sinistre | null>(null)

  const [search, setSearch] = useState("")

  const [NumeroSinistre, setNumeroSinistre] = useState("")
  const [utilisateurId, setUtilisateurId] = useState("")
  const [policeId, setPoliceId] = useState("")
  const [expert, setExpert] = useState("")
  const [dateDeclaration, setDateDeclaration] = useState("")
  const [type, setType] = useState("")
  const [description, setDescription] = useState("")
  const [statut, setStatut] = useState("")
  const [montantRequis, setMontantRequis] = useState("")
  const [montantApprouve, setMontantApprouve] = useState("")

  useEffect(() => {
    fetchSinistres()
    fetchUsers()
    fetchPolices()
  }, [])

  const fetchSinistres = () => {
    axios.get("http://localhost:3000/viewsinistres")
      .then(res => setSinistres(res.data))
      .catch(err => console.log(err))
  }

  const fetchUsers = () => {
    axios.get("http://localhost:3000/viewuser")
      .then(res => setUsers(res.data))
      .catch(err => console.log(err))
  }

  const fetchPolices = () => {
    axios.get("http://localhost:3000/viewpolices")
      .then(res => setPolices(res.data))
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

  const handleAddSinistre = async () => {
    try {
      await axios.post("http://localhost:3000/createsinistres", {
        Numero_Sinistre: NumeroSinistre,
        utilisateur_id: utilisateurId,
        police_id: policeId,
        expert: expert,
        date_declaration: dateDeclaration,
        type,
        description,
        statut,
        montant_requis: montantRequis,
        montant_approuvé: montantApprouve,
      })
      fetchSinistres()
      clearForm()
      setShowAddModal(false)
    } catch (err: any) {
      console.log(err.response?.data || err)
    }
  }

  const handleUpdateSinistre = async () => {
    if (!selectedSinistre) return
    try {
      await axios.put(`http://localhost:3000/updatesinistres/${selectedSinistre.id}`, {
        Numero_Sinistre: NumeroSinistre,
        utilisateur_id: utilisateurId,
        police_id: policeId,
        expert: expert,
        date_declaration: dateDeclaration,
        type,
        description,
        statut,
        montant_requis: montantRequis,
        montant_approuvé: montantApprouve,
      })
      fetchSinistres()
      clearForm()
      setSelectedSinistre(null)
      setShowUpdateModal(false)
    } catch (err: any) {
      console.log(err.response?.data || err)
    }
  }

  const clearForm = () => {
    setNumeroSinistre("")
    setUtilisateurId("")
    setPoliceId("")
    setExpert("")
    setDateDeclaration("")
    setType("")
    setDescription("")
    setStatut("")
    setMontantRequis("")
    setMontantApprouve("")
  }

  const filteredSinistres = sinistres.filter((s) => {
    const clientName = users.find(u => u.id === s.utilisateur_id)?.nom || ""
    const policeType = polices.find(p => p.id === s.police_id)?.numero_police || ""

    return (
      s.id.toString().includes(search.toLowerCase()) ||
      clientName.toLowerCase().includes(search.toLowerCase()) ||
      policeType.toLowerCase().includes(search.toLowerCase()) ||
      s.type.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase()) ||
      s.statut.toLowerCase().includes(search.toLowerCase())
    )
  })

  return (
    <div className="flex">
      <Sidenav />
      <div className="bg-gray-100 h-screen w-screen">
        <Topbar />
        <div className="p-3 m-5 mt-1">
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
              
          <div className="flex justify-between items-center mb-4">
            <input
              type="text"
              placeholder="Rechercher un sinistre..."
              className="w-1/3 p-2 border rounded"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="w-full h-110 mt-2 bg-white rounded-lg flex flex-col">
            <h1 className="font-medium text-xl px-6 py-4">Liste Des Sinistres</h1>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <table className="min-w-full gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2">#</th>
                    <th className="px-4 py-2">Numero du Sinistre</th>
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
                      <td className="px-4 py-2">{s.Numero_Sinistre}</td>
                      <td className="px-4 py-2">{users.find(u => u.id === s.utilisateur_id)?.nom || s.utilisateur_id}</td>
                      <td className="px-4 py-2">{polices.find(p => p.id === s.police_id)?.numero_police || s.police_id}</td>
                      <td className="px-4 py-2">{users.find(u => u.id === s.expert)?.nom || s.expert || "-"}</td>
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
                            setNumeroSinistre(s.Numero_Sinistre)
                            setUtilisateurId(String(s.utilisateur_id))
                            setPoliceId(String(s.police_id))
                            setExpert(s.expert ? String(s.expert) : "")
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
                          Mise à jour
                        </button>
                      </td>
                      <td className="px-4 py-2 text-center">
                        <button onClick={() => handleDelete(s.id)} className="text-red-600 hover:underline">
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredSinistres.length === 0 && (
                    <tr>
                      <td colSpan={13} className="text-center py-4 text-gray-500">Aucun sinistre trouvé</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)}>
         <h2 className="text-xl font-bold mb-4">Ajouter un Sinistre</h2>

        <input type="text" placeholder="Numero du Sinistre" className="w-full p-2 border rounded mb-2" value={NumeroSinistre} onChange={e => setNumeroSinistre(e.target.value)} />
        <select
          className="w-full p-2 border rounded mb-2"
          value={utilisateurId}
          onChange={e => setUtilisateurId(e.target.value)}
        >
           <option value="">Sélectionner un Client</option>
           {users
             .filter(u => u.role_id === 6)
             .map(u => (
               <option key={u.id} value={u.id}>{u.nom}</option>
             ))}
         </select>

         <select
           className="w-full p-2 border rounded mb-2"
           value={expert}
           onChange={e => setExpert(e.target.value)}
         >
           <option value="">Sélectionner un Expert</option>
           {users
             .filter(u => u.role_id === 8)
             .map(u => (
               <option key={u.id} value={u.id}>{u.nom}</option>
             ))}
         </select>

         <select className="w-full p-2 border rounded mb-2" value={policeId} onChange={e => setPoliceId(e.target.value)}>
           <option value="">Sélectionner une Police</option>
           {polices.map(p => (
             <option key={p.id} value={p.id}>{p.numero_police}</option>
           ))}
         </select>

         <input type="date" className="w-full p-2 border rounded mb-2" value={dateDeclaration} onChange={e => setDateDeclaration(e.target.value)} />
         <input type="text" placeholder="Type" className="w-full p-2 border rounded mb-2" value={type} onChange={e => setType(e.target.value)} />
         <textarea placeholder="Description" className="w-full p-2 border rounded mb-2" value={description} onChange={e => setDescription(e.target.value)} />
         <select
           className="w-full p-2 border rounded mb-2"
           value={statut}
           onChange={e => setStatut(e.target.value)}
         >
           <option value="">Sélectionner un Statut</option>
           <option value="en attente">En attente</option>
           <option value="resolu">Résolu</option>
           <option value="Rejeté">Rejeté</option>
         </select>
         <input type="number" placeholder="Montant Requis" className="w-full p-2 border rounded mb-2" value={montantRequis} onChange={e => setMontantRequis(e.target.value)} />
         <input type="number" placeholder="Montant Approuvé" className="w-full p-2 border rounded mb-4" value={montantApprouve} onChange={e => setMontantApprouve(e.target.value)} />

         <div className="flex justify-end gap-2">
           <button onClick={() => setShowAddModal(false)} className="px-4 py-2 bg-gray-200 rounded">Annuler</button>
           <button onClick={handleAddSinistre} className="px-4 py-2 bg-blue-600 text-white rounded">Enregistrer</button>
         </div>
       </Modal>

       <Modal isOpen={showUpdateModal} onClose={() => setShowUpdateModal(false)}>
         <h2 className="text-xl font-bold mb-4">Mettre à jour le Sinistre</h2>

        <input type="text" placeholder="Numero du Sinistre" className="w-full p-2 border rounded mb-2" value={NumeroSinistre} onChange={e => setNumeroSinistre(e.target.value)} />
         <select
           className="w-full p-2 border rounded mb-2"
           value={utilisateurId}
           onChange={e => setUtilisateurId(e.target.value)}
         >
           <option value="">Sélectionner un Client</option>
           {users
             .filter(u => u.role_id === 6)
             .map(u => (
               <option key={u.id} value={u.id}>{u.nom}</option>
             ))}
         </select>

         <select
           className="w-full p-2 border rounded mb-2"
           value={expert}
           onChange={e => setExpert(e.target.value)}
         >
           <option value="">Sélectionner un Expert</option>
           {users
             .filter(u => u.role_id === 8)
             .map(u => (
               <option key={u.id} value={u.id}>{u.nom}</option>
             ))}
         </select>

         <select className="w-full p-2 border rounded mb-2" value={policeId} onChange={e => setPoliceId(e.target.value)}>
           <option value="">Sélectionner une Police</option>
           {polices.map(p => (
             <option key={p.id} value={p.id}>{p.numero_police}</option>
           ))}
         </select>

         <input type="date" className="w-full p-2 border rounded mb-2" value={dateDeclaration} onChange={e => setDateDeclaration(e.target.value)} />
         <input type="text" placeholder="Type" className="w-full p-2 border rounded mb-2" value={type} onChange={e => setType(e.target.value)} />
         <textarea placeholder="Description" className="w-full p-2 border rounded mb-2" value={description} onChange={e => setDescription(e.target.value)} />
         <select
           className="w-full p-2 border rounded mb-2"
           value={statut}
           onChange={e => setStatut(e.target.value)}
         >
           <option value="">Sélectionner un Statut</option>
           <option value="en attente">En attente</option>
           <option value="resolu">Résolu</option>
           <option value="Rejeté">Rejeté</option>
         </select>
         <input type="number" placeholder="Montant Requis" className="w-full p-2 border rounded mb-2" value={montantRequis} onChange={e => setMontantRequis(e.target.value)} />
         <input type="number" placeholder="Montant Approuvé" className="w-full p-2 border rounded mb-4" value={montantApprouve} onChange={e => setMontantApprouve(e.target.value)} />

         <div className="flex justify-end gap-2">
           <button onClick={() => setShowUpdateModal(false)} className="px-4 py-2 bg-gray-200 rounded">Annuler</button>
           <button onClick={handleUpdateSinistre} className="px-4 py-2 bg-blue-600 text-white rounded">Mise à jour</button>
         </div>
       </Modal>
     </div>
   )
 }

 export default Sinistres