import express from 'express';
import mysql from "mysql";
import cors from "cors";
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const app = express();
app.use(express.json());
app.use(cors());
// app.use(express.static('public'));
app.use('/images', express.static('public/images'));


// const storage = multer.diskStorage({
//     destination: 'public/profilePicture',
//     filename: (req, file, cb) => {
//         return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
//     }
// });

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        const uniqueIdentifier = uuidv4(); // Generate a unique identifier
        cb(null, file.fieldname + "_" + uniqueIdentifier + Date.now() + path.extname(file.originalname));
    },
});


// const storage = multer.diskStorage({
//     destination: (req, file, cd) => {
//         cd(null, 'public/images');
//     },
//     filename: (req, file, cb) => {
//         const sanitizedPath = file.destination.replace(/\\/g, '/');
//         const sanitizedFilename = file.fieldname + "_" + path.extname(file.originalname);
//         cb(null, sanitizedPath + '/' + sanitizedFilename);
//     },
// });

// const storage = multer.diskStorage({
//     filename: (req, file, cb) => {
//         const fullPath = path.join('public/images', file.fieldname + "_" + Date.now() + path.extname(file.originalname));
//         console.log('Generated fullPath:', fullPath);
//         cb(null, fullPath);
//     },
// });


//storage is the object which stores everything like,
// name of file, handling duplicates of files
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

// app.get("/customers", (req,res)=>{
//     const q = "SELECT * FROM customer"
//     db.query(q,(err,data)=>{
//         if(err) return res.json(err)
//         return res.json(data)
//     })
// })

app.get("/customers", (req, res) => {
    const q = "SELECT *, CONCAT('http://localhost:8800/images/', profilePicture) as imagePath FROM customer";
    db.query(q, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});


app.get("/customers/:id", (req,res)=>{
    const customerID = req.params.id;
    const q = "SELECT * FROM customer WHERE id = ?"
    db.query(q,[customerID],(err,data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
})

app.post("/customer",upload.single('profilePicture') , (req,res)=>{
    console.log("req.file ===>")
    console.log(req.file);
    const q = "INSERT INTO customer (`firstName`, `lastName`, `age`,`address`,`description`,`profilePicture`) VALUES (?)";
    const values = [
        req.body.firstName,
        req.body.lastName,
        req.body.age,
        req.body.address,
        req.body.description,
        req.file.filename
    ];

    db.query(q,[values], (err, data)=> {
        console.log("data to db ===>")
        console.log(data);
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

app.put("/customer/:id",upload.single('profilePicture') , (req,res)=>{
    const customerID = req.params.id;
    const q = "UPDATE customer SET `firstName` = ?, `lastName` = ?, `age` = ?,`address` = ?,`description` = ?,`profilePicture` = ? WHERE id = ?";

    const values = [
        req.body.firstName,
        req.body.lastName,
        req.body.age,
        req.body.address,
        req.body.description,
        req.file.filename
    ]

    db.query(q,[...values, customerID], (err,data)=>{
        if (err) return res.json(err);
        return res.json("customer data updated successfully");
    });
});



app.listen(8800, ()=>{
    console.log("Connected to backend on PORT 8800!")
})