import express from "express"
import mysql from "mysql2"
import cors from "cors"
import bcrypt from "bcrypt"
import multer from "multer"

const app = express()
const port = process.env.PORT || 3000;
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

app.use(express.json())
app.use(cors())

// Database Configuration

const db = mysql.createConnection({
    host : "localhost",
    user : "root",
    password : "",
    database : "serenitydb"
})

db.connect((err) => {
    if (err) {
        console.error("connection failed", err);
    } else {
        console.log("connection success")
    }
})

//REGISTRATION

app.post("/register", async(req, res) => {
    const {name,email, password, phone, role_id, date_inscription} = req.body;
    try{
    const hashedpassword = await bcrypt.hash(password, 10)
    const sql = "INSERT INTO `users`(`nom`, `email`, `mot_de_passe`, `téléphone`, `role_id`, `date_inscription`) VALUES (?,?,?,?,?,?)";
    db.query(sql, [name, email, hashedpassword, phone, role_id, date_inscription], (err, data) => {
        if(err) {
            console.error(err)
            return res.status(500).json({message: "error inserting data"}, err)
        }
            return res.status(201).json({message: "inserting success", data})
    })}
    catch (error) {
        console.error(error);
        res.json({message: "something went off course", error})
    }
})

//LOGIN

app.post("/login", (req, res) => {
  const {name, mot_de_passe} = req.body;
  const sql = "SELECT * FROM users WHERE nom = ?";
  db.query(sql, [name], async (err, data) => {
    if (err) return res.status(500).json({message: "error selecting"});

    if (data.length === 0) {
      return res.status(401).json({message: "incorrect credentials"});
    }

    const user = data[0];
    const match = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
    if (!match) {
      return res.status(401).json({message: "incorrect password"});
    } else {
      return res.status(200).json({
        message: "login success",
        user: {
          id: user.id,
          name: user.nom,
          role_id: user.role_id
        }
      });
    }
  });
});


//USERS

app.get("/viewuser", (req, res) => {
    const sql = "SELECT * FROM `users`";
    db.query(sql, (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({message: "selecting error"}, err)
        }
        return res.status(201).json(data)
    })
    
})

app.put("/updateuser/:id", (req, res) => {
    const {name,email, password, phone, role_id, date_inscription } = req.body;
    const { id } = req.params;

    const sql = "UPDATE `users` SET`nom`=?,`email`=?,`mot_de_passe`=?,`téléphone`=?,`role_id`=?,`date_inscription`=? where `id` = ?";
    db.query(sql, [name, email, password, phone, role_id, date_inscription, id], (err, msg) => {
        if (err) {
            return res.status(500).json({ message: "Error Updating" }, err);
        }
        return res.status(200).json({ message: "Update Successful" }, msg);
    });
});

app.delete("/deleteuser/:id", (req, res) => {
    const {id} = req.params
    const sql = "DELETE FROM `users` WHERE `id` = ?"
    db.query(sql, [id], (err, msg) => {
        if (err) {
            return res.status(500).json({message: "Deleting failed"}, err)
        }
        return res.status(200).json({message: "Deleted Successfully"}, msg)
    })
})

//ROLE ENDPOINTS

app.get("/viewrole", (req, res) => {
    const sql = "SELECT * FROM `roles`";
    db.query(sql, (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Error fetching roles" });
        }
        return res.status(200).json(data); // ✅ use 200 for success
    });
});


app.post("/createrole", (req, res) => {
    const {nom} = req.body
    const sql = "INSERT INTO `roles`(`nom`) VALUES (?)"
    db.query(sql, [nom], (err, msg) => {
        if (err) {
            return res.status(500).json({message: "Error Inserting"}, err)
        }
        return res.status(200).json({message: "Insert Successfull"}, msg)
    })
})

app.put("/updaterole/:id", (req, res) => {
    const { name } = req.body;
    const { id } = req.params;

    const sql = "UPDATE `roles` SET `nom` = ? WHERE `id` = ?";
    db.query(sql, [name, id], (err, msg) => {
        if (err) {
            return res.status(500).json({ message: "Error Updating" }, err);
        }
        return res.status(200).json({ message: "Update Successful" }, msg);
    });
});

app.delete("/deleterole/:id", (req, res) => {
    const {id} = req.params
    const sql = "DELETE FROM `roles` WHERE `id` = ?"
    db.query(sql, [id], (err, msg) => {
        if (err) {
            return res.status(500).json({message: "Deleting failed"}, err)
        }
        return res.status(200).json({message: "Deleted Successfully"}, msg)
    })
})

