const dbpool = require("../config/dbconfig");
const { v4: uuidv4 } = require("uuid");

const getAllOrder_sum = () => {
  const query = "SELECT * FROM order_sum";
  return dbpool.execute(query);
};

const getAllOrder_detail = () => {
  const query = "SELECT * FROM order_detail";
  return dbpool.execute(query);
};

const getOrderSum_by_idOrder = (id_order) => {
  const query = `SELECT id_order, tanggal_order, tanggal_kirim, alamat_kirim, id_sales, id_lead, qty_total, total_order, ket_order FROM order_sum WHERE id_order='${id_order}'`;
  return dbpool.execute(query);
};

const getAllOrder_idsales = (id_sales) => {
  const query = `SELECT os.id_order,os.tanggal_order,os.tanggal_kirim,os.alamat_kirim,os.id_sales,os.id_lead,os.qty_total,os.total_order,os.ket_order,l.nama_lead,l.nama_perusahaan FROM freedb_database_ta.order_sum os JOIN freedb_database_ta.lead l ON l.id_lead = os.id_lead WHERE os.id_sales='${id_sales}'`;
  return dbpool.execute(query);
};

const getOrder_detail = (id_order) => {
  const query = `SELECT id_order_detail, id_order, id_barang, nama_barang, harga_barang_order, harga_diskon, qty_barang, sub_total, catatan_order FROM order_detail WHERE id_order = '${id_order}'`;
  return dbpool.execute(query);
};

async function generateOrderNumber() {
  let query = `SELECT COUNT(*) as orderCount FROM order_sum where date(tanggal_order) = CURRENT_DATE`;
  return dbpool.execute(query);
}

function paddingCount(angka, panjang) {
  return String(angka).padStart(panjang, "0");
}

const inputOrderSummary = async (body) => {
  const id_order_temp = await generateOrderNumber();
  const count = id_order_temp[0][0].orderCount;
  const connection = await dbpool.getConnection();
  try {
    await connection.beginTransaction();
    const {
      id_sales,
      id_lead,
      tanggal_kirim,
      alamat_kirim,
      ket_order,
      harga_total,
      qty_total,
    } = body;
    const date = new Date();
    const temp_date =
      date.getFullYear() +
      "-" +
      ("00" + (date.getMonth() + 1)).slice(-2) +
      "-" +
      ("00" + date.getDate()).slice(-2) +
      "-" +
      ("00" + date.getHours()).slice(-2) +
      ":" +
      ("00" + date.getMinutes()).slice(-2) +
      ":" +
      ("00" + date.getSeconds()).slice(-2);
    const id_order = `INV-${("00" + date.getDate()).slice(-2)}${(
      "00" +
      (date.getMonth() + 1)
    ).slice(-2)}${date.getFullYear()}-${paddingCount(count + 1, 4)}`;
    //tanggal kirim
    const date2 = new Date(tanggal_kirim);
    const tgl_kirim =
      date2.getFullYear() +
      "-" +
      ("00" + (date2.getMonth() + 1)).slice(-2) +
      "-" +
      ("00" + date2.getDate()).slice(-2);
    //details
    const query1 =
      "INSERT INTO `order_sum`(`id_order`, `tanggal_order`,`tanggal_kirim`,`alamat_kirim`, `id_sales`, `id_lead`, qty_total ,total_order, `ket_order`) VALUES (?,?,?,?,?,?,?,?,?)";
    const result1 = await connection.query(query1, [
      id_order,
      temp_date,
      tgl_kirim,
      alamat_kirim,
      id_sales,
      id_lead,
      qty_total,
      harga_total,
      ket_order == null ? "" : ket_order,
    ]);
    //"INSERT INTO `order_sum`(`id_order`, `tanggal_order`,`tanggal_kirim`, `id_sales`, `id_lead`, qty_total ,total_order, `ket_order`)
    //VALUES              ('INV/07112023/0001','2023-11-07-22:34:28','NaN-aN-aN','15490a2e-7764-421a-a10a-ac1d7f786911','8637aa66-69be-4c6f-b92a-0f26f8407894',14,1766,NULL)"
    const order_details = body.detail.map((item) => {
      return [
        uuidv4(),
        id_order,
        item.id_barang,
        item.nama_barang,
        item.harga_barang,
        item.harga_diskon == null ? 0 : item.harga_diskon,
        item.qty_barang,
        item.sub_total - (item.harga_diskon == null ? 0 : item.harga_diskon),
        item.catatan_order == null ? "" : item.catatan_order,
      ];
    });
    const query2 =
      "INSERT INTO `order_detail`(`id_order_detail`, `id_order`, `id_barang`, `nama_barang`, harga_barang_order, harga_diskon, qty_barang, sub_total, `catatan_order`) VALUES ?";
    const result2 = await connection.query(query2, [order_details]);
    const query3 = `UPDATE lead set status=1 where id_lead='${id_lead}'`;
    await connection.query(query3);
    await connection.commit();
    return [result1, result2];
  } catch (error) {
    await connection.rollback();
    dbpool.releaseConnection();
    console.log(error);
    return error;
  }
};

