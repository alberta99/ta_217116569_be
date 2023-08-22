const leadModel = require('../models/lead');
const getAllLead = async (req,res) => {
    try {
        const [data] = await leadModel.getAllLead();
        
        res.json({
            message : 'Get lead success',
            data : data
        })
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            serverMessage: error
        })
    }
    
}

const registerLead = async (req,res) => {
    const {body} = req;
    try {
        await leadModel.registerLead(body);
        res.status(200).json({
            message: "Register Berhasil",
        })
    } catch (error) {
        res.status(500).json({
            message: "Register gagal",
            serverMessage: error
        })
    }
    
}
module.exports = {
    getAllLead,
    registerLead
}