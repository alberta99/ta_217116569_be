const leadModel = require("../models/lead");
var moment = require("moment");

const getAllLead = async (req, res) => {
  try {
    const [data] = await leadModel.getAllLead();
    return res.json({
      message: "Get lead success",
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      serverMessage: error,
    });
  }
};

const getLeadByID = async (req, res) => {
  const lead_id = req.params.lead_id;
  try {
    const [data] = await leadModel.getLeadByID(lead_id);
    return res.json({
      message: "Get Lead By ID Sukses",
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      serverMessage: error,
    });
  }
};

const getLeadByIDsales = async (req, res) => {
  const sales_id = req.params.sales_id;
  try {
    const [data] = await leadModel.getLeadByIDsales(sales_id);
    return res.json({
      message: "Get Lead By ID Sales Sukses",
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      serverMessage: error,
    });
  }
};

const registerLead = async (req, res) => {
  const { body } = req;
  try {
    await leadModel.registerLead(body);
    return res.status(200).json({
      message: "Register Berhasil",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Register gagal",
      serverMessage: error,
    });
  }
};

const updateLead = async (req, res) => {
  try {
    const { body } = req;
    await leadModel.updateLead(req.params.lead_id, body);
    return res.status(200).json({
      message: "Update Lead Berhasil",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Update Lead gagal",
      serverMessage: error,
    });
  }
};

const deleteLead = async (req, res) => {
  try {
    const lead_id = req.params.lead_id;
    await leadModel.deleteLead(lead_id);

    return res.json({
      message: "Delete Lead Sukses",
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      serverMessage: error,
    });
  }
};

module.exports = {
  getAllLead,
  registerLead,
  updateLead,
  getLeadByID,
  deleteLead,
  getLeadByIDsales,
};