const daftarPesanan = async (body) => {
  const connection = await dbpool.getConnection();
  try {
    await connection.beginTransaction();
    const { id_sales, id_lead, status } = body;
    const id_cart = uuidv4();
    let total = 0;
    let qty_temp = 0;
    const daftarpesanan_details = body.detail.map((item) => {
      const sub_total = item.qty_barang * item.harga_barang;
      total += sub_total;
      qty_temp += item.qty_barang;
      return [
        uuidv4(),
        id_cart,
        item.id_barang,
        item.nama_barang,
        item.harga_barang,
        item.qty_barang,
        sub_total,
      ];
    });
    const query1 =
      "INSERT INTO `daftarpesanan`(`id_cart`, `id_sales`,`id_lead`, qty_total, harga_total, status) VALUES (?,?,?,?,?,?)";
    const result1 = await connection.query(query1, [
      id_cart,
      id_sales,
      id_lead,
      qty_temp,
      total,
      status,
    ]);
    const query2 =
      "INSERT INTO `daftarpesanan_detail`(`id_cart_detail`, `id_cart`, `id_barang`, `nama_barang`, harga_barang, qty_barang, sub_total) VALUES ?";
    const result2 = await connection.query(query2, [daftarpesanan_details]);
    await connection.commit();
    return [result1, result2];
  } catch (error) {
    await connection.rollback();
    dbpool.releaseConnection();
    return error;
  }
};

const getDaftarpesanan_idsales = (id_sales, id_lead) => {
  const query = `SELECT dp.id_cart,dp.id_sales,dp.id_lead,dp.qty_total,dp.harga_total,dpd.id_cart_detail,dpd.id_barang,dpd.nama_barang,dpd.harga_barang,dpd.qty_barang,dpd.sub_total, b.gambar1_barang,l.nama_lead,l.nama_perusahaan FROM freedb_database_ta.daftarpesanan dp JOIN freedb_database_ta.daftarpesanan_detail dpd ON dp.id_cart=dpd.id_cart JOIN freedb_database_ta.barang b ON b.id_barang=dpd.id_barang JOIN freedb_database_ta.lead l ON l.id_lead = dp.id_lead WHERE dp.id_sales = '${id_sales}' AND dp.id_lead='${id_lead}'`;
  return dbpool.execute(query);
};

const cekDaftarPesanan = async (id_sales, id_lead) => {
  const query = `SELECT * FROM daftarpesanan WHERE id_sales = '${id_sales}' AND id_lead='${id_lead}'`;
  return dbpool.execute(query);
};

