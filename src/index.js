require('dotenv').config();
const PORT = process.env.PORT || 4000;
const express = require('express');

const leadRoutes = require('./routes/lead');

const app = express();

app.use(express.json());

app.use('/lead', leadRoutes);

app.listen(PORT, () =>{
    console.log(`Server running in port ${PORT}`);
})