import Sidenav from "./sidenav.tsx"
import Topbar from "./topbar.tsx"
import { useState, useEffect } from "react"
import axios from "axios"

interface Paiement {
  id: number
  sinistre_id: number
  montant: number
  date_paiement: string
  méthode: string
  statut: string
}

interface Sinistre {
  id: number
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

function Paiements() {
  const [paiements, setPaiements] = useState<Paiement[]>([])
  const [sinistres, setSinistres] = useState<Sinistre[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [selectedPaiement, setSelectedPaiement] = useState<Paiement | null>(null)

  // search state
  const [searchTerm, setSearchTerm] = useState("")

  // form state
  const [sinistreId, setSinistreId] = useState("")
  const [montant, setMontant] = useState("")
  const [datePaiement, setDatePaiement] = useState("")
  const [methode, setMethode] = useState("")
  const [statut, setStatut] = useState("")

  useEffect(() => {
    fetchPaiements()
    fetchSinistres()
  }, [])

  const fetchPaiements = () => {
    axios.get("http://localhost:3000/viewpaiements")
      .then(res => setPaiements(res.data))
      .catch(err => console.log(err))
  }

  const fetchSinistres = () => {
    axios.get("http://localhost:3000/viewsinistres")
      .then(res => setSinistres(res.data))
      .catch(err => console.log(err))
  }

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3000/deletepaiements/${id}`)
      setPaiements(prev => prev.filter(p => p.id !== id))
    } catch (err: any) {
      console.log(err.response?.data || err)
    }
  }

  const handleAddPaiement = async () => {
    try {
      await axios.post("http://localhost:3000/createpaiements", {
        sinistre_id: sinistreId,
        montant,
        date_paiement: datePaiement,
        méthode: methode,
        statut,
      })
      fetchPaiements()
      clearForm()
      setShowAddModal(false)
    } catch (err: any) {
      console.log(err.response?.data || err)
    }
  }

  const handleUpdatePaiement = async () => {
    if (!selectedPaiement) return
    try {
      await axios.put(`http://localhost:3000/updatepaiements/${selectedPaiement.id}`, {
        sinistre_id: sinistreId,
        montant,
        date_paiement: datePaiement,
        méthode: methode,
        statut,
      })
      fetchPaiements()
      clearForm()
      setSelectedPaiement(null)
      setShowUpdateModal(false)
    } catch (err: any) {
      console.log(err.response?.data || err)
    }
  }

  const clearForm = () => {
    setSinistreId("")
    setMontant("")
    setDatePaiement("")
    setMethode("")
    setStatut("")
  }

  // Filter paiements based on search
  const filteredPaiements = paiements.filter(p => {
    const sinistre = sinistres.find(s => s.id === p.sinistre_id)?.type || ""
    return (
      sinistre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.montant.toString().includes(searchTerm) ||
      p.date_paiement.includes(searchTerm) ||
      p.méthode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.statut.toLowerCase().includes(searchTerm.toLowerCase())
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
              <h1 className="font-bold text-2xl">Gestion Des Paiements</h1>
              <h2 className="font-light">Suivi des Paiements</h2>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 text-sm h-10 px-4 py-2 bg-blue-600 hover:bg-blue-500 shadow text-white rounded-sm"
            >
              + Nouveau Paiement
            </button>
          </div>

          {/* Search Bar */}
           <div className="flex justify-between items-center mb-4">
            <input
              type="text"
              placeholder="🔍 Rechercher un paiement..."
              className="w-1/3 p-2 border rounded"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Table */}
          <div className="w-full h-110 mt-6 bg-white rounded-lg flex flex-col">
            <h1 className="font-medium text-xl px-6 py-4">Liste Des Paiements</h1>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <table className="min-w-full gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left">#</th>
                    <th className="px-4 py-2 text-left">Sinistre</th>
                    <th className="px-4 py-2 text-left">Montant</th>
                    <th className="px-4 py-2 text-left">Date</th>
                    <th className="px-4 py-2 text-left">Méthode</th>
                    <th className="px-4 py-2 text-left">Statut</th>
                    <th className="px-4 py-2 text-center" colSpan={2}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPaiements.map((p, i) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2">{i + 1}</td>
                      <td className="px-4 py-2">{sinistres.find(s => s.id === p.sinistre_id)?.type || p.sinistre_id}</td>
                      <td className="px-4 py-2">{p.montant}</td>
                      <td className="px-4 py-2">{p.date_paiement}</td>
                      <td className="px-4 py-2">{p.méthode}</td>
                      <td className="px-4 py-2">{p.statut}</td>
                      <td className="px-4 py-2 text-center">
                        <button onClick={() => {
                          setSelectedPaiement(p)
                          setSinistreId(String(p.sinistre_id))
                          setMontant(String(p.montant))
                          setDatePaiement(p.date_paiement)
                          setMethode(p.méthode)
                          setStatut(p.statut)
                          setShowUpdateModal(true)
                        }}
                          className="text-blue-600 hover:underline"
                        >
                          Update
                        </button>
                      </td>
                      <td className="px-4 py-2 text-center">
                        <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:underline">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredPaiements.length === 0 && (
                    <tr>
                      <td colSpan={8} className="text-center py-4 text-gray-500">
                        Aucun paiement trouvé
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
        <h2 className="text-xl font-bold mb-4">Ajouter un Paiement</h2>

        <select className="w-full p-2 border rounded mb-2" value={sinistreId} onChange={e => setSinistreId(e.target.value)}>
          <option value="">Sélectionner un Sinistre</option>
          {sinistres.map(s => (
            <option key={s.id} value={s.id}>{s.type}</option>
          ))}
        </select>

        <input type="number" placeholder="Montant" className="w-full p-2 border rounded mb-2"
          value={montant} onChange={e => setMontant(e.target.value)} />

        <input type="date" className="w-full p-2 border rounded mb-2"
          value={datePaiement} onChange={e => setDatePaiement(e.target.value)} />

        <input type="text" placeholder="Méthode" className="w-full p-2 border rounded mb-2"
          value={methode} onChange={e => setMethode(e.target.value)} />

        <input type="text" placeholder="Statut" className="w-full p-2 border rounded mb-4"
          value={statut} onChange={e => setStatut(e.target.value)} />

        <div className="flex justify-end gap-2">
          <button onClick={() => setShowAddModal(false)} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
          <button onClick={handleAddPaiement} className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
        </div>
      </Modal>

      {/* Update Modal */}
      <Modal isOpen={showUpdateModal} onClose={() => setShowUpdateModal(false)}>
        <h2 className="text-xl font-bold mb-4">Mettre à jour le Paiement</h2>

        <select className="w-full p-2 border rounded mb-2" value={sinistreId} onChange={e => setSinistreId(e.target.value)}>
          <option value="">Sélectionner un Sinistre</option>
          {sinistres.map(s => (
            <option key={s.id} value={s.id}>{s.type}</option>
          ))}
        </select>

        <input type="number" placeholder="Montant" className="w-full p-2 border rounded mb-2"
          value={montant} onChange={e => setMontant(e.target.value)} />

        <input type="date" className="w-full p-2 border rounded mb-2"
          value={datePaiement} onChange={e => setDatePaiement(e.target.value)} />

        <input type="text" placeholder="Méthode" className="w-full p-2 border rounded mb-2"
          value={methode} onChange={e => setMethode(e.target.value)} />

        <input type="text" placeholder="Statut" className="w-full p-2 border rounded mb-4"
          value={statut} onChange={e => setStatut(e.target.value)} />

        <div className="flex justify-end gap-2">
          <button onClick={() => setShowUpdateModal(false)} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
          <button onClick={handleUpdatePaiement} className="px-4 py-2 bg-blue-600 text-white rounded">Update</button>
        </div>
      </Modal>
    </div>
  )
}

export default Paiements
