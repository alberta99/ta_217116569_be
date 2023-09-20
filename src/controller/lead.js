const leadModel = require('../models/lead');
const getAllLead = async (req,res) => {
    try {
        const [data] = await leadModel.getAllLead(); 
        return res.json({
            message : 'Get lead success',
            data : data
        })
    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            serverMessage: error
        })
    }
}

const getLeadByID = async (req,res) => {
    const lead_id = req.params.lead_id;
    try {
        const data = await leadModel.getLeadByID(lead_id);
        const lead = data[0][0]
        if(!lead){
            return res.status(404).json({
                message: "Lead Not Found",
                data: null
            })
        }
        return res.json({
            message : 'Get Lead By ID Sukses',
            data : lead
        })
    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            serverMessage: error
        })
    }
}

const registerLead = async (req,res) => {
    const {body} = req;
    try {
        await leadModel.registerLead(body);
        return res.status(200).json({
            message: "Register Berhasil",
        })
    } catch (error) {
        return res.status(500).json({
            message: "Register gagal",
            serverMessage: error
        })
    }
}

const updateLead = async (req,res) => {    
    try {
        const {body} = req;
        await leadModel.updateLead(
            req.params.lead_id,body
        );
        return res.status(200).json({
            message: "Update Lead Berhasil",
        })
    } catch (error) {
        return res.status(500).json({
            message: "Update Lead gagal",
            serverMessage: error
        })
    }
}

module.exports = {
    getAllLead,
    registerLead,
    updateLead,
    getLeadByID
}