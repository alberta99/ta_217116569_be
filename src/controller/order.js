const orderModel = require("../models/order");

const getAllOrder_detail = async (req, res) => {
  try {
    const [data] = await orderModel.getAllOrder_detail();
    return res.json({
      message: "Get Order Detail success",
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      serverMessage: error,
    });
  }
};

const updateStatus = async (req, res) => {
  try {
    const id_order = req.params.id_order;
    const [data] = await orderModel.updateStatus(id_order);
    return res.json({
      message: "Update status success",
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      serverMessage: error,
    });
  }
};

const getOrder_detail = async (req, res) => {
  const id_order = req.params.id_order;
  try {
    const [data] = await orderModel.getOrder_detail(id_order);
    return res.json({
      message: "Get Order Detail success",
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      serverMessage: error,
    });
  }
};

const getOrderSum_by_idOrder = async (req, res) => {
  const id_order = req.params.id_order;
  try {
    const data = await orderModel.getOrderSum_by_idOrder(id_order);
    return res.json({
      message: "Get Order Summary success",
      data: data[0][0],
    });
  } catch (error) {
    return res.status(404).json({
      message: "Server error",
      serverMessage: error,
    });
  }
};

const getAllOrder_idsales = async (req, res) => {
  const id_sales = req.params.id_sales;
  try {
    const [data] = await orderModel.getAllOrder_idsales(id_sales);
    return res.json({
      message: "Get Order By ID Sales success",
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      serverMessage: error,
    });
  }
};

const getOrder_byIdLead = async (req, res) => {
  const id_lead = req.params.id_lead;
  try {
    const [data] = await orderModel.getOrder_byIdLead(id_lead);
    return res.json({
      message: "Get Order By ID Lead success",
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      serverMessage: error.message,
    });
  }
};

const getAllOrder_Sum = async (req, res) => {
  try {
    const [data] = await orderModel.getAllOrder_sum();
    return res.json({
      message: "Get Order Detail success",
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      serverMessage: error,
    });
  }
};

const inputOrderSummary = async (req, res) => {
  const { body } = req;
  try {
    await orderModel.inputOrderSummary(body);
    return res.status(200).json({
      message: "Order Berhasil",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Input order gagal",
      serverMessage: error,
    });
  }
};

const countDaftarpesanan = async (req, res) => {
  try {
    const id_sales = req.params.id_sales;
    const data = await orderModel.countDaftarpesanan(id_sales);
    return res.json({
      message: "Get Cart Count Sukses",
      data: data[0][0],
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      serverMessage: error,
    });
  }
};

const countPesananTerproses = async (req, res) => {
  try {
    const id_sales = req.params.id_sales;
    const tgl_start = req.params.tgl_start;
    const tgl_end = req.params.tgl_end;
    const data = await orderModel.countPesananTerproses(
      id_sales,
      tgl_start,
      tgl_end
    );
    return res.json({
      message: "Get count pesanan terproses sukses",
      data: data[0][0],
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      serverMessage: error,
    });
  }
};

const countPesananSelesai = async (req, res) => {
  try {
    const id_sales = req.params.id_sales;
    const data = await orderModel.countPesananSelesai(id_sales);
    return res.json({
      message: "Get count pesanan selesai sukses",
      data: data[0][0],
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      serverMessage: error,
    });
  }
};

const countOrderperhari = async (req, res) => {
  try {
    const id_sales = req.params.id_sales;
    const tgl_start = req.params.tgl_start;
    const tgl_end = req.params.tgl_end;
    const [data] = await orderModel.countOrderperhari(
      id_sales,
      tgl_start,
      tgl_end
    );
    return res.json({
      message: "Get count order per hari selesai sukses",
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      serverMessage: error,
    });
  }
};

const daftarPesanan = async (req, res) => {
  const { body } = req;
  try {
    await orderModel.daftarPesanan(body);
    return res.status(200).json({
      message: "Add ke daftar pesanan berhasil",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Input ke daftar pesanan gagal",
      serverMessage: error,
    });
  }
};

