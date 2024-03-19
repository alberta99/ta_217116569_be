const barangModel = require("../models/barang");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const getAllBarang = async (req, res) => {
  try {
    const [data] = await barangModel.getAllBarang();

    return res.json({
      message: "Get All Barang Sukses",
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      serverMessage: error,
    });
  }
};

const cekBarangkembar = async (req, res) => {
  try {
    const { body } = req;
    const data = await barangModel.cekBarangkembar(body);
    return res.json({
      message: "Cek Barang Kembar Sukses",
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      serverMessage: error,
    });
  }
};

const getBarangByID = async (req, res) => {
  const product_id = req.params.product_id;
  try {
    const data = await barangModel.getBarangByID(product_id);
    const product = data[0][0];
    if (!product) {
      return res.status(404).json({
        message: "Product Not Found",
        data: null,
      });
    }
    return res.json({
      message: "Get Barang By ID Sukses",
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      serverMessage: error,
    });
  }
};

const insertBarang = async (req, res) => {
  try {
    const { body } = req;
    if (req.files["gambar_1"]) {
      var result = await cloudinary.uploader.upload(
        req.files["gambar_1"][0].path
      );
      body["gambar1_barang"] = result.secure_url;
    }
    if (req.files["gambar_2"]) {
      var result = await cloudinary.uploader.upload(
        req.files["gambar_2"][0].path
      );
      body["gambar2_barang"] = result.secure_url;
    }
    if (req.files["gambar_3"]) {
      var result = await cloudinary.uploader.upload(
        req.files["gambar_3"][0].path
      );
      body["gambar3_barang"] = result.secure_url;
    }
    await barangModel.insertBarang(body);
    return res.status(200).json({
      message: "Insert Barang Berhasil",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Insert Barang gagal",
      serverMessage: error,
    });
  }
};

const updateBarang = async (req, res) => {
  try {
    const { body } = req;
    if (req.files["gambar_1"]) {
      var result = await cloudinary.uploader.upload(
        req.files["gambar_1"][0].path
      );
      body["gambar1_barang"] = result.secure_url;
    } else {
      body["gambar1_barang"] = "";
    }
    if (req.files["gambar_2"]) {
      var result = await cloudinary.uploader.upload(
        req.files["gambar_2"][0].path
      );
      body["gambar2_barang"] = result.secure_url;
    } else {
      body["gambar2_barang"] = "";
    }
    if (req.files["gambar_3"]) {
      var result = await cloudinary.uploader.upload(
        req.files["gambar_3"][0].path
      );
      console.log(result);
      body["gambar3_barang"] = result.secure_url;
    } else {
      body["gambar3_barang"] = "";
    }
    await barangModel.updateBarang(req.params.product_id, body);
    return res.status(200).json({
      message: "Update Barang Berhasil",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Update Barang gagal",
      serverMessage: error,
    });
  }
};

const deleteBarang = async (req, res) => {
  try {
    const product_id = req.params.product_id;
    await barangModel.deleteBarang(product_id);

    return res.json({
      message: "Delete Barang Sukses",
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
  getAllBarang,
  insertBarang,
  getBarangByID,
  updateBarang,
  deleteBarang,
  cekBarangkembar,
};
