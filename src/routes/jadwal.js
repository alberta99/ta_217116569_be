const express = require("express");

const jadwalController = require("../controller/jadwal");
const router = express.Router();

router.post("/", jadwalController.insertJadwal);
router.get("/:id_sales", jadwalController.getJadwalByIDsales);
router.get("/byidjadwal/:idjadwal", jadwalController.getJadwalByIDJadwal);
router.get(
  "/tanggalidsales/:id_sales/:tanggal",
  jadwalController.getJadwalByTanggalidSales
);
router.get("/gettoday/:id_sales", jadwalController.getJadwalByIDsalesToday);

module.exports = router;
