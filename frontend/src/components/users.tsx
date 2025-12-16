import Sidenav from "./sidenav.tsx"
import Topbar from "./topbar.tsx"
import { useState, useEffect } from "react"
import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL || "${API_URL}"

interface User {
  id: number
  nom: string
  email: string
  telephone: string | null
  role_id: number | null
  date_inscription: string | null
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

function Users() {
  const [users, setUsers] = useState<User[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  // form state
  const [nom, setNom] = useState("")
  const [email, setEmail] = useState("")
  const [telephone, setTelephone] = useState("")
  const [roleId, setRoleId] = useState("")

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = () => {
    axios
      .get("${API_URL}/viewuser")
      .then((res) => {
        const mappedUsers: User[] = res.data.map((u: any) => ({
          id: u.id,
          nom: u.nom,
          email: u.email,
          telephone: u["téléphone"] ?? null,
          role_id: u.role_id ?? null,
          date_inscription: u.date_inscription ?? null,
        }))
        setUsers(mappedUsers)
      })
      .catch((err) => console.log(err))
  }

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${API_URL}/deleteuser/${id}`)
      setUsers((prev) => prev.filter((u) => u.id !== id))
    } catch (err: any) {
      console.log(err.response?.data || err)
    }
  }

  const handleAddUser = async () => {
    try {
      await axios.post("${API_URL}/createuser", {
        nom,
        email,
        telephone,
        role_id: roleId ? Number(roleId) : null,
      })
      fetchUsers()
      clearForm()
      setShowAddModal(false)
    } catch (err: any) {
      console.log(err.response?.data || err)
    }
  }

  const handleUpdateUser = async () => {
    if (!selectedUser) return
    try {
      await axios.put(`${API_URL}/updateuser/${selectedUser.id}`, {
        nom,
        email,
        telephone,
        role_id: roleId ? Number(roleId) : null,
      })
      fetchUsers()
      clearForm()
      setSelectedUser(null)
      setShowUpdateModal(false)
    } catch (err: any) {
      console.log(err.response?.data || err)
    }
  }

  const clearForm = () => {
    setNom("")
    setEmail("")
    setTelephone("")
    setRoleId("")
  }

  // 🔍 Filter users by search term
  const filteredUsers = users.filter((u) =>
    [u.nom, u.email, u.telephone]
      .filter(Boolean) // remove nulls
      .some((field) => field!.toLowerCase().includes(searchTerm.toLowerCase()))
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
              <h1 className="font-bold text-2xl">Gestion Des Utilisateurs</h1>
              <h2 className="font-light">Suivi des utilisateurs</h2>
            </div>
            {/* <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 text-sm h-10 px-4 py-2 bg-blue-600 hover:bg-blue-500 shadow text-white rounded-sm"
            >
              + Nouvel Utilisateur
            </button> */}
          </div>

          {/* Search Bar */}
          <div className="mb-4 px-2">
            <input
              type="text"
              placeholder="🔍 Rechercher l'Utilisateur..."
              className="w-full p-2 border rounded"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Table */}
          <div className="w-full h-110 mt-6 bg-white rounded-lg flex flex-col">
            <h1 className="font-medium text-xl px-6 py-4">
              Liste Des Utilisateurs
            </h1>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <table className="min-w-full gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2">#</th>
                    <th className="px-4 py-2">Nom</th>
                    <th className="px-4 py-2">Email</th>
                    <th className="px-4 py-2">Téléphone</th>
                    <th className="px-4 py-2">Rôle (ID)</th>
                    <th className="px-4 py-2 text-center" colSpan={2}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u, i) => (
                    <tr key={u.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2">{i + 1}</td>
                      <td className="px-4 py-2">{u.nom || "-"}</td>
                      <td className="px-4 py-2">{u.email}</td>
                      <td className="px-4 py-2">{u.telephone || "-"}</td>
                      <td className="px-4 py-2">{u.role_id ?? "-"}</td>
                      <td className="px-4 py-2 text-center">
                        <button
                          onClick={() => {
                            setSelectedUser(u)
                            setNom(u.nom)
                            setEmail(u.email)
                            setTelephone(u.telephone || "")
                            setRoleId(u.role_id ? String(u.role_id) : "")
                            setShowUpdateModal(true)
                          }}
                          className="text-blue-600 hover:underline"
                        >
                          Mise à jour
                        </button>
                      </td>
                      <td className="px-4 py-2 text-center">
                        <button
                          onClick={() => handleDelete(u.id)}
                          className="text-red-600 hover:underline"
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-4 text-gray-500">
                        Aucun utilisateur trouvé.
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
        <h2 className="text-xl font-bold mb-4">Ajouter un Utilisateur</h2>
        <input
          type="text"
          placeholder="Nom"
          className="w-full p-2 border rounded mb-2"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
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
          className="w-full p-2 border rounded mb-2"
          value={telephone}
          onChange={(e) => setTelephone(e.target.value)}
        />
        <input
          type="text"
          placeholder="Rôle ID"
          className="w-full p-2 border rounded mb-4"
          value={roleId}
          onChange={(e) => setRoleId(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setShowAddModal(false)}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Annuler
          </button>
          <button
            onClick={handleAddUser}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Enregistrer
          </button>
        </div>
      </Modal>

      {/* Update Modal */}
      <Modal isOpen={showUpdateModal} onClose={() => setShowUpdateModal(false)}>
        <h2 className="text-xl font-bold mb-4">Mettre à jour l'Utilisateur</h2>
        <input
          type="text"
          placeholder="Nom"
          className="w-full p-2 border rounded mb-2"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
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
          className="w-full p-2 border rounded mb-2"
          value={telephone}
          onChange={(e) => setTelephone(e.target.value)}
        />
        <input
          type="text"
          placeholder="Rôle ID"
          className="w-full p-2 border rounded mb-4"
          value={roleId}
          onChange={(e) => setRoleId(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setShowUpdateModal(false)}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Annuler
          </button>
          <button
            onClick={handleUpdateUser}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Mise à jour
          </button>
        </div>
      </Modal>
    </div>
  )
}

export default Users
