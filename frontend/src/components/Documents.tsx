import Sidenav from "./sidenav.tsx"
import Topbar from "./topbar.tsx"
import { useState, useEffect } from "react"
import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL || "${API_URL}"

interface Document {
  id: number
  sinistre_id: number
  expert: number
  nom_fichier: string
  type_document: string
  contenu_fichier: any
  date_upload: string
}


interface Sinistre {
  id: number
  Numero_Sinistre: string
  type: string
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

function Documents() {
  const [data, setData] = useState<Document[]>([])
  const [sinistres, setSinistres] = useState<Sinistre[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null)

  const [sinistreId, setSinistreId] = useState("")
  const [expertId, setExpertId] = useState("")
  const [nomFichier, setNomFichier] = useState("")
  const [typeDocument, setTypeDocument] = useState("")
  const [contenuFichier, setContenuFichier] = useState<File | null>(null)
  const [dateUpload, setDateUpload] = useState("")

  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchDocuments()
    fetchSinistres()
    fetchUsers()
  }, [])

  const fetchDocuments = () => {
    axios
      .get("${API_URL}/viewdocuments")
      .then((res) => setData(res.data))
      .catch((err) => console.log(err))
  }

  const fetchSinistres = () => {
    axios
      .get("${API_URL}/viewsinistres")
      .then((res) => setSinistres(res.data))
      .catch((err) => console.log(err))
  }

  const fetchUsers = () => {
    axios
      .get("${API_URL}/viewuser")
      .then((res) => setUsers(res.data.filter((u: User) => u.role_id === 8)))
      .catch((err) => console.log(err))
  }

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${API_URL}/deletedocuments/${id}`)
      setData((prev) => prev.filter((doc) => doc.id !== id))
    } catch (err: any) {
      console.log(err.response?.data || err)
    }
  }

  const handleAddDocument = async () => {
    try {
      const formData = new FormData()
      formData.append("sinistre_id", sinistreId)
      formData.append("expert", expertId)
      formData.append("nom_fichier", nomFichier)
      formData.append("type_document", typeDocument)
      if (contenuFichier) {
        formData.append("contenu_fichier", contenuFichier)
      }
      formData.append("date_upload", dateUpload)

      await axios.post("${API_URL}/createdocuments", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      fetchDocuments()
      clearForm()
      setShowAddModal(false)
    } catch (err: any) {
      console.log(err.response?.data || err)
    }
  }

  const handleUpdateDocument = async () => {
    if (!selectedDoc) return
    try {
      const formData = new FormData()
      formData.append("sinistre_id", sinistreId)
      formData.append("expert", expertId)
      formData.append("nom_fichier", nomFichier)
      formData.append("type_document", typeDocument)
      if (contenuFichier) {
        formData.append("contenu_fichier", contenuFichier)
      }
      formData.append("date_upload", dateUpload)

      await axios.put(
        `${API_URL}/updatedocuments/${selectedDoc.id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      )

      fetchDocuments()
      clearForm()
      setSelectedDoc(null)
      setShowUpdateModal(false)
    } catch (err: any) {
      console.log(err.response?.data || err)
    }
  }

  const handleDownload = async (id: number, nomFichier: string) => {
    try {
      const res = await axios.get(`${API_URL}/download/${id}`, {
        responseType: "blob",
      })

      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", nomFichier)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (err) {
      console.error("Erreur lors du téléchargement :", err)
    }
  }

  const clearForm = () => {
    setSinistreId("")
    setExpertId("")
    setNomFichier("")
    setTypeDocument("")
    setContenuFichier(null)
    setDateUpload("")
  }

  const renderFilePreview = () => {
    if (!contenuFichier) return null
    const fileURL = URL.createObjectURL(contenuFichier)

    if (contenuFichier.type.startsWith("image/")) {
      return <img src={fileURL} alt="preview" className="h-32 mt-2 rounded" />
    } else if (contenuFichier.type.startsWith("video/")) {
      return <video src={fileURL} controls className="h-32 mt-2 rounded" />
    } else {
      return (
        <p className="mt-2 text-sm text-gray-600">
          Fichier sélectionné : {contenuFichier.name}
        </p>
      )
    }
  }

  const filteredData = data.filter((d) => {
    const Numero_Sinistre = sinistres.find(s => s.id === d.sinistre_id)?.Numero_Sinistre || ""

    return (
      d.nom_fichier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      Numero_Sinistre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.type_document.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.date_upload.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.sinistre_id.toString().includes(searchTerm)
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
              <h1 className="font-bold text-2xl">Gestion Des Documents</h1>
              <h2 className="font-light">Suivi des Documents</h2>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 text-sm h-10 px-4 py-2 bg-blue-600 hover:bg-blue-500 shadow text-white rounded-sm"
            >
              + Nouveau Document
            </button>
          </div>

          <div className="flex justify-between items-center mb-4">
            <input
              type="text"
              placeholder="🔍 Rechercher un document..."
              className="w-1/3 p-2 border rounded"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="w-full h-110 mt-6 bg-white rounded-lg flex flex-col">
            <h1 className="font-medium text-xl px-6 py-4">Liste Des Documents</h1>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <table className="min-w-full gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left">#</th>
                    <th className="px-4 py-2 text-left">Numero du Sinistre</th>
                    <th className="px-4 py-2 text-left">Expert</th>
                    <th className="px-4 py-2 text-left">Nom Fichier</th>
                    <th className="px-4 py-2 text-left">Type du Fichier</th>
                    <th className="px-4 py-2 text-left">Date de téléchargement</th>
                    <th className="px-4 py-2 text-center" colSpan={3}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((d, i) => (
                    <tr key={d.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2">{i + 1}</td>
                      <td className="px-4 py-2">{sinistres.find(s => s.id === d.sinistre_id)?.Numero_Sinistre}</td>
                      <td className="px-4 py-2">{users.find(u => u.id === d.expert)?.nom || d.expert || "-"}</td>
                      <td className="px-4 py-2">{d.nom_fichier}</td>
                      <td className="px-4 py-2">{d.type_document}</td>
                      <td className="px-4 py-2">{d.date_upload}</td>
                      <td className="px-4 py-2 text-center">
                        <button
                          onClick={() => handleDownload(d.id, d.nom_fichier)}
                          className="text-green-600 hover:underline"
                        >
                          Télécharger
                        </button>
                      </td>
                      <td className="px-4 py-2 text-center">
                        <button
                          onClick={() => {
                            setSelectedDoc(d)
                            setSinistreId(String(d.sinistre_id))
                            setExpertId(String(d.expert))
                            setNomFichier(d.nom_fichier)
                            setTypeDocument(d.type_document)
                            setDateUpload(d.date_upload)
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
                  ))}
                  {filteredData.length === 0 && (
                    <tr>
                      <td
                        colSpan={9}
                        className="text-center text-gray-500 py-4"
                      >
                        Aucun document trouvé
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
        <h2 className="text-xl font-bold mb-4">Ajouter un Document</h2>

        <select
          className="w-full p-2 border rounded mb-2"
          value={sinistreId}
          onChange={(e) => setSinistreId(e.target.value)}
          required
        >
          <option value="">Sélectionner le Numero du Sinistre</option>
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
          required
        >
          <option value="">Sélectionner un Expert</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.nom}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Nom du fichier"
          className="w-full p-2 border rounded mb-2"
          value={nomFichier}
          onChange={(e) => setNomFichier(e.target.value)}
        />

        <input
          type="text"
          placeholder="Type du document"
          className="w-full p-2 border rounded mb-2"
          value={typeDocument}
          onChange={(e) => setTypeDocument(e.target.value)}
        />

        <input
          type="file"
          className="w-full p-2 border rounded mb-2"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              setContenuFichier(e.target.files[0])
            }
          }}
        />
        {renderFilePreview()}

        <input
          type="date"
          className="w-full p-2 border rounded mb-4"
          value={dateUpload}
          onChange={(e) => setDateUpload(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={() => setShowAddModal(false)}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Annuler
          </button>
          <button
            onClick={handleAddDocument}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Enregistrer
          </button>
        </div>
      </Modal>

      <Modal isOpen={showUpdateModal} onClose={() => setShowUpdateModal(false)}>
        <h2 className="text-xl font-bold mb-4">Mettre à jour le Document</h2>

        <select
          className="w-full p-2 border rounded mb-2"
          value={sinistreId}
          onChange={(e) => setSinistreId(e.target.value)}
          required
        >
          <option value="">Sélectionner le Numero du Sinistre</option>
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
          required
        >
          <option value="">Sélectionner un Expert</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.nom}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Nom du fichier"
          className="w-full p-2 border rounded mb-2"
          value={nomFichier}
          onChange={(e) => setNomFichier(e.target.value)}
        />

        <input
          type="text"
          placeholder="Type du document"
          className="w-full p-2 border rounded mb-2"
          value={typeDocument}
          onChange={(e) => setTypeDocument(e.target.value)}
        />

        <input
          type="file"
          className="w-full p-2 border rounded mb-2"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              setContenuFichier(e.target.files[0])
            }
          }}
        />
        {renderFilePreview()}

        <input
          type="date"
          className="w-full p-2 border rounded mb-4"
          value={dateUpload}
          onChange={(e) => setDateUpload(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={() => setShowUpdateModal(false)}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Annuler
          </button>
          <button
            onClick={handleUpdateDocument}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Mise à jour
          </button>
        </div>
      </Modal>
    </div>
  )
}

export default Documents