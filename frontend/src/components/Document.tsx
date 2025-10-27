import Sidenav from "./sidenav.tsx";
import Topbar from "./topbar.tsx";
import { useState, useEffect } from "react";
import axios from "axios";

interface Documents {
  id: number;
  sinistre_id: number;
  expert_id: number;
  nom_fichier: string;
  type_document: string;
  contenu_fichier: string;
  date_upload: string;
}

interface Sinistre {
  id: number;
  type: string;
}

interface User {
  id: number;
  nom: string;
  role_id: number;
}

function Modal({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: React.ReactNode }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96 relative">
        {children}
        <button className="absolute top-2 right-2 text-gray-500 hover:text-black" onClick={onClose}>
          ✕
        </button>
      </div>
    </div>
  );
}

function Document() {
  const [documents, setDocuments] = useState<Documents[]>([]);
  const [sinistres, setSinistres] = useState<Sinistre[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<Documents | null>(null);

  const [sinistreId, setSinistreId] = useState("");
  const [expertId, setExpertId] = useState("");
  const [nomFichier, setNomFichier] = useState("");
  const [typeDocument, setTypeDocument] = useState("");
  const [contenuFichier, setContenuFichier] = useState<File | null>(null);
  const [dateUpload, setDateUpload] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [currentExpertId, setCurrentExpertId] = useState<string>("");

  useEffect(() => {
    const storedExpertId = localStorage.getItem("user-id");
    if (storedExpertId) {
      setCurrentExpertId(storedExpertId);
      console.log("[SUCCESS] ✅ Found expert ID from localStorage:", storedExpertId);
    }

    fetchDocuments();
    fetchSinistres();
    fetchUsers();
  }, []);

  const fetchDocuments = () => {
    axios.get("http://localhost:3000/viewdocuments")
      .then(res => {
        const arr: any[] = Array.isArray(res.data) ? res.data : [];
        // Filter by logged-in expert if exists
        const filtered = currentExpertId 
          ? arr.filter((d: any) => d.expert_id === Number(currentExpertId))
          : arr;
        setDocuments(filtered);
        console.log(`[Documents] Fetched ${filtered.length} documents`);
      })
      .catch(err => console.log(err));
  };

  const fetchSinistres = () => {
    axios.get("http://localhost:3000/viewsinistres")
      .then(res => setSinistres(res.data))
      .catch(err => console.log(err));
  };

  const fetchUsers = () => {
    axios.get("http://localhost:3000/viewuser")
      .then(res => setUsers(res.data.filter((u: User) => u.role_id === 8)))
      .catch(err => console.log(err));
  };

  const clearForm = () => {
    setSinistreId("");
    setExpertId("");
    setNomFichier("");
    setTypeDocument("");
    setContenuFichier(null);
    setDateUpload("");
  };

  // Helper function to get the expert ID to send (use selected or current logged-in expert)
  const getExpertIdToSend = (): string => {
    if (expertId && expertId !== "") {
      return expertId;
    }
    // If no expert selected, use the logged-in expert's ID
    return currentExpertId || "";
  };

  const handleAddDocument = async () => {
    const expertToSend = getExpertIdToSend();
    
    if (!sinistreId) return alert("Veuillez choisir un sinistre.");
    if (!expertToSend) return alert("Veuillez choisir un expert.");
    
    const formData = new FormData();
    formData.append("sinistre_id", sinistreId);
    formData.append("expert_id", expertToSend);
    formData.append("nom_fichier", nomFichier);
    formData.append("type_document", typeDocument);
    if (contenuFichier) formData.append("contenu_fichier", contenuFichier);
    formData.append("date_upload", dateUpload);

    try {
      await axios.post("http://localhost:3000/createdocuments", formData, { 
        headers: { "Content-Type": "multipart/form-data" } 
      });
      fetchDocuments();
      clearForm();
      setShowAddModal(false);
    } catch (err: any) {
      console.log(err.response?.data || err);
      alert("Erreur lors de l'ajout du document");
    }
  };

  const handleUpdateDocument = async () => {
    if (!selectedDoc) return;
    
    const expertToSend = getExpertIdToSend();
    
    if (!sinistreId) return alert("Veuillez choisir un sinistre.");
    if (!expertToSend) return alert("Veuillez choisir un expert.");
    
    const formData = new FormData();
    formData.append("sinistre_id", sinistreId);
    formData.append("expert_id", expertToSend);
    formData.append("nom_fichier", nomFichier);
    formData.append("type_document", typeDocument);
    if (contenuFichier) formData.append("contenu_fichier", contenuFichier);
    formData.append("date_upload", dateUpload);

    try {
      await axios.put(`http://localhost:3000/updatedocuments/${selectedDoc.id}`, formData, { 
        headers: { "Content-Type": "multipart/form-data" } 
      });
      fetchDocuments();
      clearForm();
      setSelectedDoc(null);
      setShowUpdateModal(false);
    } catch (err: any) {
      console.log(err.response?.data || err);
      alert("Erreur lors de la mise à jour du document");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3000/deletedocuments/${id}`);
      setDocuments(prev => prev.filter(d => d.id !== id));
    } catch (err: any) {
      console.log(err.response?.data || err);
    }
  };

  // filtered documents by search
  const filteredData = documents.filter(d => 
    d.nom_fichier.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.type_document.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.date_upload.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.sinistre_id.toString().includes(searchTerm)
  );

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
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="w-full h-110 mt-6 bg-white rounded-lg flex flex-col">
            <h1 className="font-medium text-xl px-6 py-4">Liste Des Documents</h1>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <table className="min-w-full gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left">#</th>
                    <th className="px-4 py-2 text-left">Sinistre ID</th>
                    <th className="px-4 py-2 text-left">Nom Fichier</th>
                    <th className="px-4 py-2 text-left">Type du Fichier</th>
                    <th className="px-4 py-2 text-left">Date de téléchargement</th>
                    <th className="px-4 py-2 text-left">Expert</th>
                    <th className="px-4 py-2 text-center" colSpan={2}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((d, i) => (
                    <tr key={d.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2">{i + 1}</td>
                      <td className="px-4 py-2">{d.sinistre_id}</td>
                      <td className="px-4 py-2">{d.nom_fichier}</td>
                      <td className="px-4 py-2">{d.type_document}</td>
                      <td className="px-4 py-2">{d.date_upload}</td>
                      <td className="px-4 py-2">{users.find(u => u.id === d.expert_id)?.nom || d.expert_id}</td>
                      <td className="px-4 py-2 text-center">
                        <button
                          onClick={() => {
                            setSelectedDoc(d);
                            setSinistreId(String(d.sinistre_id));
                            setExpertId(String(d.expert_id));
                            setNomFichier(d.nom_fichier);
                            setTypeDocument(d.type_document);
                            setDateUpload(d.date_upload);
                            setShowUpdateModal(true);
                          }}
                          className="text-blue-600 hover:underline"
                        >
                          Update
                        </button>
                      </td>
                      <td className="px-4 py-2 text-center">
                        <button onClick={() => handleDelete(d.id)} className="text-red-600 hover:underline">Delete</button>
                      </td>
                    </tr>
                  ))}
                  {filteredData.length === 0 && (
                    <tr>
                      <td colSpan={8} className="text-center text-gray-500 py-4">Aucun document trouvé</td>
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
        <h2 className="text-xl font-bold mb-4">Ajouter un Document</h2>

        <select className="w-full p-2 border rounded mb-2" value={sinistreId} onChange={e => setSinistreId(e.target.value)}>
          <option value="">-- Choisir un sinistre --</option>
          {sinistres.map(s => <option key={s.id} value={s.id}>{s.type}</option>)}
        </select>

        <select 
          className="w-full p-2 border rounded mb-2" 
          value={expertId || currentExpertId} 
          onChange={e => setExpertId(e.target.value)}
        >
          <option value="">-- Choisir un expert --</option>
          {users.map(u => <option key={u.id} value={u.id}>{u.nom}</option>)}
        </select>

        <input type="text" placeholder="Nom du fichier" className="w-full p-2 border rounded mb-2" value={nomFichier} onChange={e => setNomFichier(e.target.value)} />
        <input type="text" placeholder="Type du document" className="w-full p-2 border rounded mb-2" value={typeDocument} onChange={e => setTypeDocument(e.target.value)} />
        <input type="file" className="w-full p-2 border rounded mb-2" onChange={e => e.target.files && setContenuFichier(e.target.files[0])} />
        <input type="date" className="w-full p-2 border rounded mb-4" value={dateUpload} onChange={e => setDateUpload(e.target.value)} />

        <div className="flex justify-end gap-2">
          <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => setShowAddModal(false)}>Cancel</button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={handleAddDocument}>Save</button>
        </div>
      </Modal>

      {/* Update Modal */}
      <Modal isOpen={showUpdateModal} onClose={() => setShowUpdateModal(false)}>
        <h2 className="text-xl font-bold mb-4">Mettre à jour le Document</h2>

        <select className="w-full p-2 border rounded mb-2" value={sinistreId} onChange={e => setSinistreId(e.target.value)}>
          <option value="">-- Choisir un sinistre --</option>
          {sinistres.map(s => <option key={s.id} value={s.id}>{s.type}</option>)}
        </select>

        <select className="w-full p-2 border rounded mb-2" value={expertId} onChange={e => setExpertId(e.target.value)}>
          <option value="">-- Choisir un expert --</option>
          {users.map(u => <option key={u.id} value={u.id}>{u.nom}</option>)}
        </select>

        <input type="text" placeholder="Nom du fichier" className="w-full p-2 border rounded mb-2" value={nomFichier} onChange={e => setNomFichier(e.target.value)} />
        <input type="text" placeholder="Type du document" className="w-full p-2 border rounded mb-2" value={typeDocument} onChange={e => setTypeDocument(e.target.value)} />
        <input type="file" className="w-full p-2 border rounded mb-2" onChange={e => e.target.files && setContenuFichier(e.target.files[0])} />
        <input type="date" className="w-full p-2 border rounded mb-4" value={dateUpload} onChange={e => setDateUpload(e.target.value)} />

        <div className="flex justify-end gap-2">
          <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => setShowUpdateModal(false)}>Cancel</button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={handleUpdateDocument}>Update</button>
        </div>
      </Modal>
    </div>
  );
}

export default Document;