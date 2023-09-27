const dbpool = require('../config/dbconfig');
const { v4: uuidv4 } = require('uuid');
const getAllLead = () => {
    const query = 'SELECT * FROM lead where deleted = 1';
    return dbpool.execute(query);
}

const getLeadByID = (id_lead) => {
    const query = `SELECT * FROM lead WHERE id_lead='${id_lead}'`
    return dbpool.execute(query);
}

const updateLead = (id_lead,body) =>{
    const {nama_lead,
        nama_perusahaan,
        alamat_lead,
        nohp_lead,
        email_lead,
        long_lead,
        lat_lead} = body;
    const query = `UPDATE lead SET nama_lead='${nama_lead}',nama_perusahaan='${nama_perusahaan}',alamat_lead='${alamat_lead}',nohp_lead='${nohp_lead}',email_lead='${email_lead}' WHERE id_lead = '${id_lead}'`
    //,long_lead=${long_lead},lat_lead=${lat_lead}
    return dbpool.execute(query);
}

const registerLead = (body) => {
    const {nama_lead,
        nama_perusahaan,
        alamat_lead,
        nohp_lead,
        email_lead,
        id_sales,
        long_lead,
        lat_lead} = body;
        const date = new Date();
        const temp_date = date.getFullYear() + '-' +
            ('00' + (date.getMonth()+1)).slice(-2) + '-' +
            ('00' + date.getDate()).slice(-2) + ' ' +
            ('00' + date.getHours()).slice(-2) + ':' + 
            ('00' + date.getMinutes()).slice(-2) + ':' + 
            ('00' + date.getSeconds()).slice(-2);
    const id_lead = uuidv4();
    const query =   "INSERT INTO `lead` (`id_lead`, `nama_lead`,`nama_perusahaan`, `alamat_lead`, `nohp_lead` ,`email_lead`, `tgl_join_lead`, `id_sales`, `long_lead`, `lat_lead`, `status`, `deleted`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)"
    const data = [
        id_lead,nama_lead,nama_perusahaan,alamat_lead,nohp_lead,email_lead,temp_date,id_sales,long_lead,lat_lead,0,1
    ]
    return dbpool.execute(query,data);
}

const deleteLead= (id_lead) =>{
    const query = `UPDATE lead SET deleted = 0 WHERE id_lead = '${id_lead}' AND deleted = 1`
    return dbpool.execute(query);
}

module.exports = {
    getAllLead, registerLead, getLeadByID, updateLead, deleteLead
}