const updateCart = async (body) => {
  const connection = await dbpool.getConnection();
  try {
    await connection.beginTransaction();
    const { id_sales, id_lead } = body;
    const query3 = `SELECT id_cart, qty_total, harga_total FROM daftarpesanan WHERE id_sales = '${id_sales}' AND id_lead='${id_lead}'`;
    const result3 = await connection.query(query3);
    let total = result3[0][0].harga_total;
    let qty_temp = result3[0][0].qty_total;
    let id_cart = result3[0][0].id_cart;
    let id_barang_temp = body.detail[0].id_barang;
    const query4 = `SELECT qty_barang, sub_total FROM daftarpesanan_detail WHERE id_cart = '${id_cart}' AND id_barang='${id_barang_temp}'`;
    const result4 = await connection.query(query4);

    let sub_total_temp = 0;
    let qty_barang_temp = 0;
    if (result4[0].length > 0) {
      sub_total_temp = result4[0][0].sub_total;
      qty_barang_temp = result4[0][0].qty_barang;
    }
    const daftarpesanan_details = body.detail.map((item) => {
      const sub_total = item.qty_barang * item.harga_barang;
      total += sub_total;
      qty_temp += item.qty_barang;
      sub_total_temp += sub_total;
      qty_barang_temp += item.qty_barang;
      return [
        uuidv4(),
        id_cart,
        item.id_barang,
        item.nama_barang,
        item.harga_barang,
        item.qty_barang,
        sub_total,
      ];
    });
    const query1 = `UPDATE daftarpesanan SET qty_total=${qty_temp}, harga_total=${total} WHERE id_sales = '${id_sales}' AND id_lead='${id_lead}'`;
    const result1 = await connection.query(query1, [qty_temp, total]);
    if (result3[0].length > 0 && result4[0].length > 0) {
      const query2 = `UPDATE daftarpesanan_detail SET qty_barang=${qty_barang_temp}, sub_total=${sub_total_temp} WHERE id_cart='${id_cart}' AND id_barang = '${id_barang_temp}'`;
      const result2 = await connection.query(query2);
      await connection.commit();
      return [result1, result2];
    } else {
      const query2 =
        "INSERT INTO `daftarpesanan_detail`(`id_cart_detail`, `id_cart`, `id_barang`, `nama_barang`, harga_barang, qty_barang, sub_total) VALUES ?";
      const result2 = await connection.query(query2, [daftarpesanan_details]);
      await connection.commit();
      return [result1, result2];
    }
  } catch (error) {
    await connection.rollback();
    dbpool.releaseConnection();
  }
};

const DeleteAllCart = async (id_lead) => {
  try {
    const queryselect = `SELECT * FROM daftarpesanan WHERE id_lead='${id_lead}'`;
    const select = await dbpool.execute(queryselect);
    if (select[0].length > 0) {
      const query1 = `DELETE FROM daftarpesanan_detail WHERE id_cart='${select[0][0].id_cart}'`;
      const query2 = `DELETE FROM daftarpesanan WHERE id_cart='${select[0][0].id_cart}'`;
      dbpool.execute(query1).then(() => {
        return dbpool.execute(query2);
      });
    }
    return null;
  } catch (error) {
    return error;
  }
};

const deleteDetailCart = async (id_cart, id_cart_detail) => {
  try {
    const queryselect = `SELECT * FROM daftarpesanan_detail WHERE id_cart='${id_cart}'`;
    const select = await dbpool.execute(queryselect);
    if (select[0].length == 1) {
      const query1 = `DELETE FROM daftarpesanan WHERE id_cart='${select[0][0].id_cart}'`;
      dbpool.execute(query1);
      const query2 = `DELETE FROM daftarpesanan_detail WHERE id_cart='${select[0][0].id_cart}' AND id_cart_detail='${id_cart_detail}'`;
      return dbpool.execute(query2);
    }
    const queryselect2 = `SELECT qty_barang, sub_total FROM daftarpesanan_detail WHERE id_cart='${id_cart}' AND id_cart_detail='${id_cart_detail}'`;
    const select2 = await dbpool.execute(queryselect2);
    let subtotaltemp = select2[0][0].sub_total;
    let qtytemp = select2[0][0].qty_barang;
    const query3 = `DELETE FROM daftarpesanan_detail WHERE id_cart='${select[0][0].id_cart}' AND id_cart_detail='${id_cart_detail}'`;
    dbpool.execute(query3);
    const query4 = `UPDATE daftarpesanan SET qty_total=qty_total-${qtytemp}, harga_total=harga_total-${subtotaltemp}`;
    return dbpool.execute(query4);
  } catch (error) {
    return error;
  }
};

