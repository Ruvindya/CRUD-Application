import express from 'express';
import mysql from "mysql";
import cors from "cors";
import multer from 'multer';
import path from 'path';

const app = express();
app.use(express.json());
app.use(cors());

const storage = multer.diskStorage({
    destination: './src/profilePicture',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
});
    

const upload = multer({
    storage: storage
});

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"root",
    database:"crud_application"
})


app.get("/", (req, res)=>{
    res.json("Hello this is backend")
})

app.get("/customers", (req,res)=>{
    const q = "SELECT * FROM customer"
    db.query(q,(err,data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
})

app.get("/customers/:id", (req,res)=>{
    const customerID = req.params.id;
    const q = "SELECT * FROM customer WHERE id = ?"
    db.query(q,[customerID],(err,data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
})

app.post("/customer",upload.single('profilePicture') , (req,res)=>{
    const q = "INSERT INTO customer (`firstName`, `lastName`, `age`,`address`,`description`,`profilePicture`) VALUES (?)";
    const values = [
        req.body.firstName,
        req.body.lastName,
        req.body.age,
        req.body.address,
        req.body.description,
        req.file.fieldname
    ];

    db.query(q,[values], (err, data)=> {
        if (err) return res.json(err);
        return res.json(data);
    });
});


app.delete("/customer/:id", (req,res)=>{
    const customerID = req.params.id;
    const q = "DELETE FROM customer WHERE id = ?";

    db.query(q,[customerID], (err,data)=>{
        if (err) return res.json(err);
        return res.json("customer data deleted successfully");
    });
});

app.put("/customer/:id", (req,res)=>{
    const customerID = req.params.id;
    const q = "UPDATE customer SET `firstName` = ?, `lastName` = ?, `age` = ?,`address` = ?,`description` = ?,`profilePicture` = ? WHERE id = ?";

    const values = [
        req.body.firstName,
        req.body.lastName,
        req.body.age,
        req.body.address,
        req.body.description,
        req.body.profilePicture,
    ]

    db.query(q,[...values, customerID], (err,data)=>{
        if (err) return res.json(err);
        return res.json("customer data updated successfully");
    });
});

app.listen(8800, ()=>{
    console.log("Connected to backend on PORT 8800!")
})