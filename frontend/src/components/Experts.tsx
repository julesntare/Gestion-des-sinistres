import Sidenav from "./sidenav.tsx"
import Topbar from "./topbar.tsx"
import { useState, useEffect } from "react"
import axios from "axios"

interface Expert {
  id: number
  nom: string
  specialite: string
  email: string
  telephone: string
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

function Experts() {
  const [data, setData] = useState<Expert[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null)

  // form state
  const [nom, setNom] = useState("")
  const [specialite, setSpecialite] = useState("")
  const [email, setEmail] = useState("")
  const [telephone, setTelephone] = useState("")
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetchExperts()
  }, [])

  const fetchExperts = () => {
    axios
      .get("http://localhost:3000/viewexpert")
      .then((res) => {
        const mapped: Expert[] = res.data.map((e: any) => ({
          id: e.id,
          nom: e.nom,
          specialite: e["spécialité"], // map backend → frontend
          email: e.email,
          telephone: e["téléphone"], // map backend → frontend
        }))
        setData(mapped)
      })
      .catch((err) => console.log(err))
  }

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3000/deleteexpert/${id}`)
      setData((prev) => prev.filter((ex) => ex.id !== id))
    } catch (err: any) {
      console.log(err.response?.data || err)
    }
  }

  const handleAddExpert = async () => {
    try {
      await axios.post("http://localhost:3000/createexpert", {
        nom,
        specialite,
        email,
        telephone,
      })
      fetchExperts()
      clearForm()
      setShowAddModal(false)
    } catch (err: any) {
      console.log(err.response?.data || err)
    }
  }

  const handleUpdateExpert = async () => {
    if (!selectedExpert) return
    try {
      await axios.put(
        `http://localhost:3000/updateexpert/${selectedExpert.id}`,
        {
          nom,
          specialite,
          email,
          telephone,
        }
      )
      fetchExperts()
      clearForm()
      setSelectedExpert(null)
      setShowUpdateModal(false)
    } catch (err: any) {
      console.log(err.response?.data || err)
    }
  }

  const clearForm = () => {
    setNom("")
    setSpecialite("")
    setEmail("")
    setTelephone("")
  }

  // filter experts by search text
  const filteredData = data.filter(
    (ex) =>
      ex.nom.toLowerCase().includes(search.toLowerCase()) ||
      ex.specialite.toLowerCase().includes(search.toLowerCase()) ||
      ex.email.toLowerCase().includes(search.toLowerCase()) ||
      ex.telephone.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex">
      <Sidenav />
      <div className="bg-gray-100 h-screen w-screen">
        <Topbar />
        <div className="p-3 m-5 mt-1">
          <div className="flex justify-between items-center mt-2 ml-2 mb-5">
            <div>
              <h1 className="font-bold text-2xl">Gestion Des Experts</h1>
              <h2 className="font-light">Liste des Experts</h2>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 text-sm h-10 px-4 py-2 bg-blue-600 hover:bg-blue-500 shadow text-white rounded-sm"
            >
              + Nouveau Expert
            </button>
          </div>

          {/* Search bar */}
          <div className="flex justify-between items-center mb-4">
            <input
              type="text"
              placeholder="🔍 Rechercher un expert..."
              className="w-1/3 p-2 border rounded"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="w-full h-110 mt-2 bg-white rounded-lg flex flex-col">
            <h1 className="font-medium text-xl px-6 py-4">Liste des Experts</h1>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <table className="min-w-full gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left">#</th>
                    <th className="px-4 py-2 text-left">Nom</th>
                    <th className="px-4 py-2 text-left">Spécialité</th>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">Téléphone</th>
                    <th className="px-4 py-2 text-center" colSpan={2}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((d, i) => (
                    <tr key={d.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2">{i + 1}</td>
                      <td className="px-4 py-2">{d.nom}</td>
                      <td className="px-4 py-2">{d.specialite}</td>
                      <td className="px-4 py-2">{d.email}</td>
                      <td className="px-4 py-2">{d.telephone}</td>
                      <td className="px-4 py-2 text-center">
                        <button
                          onClick={() => {
                            setSelectedExpert(d)
                            setNom(d.nom)
                            setSpecialite(d.specialite)
                            setEmail(d.email)
                            setTelephone(d.telephone)
                            setShowUpdateModal(true)
                          }}
                          className="text-blue-600 hover:underline"
                        >
                          Update
                        </button>
                      </td>
                      <td className="px-4 py-2 text-center">
                        <button
                          onClick={() => handleDelete(d.id)}
                          className="text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredData.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="text-center text-gray-500 py-4"
                      >
                        Aucun expert trouvé
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
        <h2 className="text-xl font-bold mb-4">Ajouter un Expert</h2>

        <input
          type="text"
          placeholder="Nom"
          className="w-full p-2 border rounded mb-2"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
        />

        <input
          type="text"
          placeholder="Spécialité"
          className="w-full p-2 border rounded mb-2"
          value={specialite}
          onChange={(e) => setSpecialite(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded mb-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="text"
          placeholder="Téléphone"
          className="w-full p-2 border rounded mb-4"
          value={telephone}
          onChange={(e) => setTelephone(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={() => setShowAddModal(false)}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleAddExpert}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Save
          </button>
        </div>
      </Modal>

      {/* Update Modal */}
      <Modal isOpen={showUpdateModal} onClose={() => setShowUpdateModal(false)}>
        <h2 className="text-xl font-bold mb-4">Mettre à jour l'Expert</h2>

        <input
          type="text"
          placeholder="Nom"
          className="w-full p-2 border rounded mb-2"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
        />

        <input
          type="text"
          placeholder="Spécialité"
          className="w-full p-2 border rounded mb-2"
          value={specialite}
          onChange={(e) => setSpecialite(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded mb-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="text"
          placeholder="Téléphone"
          className="w-full p-2 border rounded mb-4"
          value={telephone}
          onChange={(e) => setTelephone(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={() => setShowUpdateModal(false)}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdateExpert}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Update
          </button>
        </div>
      </Modal>
    </div>
  )
}

export default Experts
