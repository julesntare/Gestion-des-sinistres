import Topbar from "./topbar.tsx"
import { useState, useEffect } from "react"
import axios from "axios"

interface Sinistre {
  id: number
  utilisateur_id?: number
  police_id?: number
  date_declaration?: string
  type: string
  description?: string
  statut?: string
  montant_requis?: number
  montant_approuvé?: number
}

interface Police {
  id: number
  numero_police?: string
  type?: string
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

function Claims() {
  const [sinistres, setSinistres] = useState<Sinistre[]>([])
  const [polices, setPolices] = useState<Police[]>([])

  const [showAddSinistreModal, setShowAddSinistreModal] = useState(false)
  const [showAddDocModal, setShowAddDocModal] = useState(false)
  const [selectedSinistreId, setSelectedSinistreId] = useState<number | null>(null)

  const [policeId, setPoliceId] = useState("")
  const [dateDeclaration, setDateDeclaration] = useState("")
  const [type, setType] = useState("")
  const [description, setDescription] = useState("")
  const [userId, setUserId] = useState("")

  const [titre, setTitre] = useState("")
  const [docType, setDocType] = useState("")
  const [documentFile, setDocumentFile] = useState<File | null>(null)

  const [successMessage, setSuccessMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const storedUserId = localStorage.getItem("user-id")
    if (storedUserId) {
      setUserId(storedUserId)
      fetchSinistres(storedUserId)
    }
    fetchPolices()
  }, [])

  const fetchSinistres = (uid: string) => {
    const url = uid
      ? `http://localhost:3000/viewsinistres/${uid}`
      : `http://localhost:3000/viewsinistres`
    axios
      .get(url)
      .then((res) => setSinistres(res.data || []))
      .catch((err) => console.error("fetchSinistres error:", err))
  }

  const fetchPolices = () => {
    axios
      .get("http://localhost:3000/viewpolices")
      .then((res) => setPolices(res.data || []))
      .catch((err) => console.error("fetchPolices error:", err))
  }

  const handleAddSinistre = async () => {
    try {
      await axios.post("http://localhost:3000/createsinistres", {
        utilisateur_id: userId,
        police_id: Number(policeId),
        date_declaration: dateDeclaration,
        type,
        description,
        statut: "en attente",
        montant_requis: 0.0,
        montant_approuvé: 0.0,
      })
      if (userId) fetchSinistres(userId)
      clearSinistreForm()
      setShowAddSinistreModal(false)
      setSuccessMessage("Sinistre enregistré avec succès ✅")
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (err: any) {
      console.error("handleAddSinistre error:", err.response?.data || err)
      alert("Erreur lors de la création du sinistre.")
    }
  }

  const clearSinistreForm = () => {
    setPoliceId("")
    setDateDeclaration("")
    setType("")
    setDescription("")
  }

  const handleAddDocument = async () => {
    if (!selectedSinistreId || !documentFile)
      return alert("Veuillez compléter les champs.")
    try {
      const formData = new FormData()
      formData.append("sinistre_id", selectedSinistreId.toString())
      formData.append("nom_fichier", titre)
      formData.append("type_document", docType)
      formData.append("contenu_fichier", documentFile, documentFile.name)
      await axios.post("http://localhost:3000/createdocuments", formData)
      const storedUserId = localStorage.getItem("user-id")
      if (storedUserId) fetchSinistres(storedUserId)
      clearDocumentForm()
      setShowAddDocModal(false)
      setSelectedSinistreId(null)
      setSuccessMessage("Document enregistré avec succès ✅")
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (err: any) {
      console.error("handleAddDocument error:", err.response?.data || err)
    }
  }

  const clearDocumentForm = () => {
    setTitre("")
    setDocType("")
    setDocumentFile(null)
  }

  const filteredSinistres = sinistres.filter(
    (s) =>
      s.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.description ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.statut ?? "").toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex">
      <div className="bg-gray-100 h-screen w-screen">
        <Topbar />
        <div className="p-3 m-5 mt-1">
          <div className="flex justify-between items-center mt-2 ml-2 mb-5">
            <div>
              <h1 className="font-bold text-2xl">Sinistre</h1>
              <h2 className="font-light">Expertises des sinistres</h2>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="🔍 Rechercher..."
                className="border rounded px-3 py-2 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                onClick={() => setShowAddSinistreModal(true)}
                className="flex items-center gap-2 text-sm h-10 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-sm"
              >
                + Nouveau Sinistre
              </button>
            </div>
          </div>

          {successMessage && (
            <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">
              {successMessage}
            </div>
          )}

          <div className="w-full mt-6 bg-white rounded-lg flex flex-col p-6 gap-4">
            {filteredSinistres.length > 0 ? (
              filteredSinistres.map((s) => (
                <div key={s.id} className="border-b border-gray-200 pb-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{s.type}</h3>
                      <p className="text-sm text-gray-500">ID: {s.id}</p>
                    </div>
                    <span className="font-medium">{s.statut}</span>
                  </div>
                  <p className="text-gray-600 mt-1 whitespace-normal break-words">
                    {s.description}
                  </p>
                  <div className="flex gap-4 mt-2">
                    <span className="font-medium">Montant Requis: {s.montant_requis}</span>
                    <span className="font-medium">Montant Approuvé: {s.montant_approuvé}</span>
                  </div>
                  <div className="flex justify-end mt-3">
                    <button
                      onClick={() => {
                        setSelectedSinistreId(s.id)
                        setShowAddDocModal(true)
                      }}
                      className="px-3 py-2 text-sm bg-green-600 hover:bg-green-500 text-white rounded"
                    >
                      + Ajouter un document
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">Aucun sinistre trouvé.</p>
            )}
          </div>
        </div>
      </div>

      {/* Add Sinistre Modal */}
      <Modal isOpen={showAddSinistreModal} onClose={() => setShowAddSinistreModal(false)}>
        <h2 className="text-xl font-bold mb-4">Ajouter un Sinistre</h2>

        {/* Police select */}
        <select
          className="w-full p-2 border rounded mb-2"
          value={policeId}
          onChange={(e) => setPoliceId(e.target.value)}
        >
          <option value="">Sélectionner une Police</option>
          {polices.map((p) => (
            <option key={p.id} value={p.id}>
              {p.type ?? p.numero_police ?? p.id}
            </option>
          ))}
        </select>

        <input
          type="date"
          className="w-full p-2 border rounded mb-2"
          value={dateDeclaration}
          onChange={(e) => setDateDeclaration(e.target.value)}
        />
        <input
          type="text"
          placeholder="Type"
          className="w-full p-2 border rounded mb-2"
          value={type}
          onChange={(e) => setType(e.target.value)}
        />
        <textarea
          placeholder="Description"
          className="w-full p-2 border rounded mb-4"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={() => setShowAddSinistreModal(false)}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Cancel
          </button>
          <button onClick={handleAddSinistre} className="px-4 py-2 bg-blue-600 text-white rounded">
            Save
          </button>
        </div>
      </Modal>
    </div>
  )
}

export default Claims
