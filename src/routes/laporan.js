const express = require("express");

const laporanController = require("../controller/laporan");

const router = express.Router();

//Get All Sales
router.get("/laporanleadmasuk", laporanController.getLaporanLeadMasuk);

router.get("/allsales", laporanController.getAllSales);

router.get("/allorder", laporanController.getAllOrder);
router.get(
  "/allorderbytgl/:tanggal_start/:tanggal_end",
  laporanController.getAllOrderByTanggal
);

router.get("/conversionrate", laporanController.getConversionRate);
router.get(
  "/conversionratebysales",
  laporanController.getConversionRateBySales
);

module.exports = router;