const getDaftarpesanan_idsales = async (req, res) => {
  const id_sales = req.params.id_sales;
  const id_lead = req.params.id_lead;
  try {
    const [data] = await orderModel.getDaftarpesanan_idsales(id_sales, id_lead);

    let details = [];
    data.forEach((element) => {
      detail = {
        id_cart: element.id_cart,
        id_cart_detail: element.id_cart_detail,
        id_barang: element.id_barang,
        nama_barang: element.nama_barang,
        harga_barang: element.harga_barang,
        qty_barang: element.qty_barang,
        sub_total: element.sub_total,
        gambar1_barang: element.gambar1_barang,
      };
      details.push(detail);
    });

    return res.json({
      message: "Get Daftar Pesanan by ID sales success",
      data: {
        id_cart: data[0].id_cart,
        id_sales: data[0].id_sales,
        id_lead: data[0].id_lead,
        qty_total: data[0].qty_total,
        harga_total: data[0].harga_total,
        detail: details,
      },
    });
  } catch (error) {
    return res.status(403).json({
      message: "Server error",
      serverMessage: error.message,
    });
  }
};

const updateCart = async (req, res) => {
  const { body } = req;
  try {
    await orderModel.updateCart(body);
    return res.status(200).json({
      message: "Update daftar pesanan berhasil",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Update daftar pesanan gagal",
      serverMessage: error,
    });
  }
};

const cekDaftarPesanan = async (req, res) => {
  const id_sales = req.params.id_sales;
  const id_lead = req.params.id_lead;
  try {
    await orderModel.cekDaftarPesanan(id_sales, id_lead);
    return res.status(200).json({
      message: "Cek daftar pesanan berhasil",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Cek daftar pesanan gagal",
      serverMessage: error,
    });
  }
};

const DeleteAllCart = async (req, res) => {
  const id_lead = req.params.id_lead;
  try {
    await orderModel.DeleteAllCart(id_lead);
    return res.status(200).json({
      message: "Delete pesanan berhasil",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Delete pesanan gagal",
      serverMessage: error,
    });
  }
};

const deleteDetailCart = async (req, res) => {
  const id_cart = req.params.id_cart;
  const id_cart_detail = req.params.id_cart_detail;
  try {
    await orderModel.deleteDetailCart(id_cart, id_cart_detail);
    return res.status(200).json({
      message: "Delete detail pesanan berhasil",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Delete detail pesanan gagal",
      serverMessage: error,
    });
  }
};

const cartMinus = async (req, res) => {
  const id_cart = req.params.id_cart;
  const id_cart_detail = req.params.id_cart_detail;
  try {
    await orderModel.cartMinus(id_cart, id_cart_detail);
    return res.status(200).json({
      message: "-1 pesanan berhasil",
    });
  } catch (error) {
    return res.status(500).json({
      message: "-1 pesanan gagal",
      serverMessage: error,
    });
  }
};

const cartPlus = async (req, res) => {
  const id_cart = req.params.id_cart;
  const id_cart_detail = req.params.id_cart_detail;
  try {
    await orderModel.cartPlus(id_cart, id_cart_detail);
    return res.status(200).json({
      message: "+1 pesanan berhasil",
    });
  } catch (error) {
    return res.status(500).json({
      message: "+1 pesanan gagal",
      serverMessage: error,
    });
  }
};
module.exports = {
  inputOrderSummary,
  getAllOrder_Sum,
  getAllOrder_detail,
  daftarPesanan,
  getDaftarpesanan_idsales,
  updateCart,
  cekDaftarPesanan,
  DeleteAllCart,
  deleteDetailCart,
  getAllOrder_idsales,
  cartMinus,
  cartPlus,
  getOrder_detail,
  getOrderSum_by_idOrder,
  countDaftarpesanan,
  countPesananSelesai,
  countPesananTerproses,
  countOrderperhari,
  getOrder_byIdLead,
  updateStatus,
};
