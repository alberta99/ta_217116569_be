const express = require("express");

const OrderController = require("../controller/order");

const router = express.Router();

router.get("/sum", OrderController.getAllOrder_Sum);
router.get("/det", OrderController.getAllOrder_detail);

router.post("/sum", OrderController.inputOrderSummary);

router.post("/daftarpesanan", OrderController.daftarPesanan);

router.get(
  "/daftarpesanansales/:id_sales/:id_lead",
  OrderController.getDaftarpesanan_idsales
);

router.get("/orderidsales/:id_sales", OrderController.getAllOrder_idsales);

router.post("/updatecart", OrderController.updateCart);

router.get(
  "/cekdaftarpesanan/:id_sales/:id_lead",
  OrderController.cekDaftarPesanan
);

router.delete("/deleteall/:id_lead", OrderController.DeleteAllCart);

router.delete(
  "/deletedetailcart/:id_cart/:id_cart_detail",
  OrderController.deleteDetailCart
);

router.get("/count/:id_sales", OrderController.countDaftarpesanan);
router.get("/countselesai/:id_sales", OrderController.countPesananSelesai);
router.get(
  "/countterproses/:id_sales/:tgl_start/:tgl_end",
  OrderController.countPesananTerproses
);
router.get(
  "/countperhari/:id_sales/:tgl_start/:tgl_end",
  OrderController.countOrderperhari
);

router.put("/minusqty/:id_cart/:id_cart_detail", OrderController.cartMinus);
router.put("/plusqty/:id_cart/:id_cart_detail", OrderController.cartPlus);
router.get("/detailorder/:id_order", OrderController.getOrder_detail);
router.get("/ordersumbyid/:id_order", OrderController.getOrderSum_by_idOrder);

router.get("/orderbyidlead/:id_lead", OrderController.getOrder_byIdLead);

router.put("/updatestatus/:id_order", OrderController.updateStatus);

module.exports = router;
