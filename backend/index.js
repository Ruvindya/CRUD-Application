import express from 'express';
import mysql from "mysql";

const app = express()
const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"root",
    database:"crud_application"
})

app.use(express.json())

app.get("/", (req, res)=>{
    res.json("Hello this is backend")
})
app.get("/customer", (req,res)=>{
    const q = "SELECT * FROM customer"
    db.query(q,(err,data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
})

app.post("/customer",(req,res)=>{
    const q = "INSERT INTO customer (`firstName`, `lastName`, `age`,`address`,`description`,`profilePicture`) VALUES (?)";
    const values = [
        req.body.firstName,
        req.body.lastName,
        req.body.age,
        req.body.address,
        req.body.description,
        req.body.profilePicture
    ];

    db.query(q,[values], (err, data)=> {
        if (err) return res.json(err);
        return res.json("customer data entered successfully");
    });
});

app.listen(8800, ()=>{
    console.log("Connected to backend server!")
})