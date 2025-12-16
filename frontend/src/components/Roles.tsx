import Sidenav from "./sidenav.tsx"
import Topbar from "./topbar.tsx"
import { useState, useEffect } from "react"
import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL || "${API_URL}"

interface Role {
  id: number
  nom: string
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

function Roles() {
  const [data, setData] = useState<Role[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [roleName, setRoleName] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchRoles()
  }, [])

  const fetchRoles = () => {
    axios
      .get("${API_URL}/viewrole")
      .then((res) => setData(res.data))
      .catch((err) => console.log(err))
  }

  const handleDelete = async (id: number | string) => {
    try {
      await axios.delete(`${API_URL}/deleterole/${id}`)
      setData((prev) => prev.filter((role) => role.id !== id))
    } catch (err) {
      console.log(err)
    }
  }

  const handleAddRole = async () => {
    try {
      await axios.post("${API_URL}/createrole", { nom: roleName })
      fetchRoles()
      setRoleName("")
      setShowAddModal(false)
    } catch (err) {
      console.log(err)
    }
  }

  const handleUpdateRole = async () => {
    if (!selectedRole) return
    try {
      await axios.put(`${API_URL}/updaterole/${selectedRole.id}`, { nom: roleName })
      fetchRoles()
      setSelectedRole(null)
      setRoleName("")
      setShowUpdateModal(false)
    } catch (err) {
      console.log(err)
    }
  }

  // 🔎 filter roles by search term
  const filteredRoles = data.filter((role) =>
    role.nom.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex">
      <Sidenav />
      <div className="bg-gray-100 h-screen w-screen">
        <Topbar />
        <div className="p-3 m-5 mt-1">
          {/* Header */}
          <div className="flex justify-between items-center mt-2 ml-2 mb-5">
            <div>
              <h1 className="font-bold text-2xl">Gestion Des Roles</h1>
              <h2 className="font-light">Suivi des Roles</h2>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 text-sm h-10 px-4 py-2 bg-blue-600 hover:bg-blue-500 active:bg-gray-200 shadow font-small text-white rounded-sm"
            >
              + Nouveau Role
            </button>
          </div>

          {/* Search */}
          <div className="flex justify-between items-center mb-4">
            <input
              type="text"
              placeholder="🔍 Rechercher une Role..."
              className="w-1/3 p-2 border rounded"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Table */}
          <div className="w-full h-110 mt-6 bg-white rounded-lg flex flex-col">
            <h1 className="font-medium text-xl px-6 py-4">Liste Des Roles</h1>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <table className="min-w-full gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left">#</th>
                    <th className="px-4 py-2 text-left">ROLE-NAME</th>
                    <th className="px-4 py-2 text-center" colSpan={2}>
                      ACTIONS
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRoles.length > 0 ? (
                    filteredRoles.map((d, i) => (
                      <tr key={d.id} className="hover:bg-gray-50">
                        <td className=" px-4 py-2">{i + 1}</td>
                        <td className="px-4 py-2">{d.nom}</td>
                        <td className="px-4 py-2 text-center">
                          <button
                            onClick={() => {
                              setSelectedRole(d)
                              setRoleName(d.nom)
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
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="text-center py-4 text-gray-500">
                        Aucun rôle trouvé
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Add Role Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)}>
        <h2 className="text-xl font-bold mb-4">Ajouter un Role</h2>
        <input
          type="text"
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
          placeholder="Nom du role"
          className="w-full p-2 border rounded mb-4"
        />
        <div className="flex justify-end gap-2">
          <button onClick={() => setShowAddModal(false)} className="px-4 py-2 bg-gray-200 rounded">
            Annuler
          </button>
          <button onClick={handleAddRole} className="px-4 py-2 bg-blue-600 text-white rounded">
            Enregistrer
          </button>
        </div>
      </Modal>

      {/* Update Role Modal */}
      <Modal isOpen={showUpdateModal} onClose={() => setShowUpdateModal(false)}>
        <h2 className="text-xl font-bold mb-4">Mettre à jour le Role</h2>
        <input
          type="text"
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
          placeholder="Nom du role"
          className="w-full p-2 border rounded mb-4"
        />
        <div className="flex justify-end gap-2">
          <button onClick={() => setShowUpdateModal(false)} className="px-4 py-2 bg-gray-200 rounded">
            Annuler
          </button>
          <button onClick={handleUpdateRole} className="px-4 py-2 bg-blue-600 text-white rounded">
            Mise à jour
          </button>
        </div>
      </Modal>
    </div>
  )
}

export default Roles
