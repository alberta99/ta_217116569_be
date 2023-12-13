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

router.put("/minusqty/:id_cart/:id_cart_detail", OrderController.cartMinus);
router.put("/plusqty/:id_cart/:id_cart_detail", OrderController.cartPlus);

module.exports = router;
