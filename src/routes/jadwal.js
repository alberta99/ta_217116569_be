const express = require("express");

const jadwalController = require("../controller/jadwal");
const router = express.Router();

router.post("/", jadwalController.insertJadwal);
router.get("/:id_sales", jadwalController.getJadwalByIDsales);

module.exports = router;
