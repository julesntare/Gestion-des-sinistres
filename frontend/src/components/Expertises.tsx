import Sidenav from "./sidenav.tsx"
import Topbar from "./topbar.tsx"
import { useState, useEffect } from "react"
import axios from "axios"

interface Expertise {
  id: number
  sinistre_id: number
  expert: number
  rapport: string
  date_evaluation: string
}

interface Sinistre {
  id: number
  Numero_Sinistre: string
}

interface User {
  id: number
  nom: string
  role_id: number
}

function Modal({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}) {
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

function Expertises() {
  const [data, setData] = useState<Expertise[]>([])
  const [sinistres, setSinistres] = useState<Sinistre[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [selectedExp, setSelectedExp] = useState<Expertise | null>(null)

  const [sinistreId, setSinistreId] = useState("")
  const [expertId, setExpertId] = useState("")
  const [rapport, setRapport] = useState("")
  const [dateEvaluation, setDateEvaluation] = useState("")
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetchExpertises()
    fetchSinistres()
    fetchUsers()
  }, [])

  const fetchExpertises = () => {
    axios
      .get("http://localhost:3000/viewexpertises")
      .then((res) => setData(res.data))
      .catch((err) => console.log(err))
  }

  const fetchSinistres = () => {
    axios
      .get("http://localhost:3000/viewsinistres")
      .then((res) => setSinistres(res.data))
      .catch((err) => console.log(err))
  }

  const fetchUsers = () => {
    axios
      .get("http://localhost:3000/viewuser")
      .then((res) => setUsers(res.data.filter((u: User) => u.role_id === 8)))
      .catch((err) => console.log(err))
  }

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3000/deleteexpertises/${id}`)
      setData((prev) => prev.filter((exp) => exp.id !== id))
    } catch (err: any) {
      console.log(err.response?.data || err)
    }
  }

  const handleAddExpertise = async () => {
    try {
      await axios.post("http://localhost:3000/createexpertises", {
        sinistre_id: sinistreId,
        expert: expertId,
        rapport,
        date_evaluation: dateEvaluation,
      })
      fetchExpertises()
      clearForm()
      setShowAddModal(false)
    } catch (err: any) {
      console.log(err.response?.data || err)
    }
  }

  const handleUpdateExpertise = async () => {
    if (!selectedExp) return
    try {
      await axios.put(
        `http://localhost:3000/updateexpertises/${selectedExp.id}`,
        {
          sinistre_id: sinistreId,
          expert: expertId,
          rapport,
          date_evaluation: dateEvaluation,
        }
      )
      fetchExpertises()
      clearForm()
      setSelectedExp(null)
      setShowUpdateModal(false)
    } catch (err: any) {
      console.log(err.response?.data || err)
    }
  }

  const clearForm = () => {
    setSinistreId("")
    setExpertId("")
    setRapport("")
    setDateEvaluation("")
  }

  const filteredData = data.filter((d) => {
    const sinistre =
      sinistres.find((s) => s.id === d.sinistre_id)?.Numero_Sinistre ||
      d.sinistre_id
    const expert = users.find((e) => e.id === d.expert)?.nom || d.expert

    return (
      sinistre.toString().toLowerCase().includes(search.toLowerCase()) ||
      expert.toString().toLowerCase().includes(search.toLowerCase()) ||
      d.rapport.toLowerCase().includes(search.toLowerCase()) ||
      d.date_evaluation.toLowerCase().includes(search.toLowerCase())
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
              <h1 className="font-bold text-2xl">Gestion Des Expertises</h1>
              <h2 className="font-light">Suivi des Expertises</h2>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 text-sm h-10 px-4 py-2 bg-blue-600 hover:bg-blue-500 shadow text-white rounded-sm"
            >
              + Nouvelle Expertise
            </button>
          </div>

          <div className="flex justify-between items-center mb-4">
            <input
              type="text"
              placeholder="🔍 Rechercher une expertise..."
              className="w-1/3 p-2 border rounded"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="w-full h-110 mt-6 bg-white rounded-lg flex flex-col">
            <h1 className="font-medium text-xl px-6 py-4">
              Liste Des Expertises
            </h1>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <table className="min-w-full gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left">#</th>
                    <th className="px-4 py-2 text-left">Numéro Sinistre</th>
                    <th className="px-4 py-2 text-left">Expert</th>
                    <th className="px-4 py-2 text-left">Rapport</th>
                    <th className="px-4 py-2 text-left">Date Évaluation</th>
                    <th className="px-4 py-2 text-center" colSpan={2}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((d, i) => {
                    const sinistre =
                      sinistres.find((s) => s.id === d.sinistre_id)
                        ?.Numero_Sinistre || d.sinistre_id
                    const expert =
                      users.find((e) => e.id === d.expert)?.nom ||
                      d.expert || "-"
                    return (
                      <tr key={d.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2">{i + 1}</td>
                        <td className="px-4 py-2">{sinistre}</td>
                        <td className="px-4 py-2">{expert}</td>
                        <td className="px-4 py-2">{d.rapport}</td>
                        <td className="px-4 py-2">{d.date_evaluation}</td>
                        <td className="px-4 py-2 text-center">
                          <button
                            onClick={() => {
                              setSelectedExp(d)
                              setSinistreId(String(d.sinistre_id))
                              setExpertId(String(d.expert))
                              setRapport(d.rapport)
                              setDateEvaluation(d.date_evaluation)
                              setShowUpdateModal(true)
                            }}
                            className="text-blue-600 hover:underline"
                          >
                            Mise à jour
                          </button>
                        </td>
                        <td className="px-4 py-2 text-center">
                          <button
                            onClick={() => handleDelete(d.id)}
                            className="text-red-600 hover:underline"
                          >
                            Supprimer
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                  {filteredData.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="text-center text-gray-500 py-4"
                      >
                        Aucune expertise trouvée
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)}>
        <h2 className="text-xl font-bold mb-4">Ajouter une Expertise</h2>

        <select
          className="w-full p-2 border rounded mb-2"
          value={sinistreId}
          onChange={(e) => setSinistreId(e.target.value)}
        >
          <option value="">-- Choisir un sinistre --</option>
          {sinistres.map((s) => (
            <option key={s.id} value={s.id}>
              {s.Numero_Sinistre}
            </option>
          ))}
        </select>

        <select
          className="w-full p-2 border rounded mb-2"
          value={expertId}
          onChange={(e) => setExpertId(e.target.value)}
        >
          <option value="">-- Choisir un expert --</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.nom}
            </option>
          ))}
        </select>

        <textarea
          placeholder="Rapport"
          className="w-full p-2 border rounded mb-2"
          value={rapport}
          onChange={(e) => setRapport(e.target.value)}
        />

        <input
          type="date"
          className="w-full p-2 border rounded mb-4"
          value={dateEvaluation}
          onChange={(e) => setDateEvaluation(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={() => setShowAddModal(false)}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Annuler
          </button>
          <button
            onClick={handleAddExpertise}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Enregistrer
          </button>
        </div>
      </Modal>

      <Modal isOpen={showUpdateModal} onClose={() => setShowUpdateModal(false)}>
        <h2 className="text-xl font-bold mb-4">Mettre à jour l'Expertise</h2>

        <select
          className="w-full p-2 border rounded mb-2"
          value={sinistreId}
          onChange={(e) => setSinistreId(e.target.value)}
        >
          <option value="">-- Choisir un sinistre --</option>
          {sinistres.map((s) => (
            <option key={s.id} value={s.id}>
              {s.Numero_Sinistre}
            </option>
          ))}
        </select>

        <select
          className="w-full p-2 border rounded mb-2"
          value={expertId}
          onChange={(e) => setExpertId(e.target.value)}
        >
          <option value="">-- Choisir un expert --</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.nom}
            </option>
          ))}
        </select>

        <textarea
          placeholder="Rapport"
          className="w-full p-2 border rounded mb-2"
          value={rapport}
          onChange={(e) => setRapport(e.target.value)}
        />

        <input
          type="date"
          className="w-full p-2 border rounded mb-4"
          value={dateEvaluation}
          onChange={(e) => setDateEvaluation(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={() => setShowUpdateModal(false)}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Annuler
          </button>
          <button
            onClick={handleUpdateExpertise}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Mise à jour
          </button>
        </div>
      </Modal>
    </div>
  )
}

export default Expertises