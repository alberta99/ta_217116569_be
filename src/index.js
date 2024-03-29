require("dotenv").config();
const PORT = process.env.PORT || 4000;
const express = require("express");
const cors = require("cors");
// const fileUpload = require("express-fileupload");
const leadRoutes = require("./routes/lead");
const barangRoutes = require("./routes/barang");
const salesRoutes = require("./routes/salesperson");
const orderRoutes = require("./routes/order");
const jadwalRoutes = require("./routes/jadwal");
const laporanRoutes = require("./routes/laporan");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use(
//     fileUpload({
//       useTempFiles: true,
//       tempFileDir: "/tmp/",
//     })
// );
app.use(express.json());
app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  next();
});

app.get("/", (req, res) => {
  return res.json("Hai");
});
app.use("/lead", leadRoutes);
app.use("/barang", barangRoutes);
app.use("/salesperson", salesRoutes);
app.use("/order", orderRoutes);
app.use("/jadwal", jadwalRoutes);
app.use("/laporan", laporanRoutes);

app.listen(PORT, () => {
  console.log(`Server running in port ${PORT}`);
});