//EXPRERTS

app.get("/viewexpert", (req,res) => {
    const sql = "SELECT * FROM `experts`"
    db.query(sql, (err, data) => {
        if (err) {
            return res.status(500).json({message: "Error getting info"}, err)
        }
        return res.status(200).json(data)
    })
})

app.post("/createexpert", (req,res) => {
    const {nom,	specialite,	email,	telephone} = req.body
    const sql = "INSERT INTO `experts`(`nom`, `spécialité`, `email`, `téléphone`) VALUES (?,?,?,?)"
    db.query(sql, [nom,	specialite,	email,	telephone], (err, msg) => {
        if (err) {
            return res.status(500).json({message: "Error creating expert"}, err)
        }
        return res.status(201).json({message: "Insert Successfull"}, msg)
    })
})

app.put("/updateexpert/:id", (req, res) => {
    const {nom,	specialite,	email,	telephone} = req.body
    const {id} = req.params
    const sql = "UPDATE `experts` SET `nom`=?,`spécialité`=?,`email`=?,`téléphone`=? WHERE id=?"
    db.query(sql, [nom,	specialite,	email,	telephone,  id], (err, msg) => {
        if (err) {
            return res.status(500).json({message: "Error updating expert"}, err)
        }
        return res.status(201).json({message: "Update Successfull"}, msg)
    })
})

app.delete("/deleteexpert/:id", (req, res) => {
    const {id} = req.params
    const sql = "DELETE FROM `experts` WHERE `id`=?"
    db.query(sql, [id], (err, msg) => {
        if (err) {
            return res.status(500).json({message: "Error deleting expert"}, err)
        }
        return res.status(201).json({message: "deleted Successfully"}, msg)
    })
})

//EXPERTISES ENDPOINTS

app.get("/viewexpertises", (req,res) => {
    const sql = "SELECT * FROM `expertises`"
    db.query(sql, (err, data) => {
        if (err) {
            return res.status(500).json({message: "Error getting info"}, err)
        }
        return res.status(200).json(data)
    })
})

app.post("/createexpertises", (req,res) => {
    const {sinistre_id, expert, rapport, date_evaluation} = req.body
    const sql = "INSERT INTO `expertises`(`sinistre_id`, `expert`, `rapport`, `date_evaluation`) VALUES (?,?,?,?)"
    db.query(sql, [sinistre_id, expert, rapport, date_evaluation], (err, msg) => {
        if (err) {
            return res.status(500).json({message: "Error creating expertises"}, err)
        }
        return res.status(201).json({message: "Insert Successfull"}, msg)
    })
})

app.put("/updateexpertises/:id", (req, res) => {
    const {sinistre_id, expert, rapport, date_evaluation} = req.body
    const {id} = req.params
    const sql = "UPDATE `expertises` SET `sinistre_id`=?,`expert`=?,`rapport`=?,`date_evaluation`=? WHERE id=?"
    db.query(sql, [sinistre_id, expert, rapport, date_evaluation,  id], (err, msg) => {
        if (err) {
            return res.status(500).json({message: "Error updating expertises"}, err)
        }
        return res.status(201).json({message: "Update Successfull"}, msg)
    })
})

app.delete("/deleteexpertises/:id", (req, res) => {
    const {id} = req.params
    const sql = "DELETE FROM `expertises` WHERE `id`=?"
    db.query(sql, [id], (err, msg) => {
        if (err) {
            return res.status(500).json({message: "Error deleting expertises"}, err)
        }
        return res.status(201).json({message: "deleted Successfully"}, msg)
    })
})

//DOCUMENTS ENDPOINTS

app.get("/viewdocuments", (req,res) => {
    const sql = "SELECT * FROM `documents`"
    db.query(sql, (err, data) => {
        if (err) {
            return res.status(500).json({message: "Error getting info"}, err)
        }

        // convertir contenu_fichier (Buffer) en base64
        const formatted = data.map(doc => ({
            ...doc,
            contenu_fichier: doc.contenu_fichier ? doc.contenu_fichier.toString("base64") : null
        }))

        return res.status(200).json(formatted)
    })
})


app.post("/createdocuments", upload.single("contenu_fichier"), (req, res) => {
  const { sinistre_id, nom_fichier, type_document, date_upload } = req.body
  const contenu_fichier = req.file ? req.file.buffer : null

  const sql =
    "INSERT INTO `documents`(`sinistre_id`, `nom_fichier`, `type_document`, `contenu_fichier`, `date_upload`) VALUES (?,?,?,?,?)"
  db.query(sql, [sinistre_id, nom_fichier, type_document, contenu_fichier, date_upload], (err, msg) => {
    if (err) return res.status(500).json({ message: "Error creating document", error: err })
    return res.status(201).json({ message: "Insert Successful" })
  })
})

