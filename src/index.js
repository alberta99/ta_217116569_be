const express = require('express');
const mysql = require("mysql2");
const leadRoutes = require('./routes/lead');

const app = express();

app.use(express.json());

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'database_ta'
});

app.use('/lead', leadRoutes);

app.use('/',(req, res) => {
    pool.execute('SELECT * FROM lead', (err, rows) => {
        if(err){
            res.json({
                message: "errorrr"
            })
        }

        res.json({
            message: "sukses",
            data: rows
        })
    })
})

app.listen(3000, () =>{
    console.log("LOCALHOST 3000 running");
})