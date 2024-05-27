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
  var idLocale = require("moment/locale/id");
  moment.locale("id,", idLocale);
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
          tanggal_kunjungan: moment(item.tanggal_kunjungan)
            .locale("id")
            .format("LLLL"),
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

const getJadwalByIDsalesToday = async (req, res) => {
  const id_sales = req.params.id_sales;
  var idLocale = require("moment/locale/id");
  moment.locale("id,", idLocale);
  try {
    const data = await jadwalModel.getJadwalByIDsalesToday(id_sales);
    const jadwal = data[0];
    if (!jadwal) {
      return res.status(404).json({
        message: "Jadwal Tidak Ada",
        data: null,
      });
    }
    return res.json({
      message: "Get Jadwal Today By ID Sales Sukses",
      data: jadwal.map((item) => {
        return {
          ...item,
          tanggal_kunjungan: moment(item.tanggal_kunjungan)
            .locale("id")
            .format("LLLL"),
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

const getJadwalByIDJadwal = async (req, res) => {
  const idjadwal = req.params.idjadwal;
  try {
    const data = await jadwalModel.getJadwalByIDJadwal(idjadwal);
    const jadwal = data[0][0];
    if (!jadwal) {
      return res.status(404).json({
        message: "Jadwal Not Found",
        data: null,
      });
    }
    return res.json({
      message: "Get Jadwal By ID Jadwal Sukses",
      data: data[0][0],
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      serverMessage: error,
    });
  }
};

const getJadwalByTanggalidSales = async (req, res) => {
  var idLocale = require("moment/locale/id");
  moment.locale("id,", idLocale);
  const id_sales = req.params.id_sales;
  const tanggal = req.params.tanggal;
  try {
    const data = await jadwalModel.getJadwalByTanggalidSales(id_sales, tanggal);
    const jadwal = data[0];
    if (!jadwal) {
      return res.status(404).json({
        message: "Jadwal Tidak Ada",
        data: null,
      });
    }
    return res.json({
      message: "Get Jadwal By Tanggal Sukses",
      data: jadwal.map((item) => {
        return {
          ...item,
          tanggal_kunjungan: moment(item.tanggal_kunjungan)
            .locale("id")
            .format("LLLL"),
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
  getJadwalByIDJadwal,
  getJadwalByTanggalidSales,
  getJadwalByIDsalesToday,
};
