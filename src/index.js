require('dotenv').config();
const PORT = process.env.PORT || 4000;
const express = require('express');

const leadRoutes = require('./routes/lead');
const barangRoutes = require('./routes/barang');
const salesRoutes = require('./routes/salesperson');

const app = express();

app.use(express.json());

app.use('/lead', leadRoutes);
app.use('/barang',barangRoutes);
app.use('/salesperson',salesRoutes);

app.listen(PORT, () =>{
    console.log(`Server running in port ${PORT}`);
});