app.put("/updatedocuments/:id", upload.single("contenu_fichier"), (req, res) => {
  const { sinistre_id, nom_fichier, type_document, date_upload } = req.body
  const { id } = req.params
  const contenu_fichier = req.file ? req.file.buffer : null

  let sql, values
  if (contenu_fichier) {
    sql =
      "UPDATE `documents` SET `sinistre_id`=?,`nom_fichier`=?,`type_document`=?,`contenu_fichier`=?,`date_upload`=? WHERE id=?"
    values = [sinistre_id, nom_fichier, type_document, contenu_fichier, date_upload, id]
  } else {
    // If no new file uploaded, keep old one
    sql =
      "UPDATE `documents` SET `sinistre_id`=?,`nom_fichier`=?,`type_document`=?,`date_upload`=? WHERE id=?"
    values = [sinistre_id, nom_fichier, type_document, date_upload, id]
  }

  db.query(sql, values, (err, msg) => {
    if (err) return res.status(500).json({ message: "Error updating document", error: err })
    return res.status(200).json({ message: "Update Successful" })
  })
})

app.delete("/deletedocuments/:id", (req, res) => {
  const { id } = req.params
  const sql = "DELETE FROM `documents` WHERE `id`=?"
  db.query(sql, [id], (err, msg) => {
    if (err) return res.status(500).json({ message: "Error deleting document", error: err })
    return res.status(200).json({ message: "Deleted Successfully" })
  })
})

app.get("/download/:id", (req, res) => {
  const { id } = req.params
  const sql = "SELECT nom_fichier, contenu_fichier, type_document FROM documents WHERE id=?"
  db.query(sql, [id], (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).json({ message: "Fichier non trouvé" })
    }

    const doc = results[0]
    res.setHeader("Content-Disposition", `attachment; filename=${doc.nom_fichier}`)
    res.setHeader("Content-Type", doc.type_document || "application/octet-stream")
    res.send(doc.contenu_fichier)
  })
})

//PAIEMENTS ENDPOINTS

app.get("/viewpaiements", (req,res) => {
    const sql = "SELECT * FROM `paiements`"
    db.query(sql, (err, data) => {
        if (err) {
            return res.status(500).json({message: "Error getting info"}, err)
        }
        return res.status(200).json(data)
    })
})

app.post("/createpaiements", (req,res) => {
    const {sinistre_id, montant, date_paiement, méthode, statut} = req.body
    const sql = "INSERT INTO `paiements`(`sinistre_id`, `montant`, `date_paiement`, `méthode`, `statut`) VALUES (?,?,?,?,?)"
    db.query(sql, [sinistre_id, montant, date_paiement, méthode, statut], (err, msg) => {
        if (err) {
            return res.status(500).json({message: "Error creating paiements"}, err)
        }
        return res.status(201).json({message: "Insert Successfull"}, msg)
    })
})

app.put("/updatepaiements/:id", (req, res) => {
    const {sinistre_id, montant, date_paiement, méthode, statut} = req.body
    const {id} = req.params
    const sql = "UPDATE `paiements` SET `sinistre_id`=?,`montant`=?,`date_paiement`=?,`méthode`=?,`statut`=? WHERE id=?"
    db.query(sql, [sinistre_id, montant, date_paiement, méthode, statut,  id], (err, msg) => {
        if (err) {
            return res.status(500).json({message: "Error updating paiements"}, err)
        }
        return res.status(201).json({message: "Update Successfull"}, msg)
    })
})

app.delete("/deletepaiements/:id", (req, res) => {
    const {id} = req.params
    const sql = "DELETE FROM `paiements` WHERE `id`=?"
    db.query(sql, [id], (err, msg) => {
        if (err) {
            return res.status(500).json({message: "Error deleting paiements"}, err)
        }
        return res.status(201).json({message: "deleted Successfully"}, msg)
    })
})

//POLICES ENDPOINTS

app.get("/viewpolices", (req,res) => {
    const sql = "SELECT * FROM `polices`"
    db.query(sql, (err, data) => {
        if (err) {
            return res.status(500).json({message: "Error getting info"}, err)
        }
        return res.status(200).json(data)
    })
})

