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
    // Upload each image to Cloudinary and update the body object
    const uploadAndUpdateImage = async (fieldName) => {
      const result = await cloudinary.uploader.upload(
        req.files[fieldName][0].path
      );
      body[`${fieldName}_barang`] = result.secure_url;
      console.log(fieldName);
    };

    await Promise.all([
      uploadAndUpdateImage("gambar_1"),
      uploadAndUpdateImage("gambar_2"),
      uploadAndUpdateImage("gambar_3"),
    ]);

    await barangModel.insertBarang(body);

    res.status(200).json({
      message: "Insert Barang Berhasil",
    });
  } catch (error) {
    res.status(400).json({
      message: "Insert Barang gagal",
      serverMessage: error.message,
    });
  }
};

const updateBarang = async (req, res) => {
  try {
    const { body } = req;
    const productId = req.params.product_id;

    // Upload and update image URLs
    const uploadAndUpdateImage = async (fieldName) => {
      if (req.files[fieldName]) {
        const result = await cloudinary.uploader.upload(
          req.files[fieldName][0].path
        );
        body[`${fieldName}_barang`] = result.secure_url;
      } else {
        body[`${fieldName}_barang`] = "";
      }
    };

    await Promise.all([
      uploadAndUpdateImage("gambar_1"),
      uploadAndUpdateImage("gambar_2"),
      uploadAndUpdateImage("gambar_3"),
    ]);

    // Update barang in the database
    await barangModel.updateBarang(productId, body);

    res.status(200).json({
      message: "Update Barang Berhasil",
    });
  } catch (error) {
    console.error("Error updating barang:", error);
    res.status(400).json({
      message: "Update Barang gagal",
      serverMessage: error.message,
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
};