const cartMinus = async (id_cart, id_cart_detail) => {
  try {
    const queryselect2 = `SELECT * FROM daftarpesanan_detail WHERE id_cart='${id_cart}'`;
    const select2 = await dbpool.execute(queryselect2);
    const queryselect = `SELECT * FROM daftarpesanan_detail WHERE id_cart='${id_cart}' AND id_cart_detail='${id_cart_detail}'`;
    const select = await dbpool.execute(queryselect);
    const queryselect3 = `SELECT * FROM daftarpesanan WHERE id_cart='${id_cart}'`;
    const select3 = await dbpool.execute(queryselect3);
    if (
      (select2[0][0].length == 1 && select[0][0].qty_barang == 1) ||
      (select3[0][0].qty_total == 1 && select[0][0].qty_barang == 1)
    ) {
      const query1 = `DELETE FROM daftarpesanan WHERE id_cart='${select[0][0].id_cart}'`;
      dbpool.execute(query1);
      const query2 = `DELETE FROM daftarpesanan_detail WHERE id_cart='${select[0][0].id_cart}' AND id_cart_detail='${id_cart_detail}'`;
      return dbpool.execute(query2);
    } else if (select[0][0].qty_barang <= 1) {
      const query5 = `DELETE FROM daftarpesanan_detail WHERE id_cart='${select[0][0].id_cart}' AND id_cart_detail='${id_cart_detail}'`;
      dbpool.execute(query5);
      const query6 = `UPDATE daftarpesanan SET qty_total=qty_total-${1}, harga_total=harga_total-${
        select[0][0].harga_barang
      }`;
      return dbpool.execute(query6);
    }
    const query3 = `UPDATE daftarpesanan_detail set qty_barang=qty_barang-${1}, sub_total=sub_total-harga_barang WHERE id_cart='${
      select[0][0].id_cart
    }' AND id_cart_detail='${id_cart_detail}'`;
    dbpool.execute(query3);
    const query4 = `UPDATE daftarpesanan SET qty_total=qty_total-${1}, harga_total=harga_total-${
      select[0][0].harga_barang
    }`;
    return dbpool.execute(query4);
  } catch (error) {
    return error;
  }
};

const cartPlus = async (id_cart, id_cart_detail) => {
  try {
    const queryselect = `SELECT * FROM daftarpesanan_detail WHERE id_cart='${id_cart}' AND id_cart_detail='${id_cart_detail}'`;
    const select = await dbpool.execute(queryselect);
    const query1 = `UPDATE daftarpesanan_detail set qty_barang=qty_barang+${1}, sub_total=sub_total+harga_barang WHERE id_cart='${
      select[0][0].id_cart
    }' AND id_cart_detail='${id_cart_detail}'`;
    dbpool.execute(query1);
    const query2 = `UPDATE daftarpesanan SET qty_total=qty_total+${1}, harga_total=harga_total+${
      select[0][0].harga_barang
    }`;
    return dbpool.execute(query2);
  } catch (error) {
    return error;
  }
};

module.exports = {
  getAllOrder_detail,
  getAllOrder_idsales,
  getAllOrder_sum,
  inputOrderSummary,
  daftarPesanan,
  getDaftarpesanan_idsales,
  updateCart,
  cekDaftarPesanan,
  DeleteAllCart,
  deleteDetailCart,
  cartMinus,
  cartPlus,
  getOrder_detail,
  getOrderSum_by_idOrder,
};