app.post("/createpolices", (req,res) => {
    const {numero_police, utilisateur_id, type, date_debut, date_fin, statut} = req.body
    const sql = "INSERT INTO `polices`(`numero_police`, `utilisateur_id`, `type`, `date_debut`, `date_fin`, `statut`) VALUES (?,?,?,?,?,?)"
    db.query(sql, [numero_police, utilisateur_id, type, date_debut, date_fin, statut], (err, msg) => {
        if (err) {
            return res.status(500).json({message: "Error creating polices"}, err)
        }
        return res.status(201).json({message: "Insert Successfull"}, msg)
    })
})

app.put("/updatepolices/:id", (req, res) => {
    const {numero_police, utilisateur_id, type, date_debut, date_fin, statut} = req.body
    const {id} = req.params
    const sql = "UPDATE `polices` SET `numero_police`=?,`utilisateur_id`=?,`type`=?,`date_debut`=?,`date_fin`=?,`statut`=? WHERE id=?"
    db.query(sql, [numero_police, utilisateur_id, type, date_debut, date_fin, statut,  id], (err, msg) => {
        if (err) {
            return res.status(500).json({message: "Error updating polices"}, err)
        }
        return res.status(201).json({message: "Update Successfull"}, msg)
    })
})

app.delete("/deletepolices/:id", (req, res) => {
    const {id} = req.params
    const sql = "DELETE FROM `polices` WHERE `id`=?"
    db.query(sql, [id], (err, msg) => {
        if (err) {
            return res.status(500).json({message: "Error deleting polices"}, err)
        }
        return res.status(201).json({message: "deleted Successfully"}, msg)
    })
})

//SINISTRES ENDPOINTS


app.get("/viewsinistres/:userId", (req, res) => {
  const { userId } = req.params

  const sql = "SELECT * FROM sinistres WHERE utilisateur_id = ?"
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching sinistres:", err)
      return res.status(500).json({ error: "Erreur de serveur" })
    }
    res.json(results)
  })
})

app.get("/viewsinistres/:expertId", (req, res) => {
  const { expertId } = req.params

  const sql = "SELECT * FROM sinistres WHERE expert = ?"
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching sinistres:", err)
      return res.status(500).json({ error: "Erreur de serveur" })
    }
    res.json(results)
  })
})

app.get("/viewsinistres", (req,res) => {
    const sql = "SELECT * FROM `sinistres`"
    db.query(sql, (err, data) => {
        if (err) {
            return res.status(500).json({message: "Error getting info"}, err)
        }
        return res.status(200).json(data)
    })
})

app.post("/createsinistres", (req,res) => {
    const {utilisateur_id, police_id, expert, date_declaration, type, description, statut, montant_requis, montant_approuvé} = req.body
    const sql = "INSERT INTO `sinistres`(`utilisateur_id`, `police_id`, `expert`, `date_declaration`, `type`, `description`, `statut`, `montant_requis`, `montant_approuvé`) VALUES (?,?,?,?,?,?,?,?,?)"
    db.query(sql, [utilisateur_id, police_id, expert, date_declaration, type, description, statut, montant_requis, montant_approuvé], (err, msg) => {
        if (err) {
            return res.status(500).json({message: "Error creating sinistres"}, err)
        }
        return res.status(201).json({message: "Insert Successfull"}, msg)
    })
})

app.put("/updatesinistres/:id", (req, res) => {
    const {utilisateur_id, police_id, expert, date_declaration, type, description, statut, montant_requis, montant_approuvé} = req.body
    const {id} = req.params
    const sql = "UPDATE `sinistres` SET `utilisateur_id`=?,`police_id`=?,`expert`=?,`date_declaration`=?,`type`=?,`description`=?,`statut`=?,`montant_requis`=?,`montant_approuvé`=? WHERE id=?"
    db.query(sql, [utilisateur_id, police_id, expert, date_declaration, type, description, statut, montant_requis, montant_approuvé,  id], (err, msg) => {
        if (err) {
            return res.status(500).json({message: "Error updating sinistres"}, err)
        }
        return res.status(201).json({message: "Update Successfull"}, msg)
    })
})

app.delete("/deletesinistres/:id", (req, res) => {
    const {id} = req.params
    const sql = "DELETE FROM `sinistres` WHERE `id`=?"
    db.query(sql, [id], (err, msg) => {
        if (err) {
            return res.status(500).json({message: "Error deleting sinistres"}, err)
        }
        return res.status(201).json({message: "deleted Successfully"}, msg)
    })
})

app.listen(3000, () => {
    console.log("APP running at 3000")
})