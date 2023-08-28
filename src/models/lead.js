const dbpool = require('../config/dbconfig');
const { v4: uuidv4 } = require('uuid');
const getAllLead = () => {
    const query = 'SELECT * FROM lead';
    return dbpool.execute(query);
}

const registerLead = (body) => {
    const {nama_lead,
        alamat_lead,
        nohp_lead,
        email_lead,
        id_sales,
        long_lead,
        lat_lead} = body;
    const id_lead = uuidv4();
    const query =   "INSERT INTO `lead` (`id_lead`, `nama_lead`, `alamat_lead`, `nohp_lead`,`email_lead`, `id_sales`, `long_lead`, `lat_lead`) VALUES (?,?,?,?,?,?,?,?)"
    const data = [
        id_lead,nama_lead,alamat_lead,nohp_lead,email_lead,id_sales,long_lead,lat_lead
    ]
    return dbpool.execute(query,data);
}

module.exports = {
    getAllLead, registerLead
}