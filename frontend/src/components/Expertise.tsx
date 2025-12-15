import Sidenav from "./sidenav.tsx";
import Topbar from "./topbar.tsx";
import { useState, useEffect } from "react";
import axios from "axios";

interface Expertises {
  id: number;
  sinistre_id: number;
  expert_id?: number;
  expert?: number | null;
  rapport: string;
  date_evaluation: string;
}

interface Sinistre {
  id: number;
  Numero_Sinistre: string;
}

interface User {
  id: number;
  nom: string;
  role_id: number;
}

function Modal({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!isOpen) return null;
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
  );
}

function Expertise() {
  const [expertises, setExpertises] = useState<Expertises[]>([]);
  const [sinistres, setSinistres] = useState<Sinistre[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedExp, setSelectedExp] = useState<Expertises | null>(null);
  const [loggedInUserId, setLoggedInUserId] = useState<number | null>(null);

  const [sinistreId, setSinistreId] = useState("");
  const [expertName, setExpertName] = useState(""); // ✅ type name instead of ID
  const [rapport, setRapport] = useState("");
  const [dateEvaluation, setDateEvaluation] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const userId = localStorage.getItem("user-id");
    if (userId) setLoggedInUserId(Number(userId));
  }, []);

  useEffect(() => {
    if (loggedInUserId) {
      fetchExpertises();
      fetchSinistres();
      fetchUsers();
    }
  }, [loggedInUserId]);

  const fetchExpertises = () => {
    axios.get("http://localhost:3000/viewexpertises")
      .then(res => {
        const arr: any[] = Array.isArray(res.data) ? res.data : [];

        const normalized = arr.map((e: any) => {
          let expertValue =
            e.expert !== undefined && e.expert !== null
              ? e.expert
              : e.expert_id;

          return {
            ...e,
            expert: expertValue ? Number(expertValue) : null,
            expert_id: e.expert_id,
          };
        });

        const filtered = normalized.filter((e) => {
          const expertIdValue = e.expert || e.expert_id;
          return Number(expertIdValue) === Number(loggedInUserId);
        });

        setExpertises(filtered);
      })
      .catch((err) => console.error(err));
  };

  const fetchSinistres = () => {
    axios.get("http://localhost:3000/viewsinistres")
      .then((res) => setSinistres(res.data))
      .catch((err) => console.log(err));
  };

  const fetchUsers = () => {
    axios.get("http://localhost:3000/viewuser")
      .then((res) =>
        setUsers(res.data.filter((u: { role_id: number }) => u.role_id === 8))
      )
      .catch((err) => console.log(err));
  };

  const clearForm = () => {
    setSinistreId("");
    setExpertName("");
    setRapport("");
    setDateEvaluation("");
  };

  // ✅ Convert typed expert name to ID
  const findExpertIdByName = (): number | null => {
    const found = users.find(
      (u) => u.nom.toLowerCase() === expertName.toLowerCase().trim()
    );
    return found ? found.id : null;
  };

  const handleAddExpertise = async () => {
    if (!sinistreId || !expertName) {
      return alert("Veuillez choisir un sinistre et saisir un expert.");
    }

    const expertId = findExpertIdByName();
    if (!expertId) {
      return alert("Expert non trouvé.");
    }

    try {
      await axios.post("http://localhost:3000/createexpertises", {
        sinistre_id: Number(sinistreId),
        expert: expertId,
        rapport,
        date_evaluation: dateEvaluation,
      });

      fetchExpertises();
      clearForm();
      setShowAddModal(false);
    } catch (err: any) {
      console.log(err.response?.data || err);
    }
  };

  const handleUpdateExpertise = async () => {
    if (!selectedExp) return;

    const expertId = findExpertIdByName();
    if (!expertId) {
      return alert("Expert non trouvé.");
    }

    try {
      await axios.put(
        `http://localhost:3000/updateexpertises/${selectedExp.id}`,
        {
          sinistre_id: Number(sinistreId),
          expert: expertId,
          rapport,
          date_evaluation: dateEvaluation,
        }
      );

      fetchExpertises();
      clearForm();
      setSelectedExp(null);
      setShowUpdateModal(false);
    } catch (err: any) {
      console.log(err.response?.data || err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3000/deleteexpertises/${id}`);
      setExpertises((prev) => prev.filter((e) => e.id !== id));
    } catch (err: any) {
      console.log(err.response?.data || err);
    }
  };

  const filteredData = expertises.filter((e) => {
    const sinistre =
      sinistres.find((s) => s.id === e.sinistre_id)?.Numero_Sinistre || "";
    const expertNameDisplay =
      users.find((u) => u.id === (e.expert || e.expert_id))?.nom || "";

    return (
      sinistre.toLowerCase().includes(search.toLowerCase()) ||
      expertNameDisplay.toLowerCase().includes(search.toLowerCase()) ||
      e.rapport.toLowerCase().includes(search.toLowerCase()) ||
      e.date_evaluation.toLowerCase().includes(search.toLowerCase())
    );
  });

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

          <input
            type="text"
            placeholder="🔍 Rechercher..."
            className="w-1/3 p-2 border rounded mb-4"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <table className="min-w-full bg-white rounded shadow">
            <thead>
              <tr className="bg-gray-100">
                <th>#</th>
                <th>Numero du Sinistre</th>
                <th>Expert</th>
                <th>Rapport</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((e, i) => {
                const sinistre =
                  sinistres.find((s) => s.id === e.sinistre_id)?.Numero_Sinistre ||
                  e.sinistre_id;

                const expertDisplay =
                  users.find((u) => u.id === (e.expert || e.expert_id))?.nom ||
                  (e.expert || e.expert_id);

                return (
                  <tr key={e.id}>
                    <td>{i + 1}</td>
                    <td>{sinistre}</td>
                    <td>{expertDisplay}</td>
                    <td>{e.rapport}</td>
                    <td>{e.date_evaluation}</td>
                    <td>
                      <button
                        onClick={() => {
                          setSelectedExp(e);
                          setSinistreId(String(e.sinistre_id));
                          const name =
                            users.find(
                              (u) => u.id === (e.expert || e.expert_id)
                            )?.nom || "";
                          setExpertName(name);
                          setRapport(e.rapport);
                          setDateEvaluation(e.date_evaluation);
                          setShowUpdateModal(true);
                        }}
                        className="text-blue-600 mr-2"
                      >
                        Modifier
                      </button>

                      <button
                        onClick={() => handleDelete(e.id)}
                        className="text-red-600"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
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

        <input
          type="text"
          placeholder="Nom de l'expert"
          className="w-full p-2 border rounded mb-2"
          value={expertName}
          onChange={(e) => setExpertName(e.target.value)}
        />

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

      {/* Update Modal */}
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

        <input
          type="text"
          placeholder="Nom de l'expert"
          className="w-full p-2 border rounded mb-2"
          value={expertName}
          onChange={(e) => setExpertName(e.target.value)}
        />

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
            Update
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default Expertise;
