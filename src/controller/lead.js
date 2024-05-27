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
      serverMessage: error.message,
    });
  }
};

const countLeadByidSales = async (req, res) => {
  const id_sales = req.params.id_sales;
  try {
    const [data] = await leadModel.countLeadByidSales(id_sales);
    return res.json({
      message: "Get Count lead success",
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      serverMessage: error.message,
    });
  }
};

const loginLead = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    const lead = await leadModel.loginLead(email, password);
    const data = lead[0][0];
    if (!data) {
      return res.status(400).json({
        message: "Login Gagal",
      });
    }
    return res.json({
      message: "Login Berhasil",
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Login Error",
      serverMessage: error,
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const { body } = req;
    await leadModel.changePassword(req.params.id_lead, body);
    return res.status(200).json({
      message: "Ganti Password Berhasil",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Ganti Password gagal",
      serverMessage: error.message,
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
      serverMessage: error.message,
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
      serverMessage: error.message,
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
      serverMessage: error.message,
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
      serverMessage: error.message,
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
      serverMessage: error.message,
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
  changePassword,
  loginLead,
  countLeadByidSales,
};
