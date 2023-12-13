const jadwalModel = require("../models/jadwal");
var moment = require("moment");

const insertJadwal = async (req, res) => {
  try {
    const { body } = req;
    await jadwalModel.insertJadwal(body);
    return res.status(200).json({
      message: "Insert Jadwal Berhasil",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Insert Jadwal gagal",
      serverMessage: error,
    });
  }
};

const getJadwalByIDsales = async (req, res) => {
  const id_sales = req.params.id_sales;
  try {
    const data = await jadwalModel.getJadwalByIDsales(id_sales);
    const jadwal = data[0];
    if (!jadwal) {
      return res.status(404).json({
        message: "Jadwal Tidak Ada",
        data: null,
      });
    }
    return res.json({
      message: "Get Jadwal By ID Sales Sukses",
      data: jadwal.map((item) => {
        return {
          ...item,
          tanggal_kunjungan: moment(item.tanggal_kunjungan).format("LLLL"),
        };
      }),
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
      serverMessage: error,
    });
  }
};

module.exports = {
  insertJadwal,
  getJadwalByIDsales,
};
