import Sidenav from "./sidenav.tsx"
import Topbar from "./topbar.tsx"
import { useState, useEffect } from "react"
import axios from "axios"

interface Police {
  id: number
  numero_police: string
  utilisateur_id: number
  type: string
  date_debut: string
  date_fin: string
  statut: string
}

interface User {
  id: number
  nom: string
  role_id: number
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

function Polices() {
  const [polices, setPolices] = useState<Police[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  const [showAddModal, setShowAddModal] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [selectedPolice, setSelectedPolice] = useState<Police | null>(null)

  // form state
  const [numeroPolice, setNumeroPolice] = useState("")
  const [utilisateurId, setUtilisateurId] = useState("")
  const [type, setType] = useState("")
  const [dateDebut, setDateDebut] = useState("")
  const [dateFin, setDateFin] = useState("")
  const [statut, setStatut] = useState("")

  useEffect(() => {
    fetchPolices()
    fetchUsers()
  }, [])

  const fetchPolices = () => {
    axios.get("http://localhost:3000/viewpolices")
      .then(res => setPolices(res.data))
      .catch(err => console.log(err))
  }

  const fetchUsers = () => {
    axios.get("http://localhost:3000/viewuser")
      .then(res => setUsers(res.data))
      .catch(err => console.log(err))
  }

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3000/deletepolices/${id}`)
      setPolices(prev => prev.filter(p => p.id !== id))
    } catch (err: any) {
      console.log(err.response?.data || err)
    }
  }

  const handleAddPolice = async () => {
    try {
      await axios.post("http://localhost:3000/createpolices", {
        numero_police: numeroPolice,
        utilisateur_id: utilisateurId,
        type,
        date_debut: dateDebut,
        date_fin: dateFin,
        statut,
      })
      fetchPolices()
      clearForm()
      setShowAddModal(false)
    } catch (err: any) {
      console.log(err.response?.data || err)
    }
  }

  const handleUpdatePolice = async () => {
    if (!selectedPolice) return
    try {
      await axios.put(`http://localhost:3000/updatepolices/${selectedPolice.id}`, {
        numero_police: numeroPolice,
        utilisateur_id: utilisateurId,
        type,
        date_debut: dateDebut,
        date_fin: dateFin,
        statut,
      })
      fetchPolices()
      clearForm()
      setSelectedPolice(null)
      setShowUpdateModal(false)
    } catch (err: any) {
      console.log(err.response?.data || err)
    }
  }

  const clearForm = () => {
    setNumeroPolice("")
    setUtilisateurId("")
    setType("")
    setDateDebut("")
    setDateFin("")
    setStatut("")
  }

  // ✅ Apply search filtering
  const filteredPolices = polices.filter(p => {
    const user = users.find(u => u.id === p.utilisateur_id)?.nom || ""
    return (
      p.numero_police.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.statut.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  return (
    <div className="flex">
      <Sidenav />
      <div className="bg-gray-100 h-screen w-screen">
        <Topbar />
        <div className="p-3 m-5 mt-1">
          {/* Header */}
          <div className="flex justify-between items-center mt-2 ml-2 mb-5">
            <div>
              <h1 className="font-bold text-2xl">Gestion Des Polices</h1>
              <h2 className="font-light">Suivi des Polices</h2>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 text-sm h-10 px-4 py-2 bg-blue-600 hover:bg-blue-500 shadow text-white rounded-sm"
            >
              + Nouvelle Police
            </button>
          </div>

          {/* 🔍 Search Bar */}
          <div className="flex justify-between items-center mb-4">
            <input
              type="text"
              placeholder="🔍 Rechercher une police..."
              className="w-1/3 p-2 border rounded"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Table */}
          <div className="w-full h-110 mt-2 bg-white rounded-lg flex flex-col">
            <h1 className="font-medium text-xl px-6 py-4">Liste Des Polices</h1>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <table className="min-w-full gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left">#</th>
                    <th className="px-4 py-2 text-left">Numéro</th>
                    <th className="px-4 py-2 text-left">Client</th>
                    <th className="px-4 py-2 text-left">Type de police</th>
                    <th className="px-4 py-2 text-left">Début</th>
                    <th className="px-4 py-2 text-left">Fin</th>
                    <th className="px-4 py-2 text-left">Statut</th>
                    <th className="px-4 py-2 text-center" colSpan={2}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPolices.map((p, i) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2">{i + 1}</td>
                      <td className="px-4 py-2">{p.numero_police}</td>
                      <td className="px-4 py-2">{users.find(u => u.id === p.utilisateur_id)?.nom || p.utilisateur_id}</td>
                      <td className="px-4 py-2">{p.type}</td>
                      <td className="px-4 py-2">{p.date_debut}</td>
                      <td className="px-4 py-2">{p.date_fin}</td>
                      <td className="px-4 py-2">{p.statut}</td>
                      <td className="px-4 py-2 text-center">
                        <button onClick={() => {
                          setSelectedPolice(p)
                          setNumeroPolice(p.numero_police)
                          setUtilisateurId(String(p.utilisateur_id))
                          setType(p.type)
                          setDateDebut(p.date_debut)
                          setDateFin(p.date_fin)
                          setStatut(p.statut)
                          setShowUpdateModal(true)
                        }}
                        className="text-blue-600 hover:underline"
                        >
                          Mise à jour
                        </button>
                      </td>
                      <td className="px-4 py-2 text-center">
                        <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:underline">
                          Supprimer
                        </button>
                      </td>
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
        <h2 className="text-xl font-bold mb-4">Ajouter une Police</h2>

        <input type="text" placeholder="Numéro de Police" className="w-full p-2 border rounded mb-2"
          value={numeroPolice} onChange={e => setNumeroPolice(e.target.value)} />

         <select
          className="w-full p-2 border rounded mb-2"
          value={utilisateurId}
          onChange={e => setUtilisateurId(e.target.value)}
        >
          <option value="">Sélectionner un Client</option>
          {users
            .filter(u => u.role_id === 6) // ✅ only clients
            .map(u => (
              <option key={u.id} value={u.id}>{u.nom}</option>
            ))}
        </select>

        <input type="text" placeholder="Type de police" className="w-full p-2 border rounded mb-2"
          value={type} onChange={e => setType(e.target.value)} />

        <input type="date" className="w-full p-2 border rounded mb-2" value={dateDebut} onChange={e => setDateDebut(e.target.value)} />
        <input type="date" className="w-full p-2 border rounded mb-2" value={dateFin} onChange={e => setDateFin(e.target.value)} />

       <select
          className="w-full p-2 border rounded mb-2"
          value={statut}
          onChange={e => setStatut(e.target.value)}
        >
          <option value="">Sélectionner un Statut</option>
          <option value="en attente">En attente</option>
          <option value="Approuvé">Approuvé</option>
          <option value="Rejeté">Rejeté</option>
        </select>

        <div className="flex justify-end gap-2">
          <button onClick={() => setShowAddModal(false)} className="px-4 py-2 bg-gray-200 rounded">Annuler</button>
          <button onClick={handleAddPolice} className="px-4 py-2 bg-blue-600 text-white rounded">Enregistrer</button>
        </div>
      </Modal>

      {/* Update Modal */}
      <Modal isOpen={showUpdateModal} onClose={() => setShowUpdateModal(false)}>
        <h2 className="text-xl font-bold mb-4">Mettre à jour la Police</h2>

        <input type="text" placeholder="Numéro de Police" className="w-full p-2 border rounded mb-2"
          value={numeroPolice} onChange={e => setNumeroPolice(e.target.value)} />

        <select
          className="w-full p-2 border rounded mb-2"
          value={utilisateurId}
          onChange={e => setUtilisateurId(e.target.value)}
        >
          <option value="">Sélectionner un Client</option>
          {users
            .filter(u => u.role_id === 6) // ✅ only clients
            .map(u => (
              <option key={u.id} value={u.id}>{u.nom}</option>
            ))}
        </select>

        <input type="text" placeholder="Type de police" className="w-full p-2 border rounded mb-2"
          value={type} onChange={e => setType(e.target.value)} />

        <input type="date" className="w-full p-2 border rounded mb-2" value={dateDebut} onChange={e => setDateDebut(e.target.value)} />
        <input type="date" className="w-full p-2 border rounded mb-2" value={dateFin} onChange={e => setDateFin(e.target.value)} />

        <select
          className="w-full p-2 border rounded mb-2"
          value={statut}
          onChange={e => setStatut(e.target.value)}
        >
          <option value="">Sélectionner un Statut</option>
          <option value="en attente">En attente</option>
          <option value="Approuvé">Approuvé</option>
          <option value="Rejeté">Rejeté</option>
        </select>

        <div className="flex justify-end gap-2">
          <button onClick={() => setShowUpdateModal(false)} className="px-4 py-2 bg-gray-200 rounded">Annuler</button>
          <button onClick={handleUpdatePolice} className="px-4 py-2 bg-blue-600 text-white rounded">Update</button>
        </div>
      </Modal>
    </div>
  )
}

export default Polices

// import Sidenav from "./sidenav.tsx"
// import Topbar from "./topbar.tsx"
// import { useState, useEffect } from "react"
// import axios from "axios"

// interface Police {
//   id: number
//   numero_police: string
//   utilisateur_id: number
//   type: string
//   date_debut: string
//   date_fin: string
//   statut: string
// }

// interface User {
//   id: number
//   nom: string
//   role_id: number
// }

// function Modal({ isOpen, onClose, children }: { isOpen: boolean, onClose: () => void, children: React.ReactNode }) {
//   if (!isOpen) return null
//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
//       <div className="bg-white rounded-lg shadow-lg p-6 w-96 relative">
//         {children}
//         <button
//           className="absolute top-2 right-2 text-gray-500 hover:text-black"
//           onClick={onClose}
//         >
//           ✕
//         </button>
//       </div>
//     </div>
//   )
// }

// function Polices() {
//   const [polices, setPolices] = useState<Police[]>([])
//   const [users, setUsers] = useState<User[]>([])
//   const [searchTerm, setSearchTerm] = useState("")

//   const [showAddModal, setShowAddModal] = useState(false)
//   const [showUpdateModal, setShowUpdateModal] = useState(false)
//   const [selectedPolice, setSelectedPolice] = useState<Police | null>(null)

//   // form state
//   const [numeroPolice, setNumeroPolice] = useState("")
//   const [utilisateurId, setUtilisateurId] = useState("")
//   const [type, setType] = useState("")
//   const [dateDebut, setDateDebut] = useState("")
//   const [dateFin, setDateFin] = useState("")
//   const [statut, setStatut] = useState("")

//   const [successMessage, setSuccessMessage] = useState("")

//   useEffect(() => {
//     fetchPolices()
//     fetchUsers()
//   }, [])

//   const fetchPolices = () => {
//     axios.get("http://localhost:3000/viewpolices")
//       .then(res => setPolices(res.data || []))
//       .catch(err => {
//         console.error("fetchPolices error:", err)
//         setPolices([])
//       })
//   }

//   const fetchUsers = () => {
//     axios.get("http://localhost:3000/viewuser")
//       .then(res => setUsers(res.data || []))
//       .catch(err => {
//         console.error("fetchUsers error:", err)
//         setUsers([])
//       })
//   }

//   const handleDelete = async (id: number) => {
//     try {
//       await axios.delete(`http://localhost:3000/deletepolices/${id}`)
//       setPolices(prev => prev.filter(p => p.id !== id))
//       setSuccessMessage("Police supprimée ✅")
//       setTimeout(() => setSuccessMessage(""), 3000)
//     } catch (err: any) {
//       console.log(err.response?.data || err)
//       alert("Erreur lors de la suppression.")
//     }
//   }

//   // --- FIXED handleAddPolice: validation + send utilisateur_id as Number
//   const handleAddPolice = async () => {
//     // basic validation
//     if (!numeroPolice.trim()) return alert("Veuillez saisir le numéro de police.")
//     if (!utilisateurId) return alert("Veuillez sélectionner un client.")
//     if (!type.trim()) return alert("Veuillez saisir le type de police.")
//     if (!dateDebut) return alert("Veuillez sélectionner la date de début.")
//     if (!dateFin) return alert("Veuillez sélectionner la date de fin.")
//     if (!statut) return alert("Veuillez sélectionner le statut.")

//     try {
//       // convert utilisateurId to number before sending
//       const payload = {
//         numero_police: numeroPolice,
//         utilisateur_id: Number(utilisateurId),
//         type,
//         date_debut: dateDebut,
//         date_fin: dateFin,
//         statut,
//       }

//       const res = await axios.post("http://localhost:3000/createpolices", payload)
//       // backend returns 201 with message — fetch and update UI
//       fetchPolices()
//       clearForm()
//       setShowAddModal(false)
//       setSuccessMessage("Police ajoutée avec succès ✅")
//       setTimeout(() => setSuccessMessage(""), 3000)
//     } catch (err: any) {
//   console.error("handleAddPolice error:", err.response?.data || err)
//   const serverData = err?.response?.data
//   const msg = serverData?.error ? `${serverData.message} — ${serverData.error}` : (serverData?.message || String(err))
//   alert("Erreur lors de l'ajout de la police : " + msg)
// }

//   }

//   // --- FIXED handleUpdatePolice: also ensure utilisateur_id is number
//   const handleUpdatePolice = async () => {
//     if (!selectedPolice) return
//     if (!numeroPolice.trim()) return alert("Veuillez saisir le numéro de police.")
//     if (!utilisateurId) return alert("Veuillez sélectionner un client.")
//     if (!type.trim()) return alert("Veuillez saisir le type de police.")
//     if (!dateDebut) return alert("Veuillez sélectionner la date de début.")
//     if (!dateFin) return alert("Veuillez sélectionner la date de fin.")
//     if (!statut) return alert("Veuillez sélectionner le statut.")

//     try {
//       const payload = {
//         numero_police: numeroPolice,
//         utilisateur_id: Number(utilisateurId),
//         type,
//         date_debut: dateDebut,
//         date_fin: dateFin,
//         statut,
//       }

//       await axios.put(`http://localhost:3000/updatepolices/${selectedPolice.id}`, payload)
//       fetchPolices()
//       clearForm()
//       setSelectedPolice(null)
//       setShowUpdateModal(false)
//       setSuccessMessage("Police mise à jour ✅")
//       setTimeout(() => setSuccessMessage(""), 3000)
//     } catch (err: any) {
//       console.error("handleUpdatePolice error:", err.response?.data || err)
//       const serverMsg = err?.response?.data?.message || JSON.stringify(err?.response?.data || err)
//       alert("Erreur lors de la mise à jour : " + serverMsg)
//     }
//   }

//   const clearForm = () => {
//     setNumeroPolice("")
//     setUtilisateurId("")
//     setType("")
//     setDateDebut("")
//     setDateFin("")
//     setStatut("")
//   }

//   // prepare clients list: try only role_id === 6, fallback to all users if none
//   const clients = users.filter(u => u.role_id === 6)
//   const clientOptions = clients.length > 0 ? clients : users

//   // ✅ Apply search filtering
//   const filteredPolices = polices.filter(p => {
//     const user = users.find(u => u.id === p.utilisateur_id)?.nom || ""
//     return (
//       p.numero_police?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       p.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       p.statut?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       user.toLowerCase().includes(searchTerm.toLowerCase())
//     )
//   })

//   return (
//     <div className="flex">
//       <Sidenav />
//       <div className="bg-gray-100 h-screen w-screen">
//         <Topbar />
//         <div className="p-3 m-5 mt-1">
//           {/* Header */}
//           <div className="flex justify-between items-center mt-2 ml-2 mb-5">
//             <div>
//               <h1 className="font-bold text-2xl">Gestion Des Polices</h1>
//               <h2 className="font-light">Suivi des Polices</h2>
//             </div>
//             <button
//               onClick={() => setShowAddModal(true)}
//               className="flex items-center gap-2 text-sm h-10 px-4 py-2 bg-blue-600 hover:bg-blue-500 shadow text-white rounded-sm"
//             >
//               + Nouvelle Police
//             </button>
//           </div>

//           {/* 🔍 Search Bar */}
//           <div className="flex justify-between items-center mb-4">
//             <input
//               type="text"
//               placeholder="🔍 Rechercher une police..."
//               className="w-1/3 p-2 border rounded"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>

//           {successMessage && (
//             <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">
//               {successMessage}
//             </div>
//           )}

//           {/* Table */}
//           <div className="w-full h-110 mt-2 bg-white rounded-lg flex flex-col">
//             <h1 className="font-medium text-xl px-6 py-4">Liste Des Polices</h1>
//             <div className="flex-1 overflow-y-auto px-6 py-4">
//               <table className="min-w-full gray-200">
//                 <thead className="bg-gray-100">
//                   <tr>
//                     <th className="px-4 py-2 text-left">#</th>
//                     <th className="px-4 py-2 text-left">Numéro</th>
//                     <th className="px-4 py-2 text-left">Client</th>
//                     <th className="px-4 py-2 text-left">Type de police</th>
//                     <th className="px-4 py-2 text-left">Début</th>
//                     <th className="px-4 py-2 text-left">Fin</th>
//                     <th className="px-4 py-2 text-left">Statut</th>
//                     <th className="px-4 py-2 text-center" colSpan={2}>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredPolices.map((p, i) => (
//                     <tr key={p.id} className="hover:bg-gray-50">
//                       <td className="px-4 py-2">{i + 1}</td>
//                       <td className="px-4 py-2">{p.numero_police}</td>
//                       <td className="px-4 py-2">{users.find(u => u.id === p.utilisateur_id)?.nom || p.utilisateur_id}</td>
//                       <td className="px-4 py-2">{p.type}</td>
//                       <td className="px-4 py-2">{p.date_debut}</td>
//                       <td className="px-4 py-2">{p.date_fin}</td>
//                       <td className="px-4 py-2">{p.statut}</td>
//                       <td className="px-4 py-2 text-center">
//                         <button onClick={() => {
//                           setSelectedPolice(p)
//                           setNumeroPolice(p.numero_police)
//                           setUtilisateurId(String(p.utilisateur_id))
//                           setType(p.type)
//                           setDateDebut(p.date_debut)
//                           setDateFin(p.date_fin)
//                           setStatut(p.statut)
//                           setShowUpdateModal(true)
//                         }}
//                         className="text-blue-600 hover:underline"
//                         >
//                           Mise à jour
//                         </button>
//                       </td>
//                       <td className="px-4 py-2 text-center">
//                         <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:underline">
//                           Supprimer
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Add Modal */}
//       <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)}>
//         <h2 className="text-xl font-bold mb-4">Ajouter une Police</h2>

//         <input type="text" placeholder="Numéro de Police" className="w-full p-2 border rounded mb-2"
//           value={numeroPolice} onChange={e => setNumeroPolice(e.target.value)} />

//          <select
//           className="w-full p-2 border rounded mb-2"
//           value={utilisateurId}
//           onChange={e => setUtilisateurId(e.target.value)}
//         >
//           <option value="">Sélectionner un Client</option>
//           {clientOptions.map(u => (
//             <option key={u.id} value={u.id}>{u.nom} {u.role_id !== 6 ? "(role " + u.role_id + ")" : ""}</option>
//           ))}
//         </select>

//         <input type="text" placeholder="Type de police" className="w-full p-2 border rounded mb-2"
//           value={type} onChange={e => setType(e.target.value)} />

//         <input type="date" className="w-full p-2 border rounded mb-2" value={dateDebut} onChange={e => setDateDebut(e.target.value)} />
//         <input type="date" className="w-full p-2 border rounded mb-2" value={dateFin} onChange={e => setDateFin(e.target.value)} />

//        <select
//           className="w-full p-2 border rounded mb-2"
//           value={statut}
//           onChange={e => setStatut(e.target.value)}
//         >
//           <option value="">Sélectionner un Statut</option>
//           <option value="en attente">En attente</option>
//           <option value="Approuvé">Approuvé</option>
//           <option value="Rejeté">Rejeté</option>
//         </select>

//         <div className="flex justify-end gap-2">
//           <button onClick={() => setShowAddModal(false)} className="px-4 py-2 bg-gray-200 rounded">Annuler</button>
//           <button onClick={handleAddPolice} className="px-4 py-2 bg-blue-600 text-white rounded">Enregistrer</button>
//         </div>
//       </Modal>

//       {/* Update Modal */}
//       <Modal isOpen={showUpdateModal} onClose={() => setShowUpdateModal(false)}>
//         <h2 className="text-xl font-bold mb-4">Mettre à jour la Police</h2>

//         <input type="text" placeholder="Numéro de Police" className="w-full p-2 border rounded mb-2"
//           value={numeroPolice} onChange={e => setNumeroPolice(e.target.value)} />

//         <select
//           className="w-full p-2 border rounded mb-2"
//           value={utilisateurId}
//           onChange={e => setUtilisateurId(e.target.value)}
//         >
//           <option value="">Sélectionner un Client</option>
//           {clientOptions.map(u => (
//             <option key={u.id} value={u.id}>{u.nom} {u.role_id !== 6 ? "(role " + u.role_id + ")" : ""}</option>
//           ))}
//         </select>

//         <input type="text" placeholder="Type de police" className="w-full p-2 border rounded mb-2"
//           value={type} onChange={e => setType(e.target.value)} />

//         <input type="date" className="w-full p-2 border rounded mb-2" value={dateDebut} onChange={e => setDateDebut(e.target.value)} />
//         <input type="date" className="w-full p-2 border rounded mb-2" value={dateFin} onChange={e => setDateFin(e.target.value)} />

//         <select
//           className="w-full p-2 border rounded mb-2"
//           value={statut}
//           onChange={e => setStatut(e.target.value)}
//         >
//           <option value="">Sélectionner un Statut</option>
//           <option value="en attente">En attente</option>
//           <option value="Approuvé">Approuvé</option>
//           <option value="Rejeté">Rejeté</option>
//         </select>

//         <div className="flex justify-end gap-2">
//           <button onClick={() => setShowUpdateModal(false)} className="px-4 py-2 bg-gray-200 rounded">Annuler</button>
//           <button onClick={handleUpdatePolice} className="px-4 py-2 bg-blue-600 text-white rounded">Update</button>
//         </div>
//       </Modal>
//     </div>
//   )
// }

// export default Polices
