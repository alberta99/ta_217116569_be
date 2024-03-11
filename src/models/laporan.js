const dbpool = require("../config/dbconfig");
const getLeadBySalesTanggal = (id_sales, tanggal_start, tanggal_end) => {
  const query = `
    SELECT 
        l.id_lead,l.nama_lead,l.nama_perusahaan,l.alamat_lead,l.nohp_lead,l.email_lead,l.tgl_join_lead,l.id_sales, s.nama_sales 
    FROM 
        ${process.env.DB_NAME}.lead l 
    JOIN 
        ${process.env.DB_NAME}.salesperson s ON l.id_sales=s.id_sales 
    WHERE 
        l.deleted = 1 
    AND 
        l.id_sales LIKE '${id_sales}' 
    AND 
        DATE(l.tgl_join_lead)>=DATE('${tanggal_start}')
    AND 
        DATE(l.tgl_join_lead)<=DATE('${tanggal_end}')`;
  console.log(query);
  return dbpool.execute(query);
};

const getAllSales = () => {
  const query = `SELECT 
  s.id_sales,
  s.tgl_join_sales,
  s.nama_sales,
  s.alamat_sales,
  s.nohp_sales,
  s.email_sales,
  s.password_sales,
  COUNT(DISTINCT j.id_jadwal) AS jadwal, 
  COUNT(DISTINCT o.id_order) AS penjualan,
  COUNT(DISTINCT l.id_lead) AS jumlah_lead
FROM 
  ${process.env.DB_NAME}.salesperson s 
LEFT JOIN 
  ${process.env.DB_NAME}.jadwal j ON j.id_sales = s.id_sales 
LEFT JOIN 
  ${process.env.DB_NAME}.order_sum o ON o.id_sales = s.id_sales 
LEFT JOIN 
  ${process.env.DB_NAME}.lead l ON l.id_sales = s.id_sales 
GROUP BY 
  s.id_sales, s.tgl_join_sales, s.nama_sales, s.alamat_sales, s.nohp_sales, s.email_sales, s.password_sales;
`;
  return dbpool.execute(query);
};

const getAllOrder = () => {
  const query = `SELECT
  o.id_order,
  o.tanggal_order,
  s.nama_sales,
  l.nama_lead,
  l.nama_perusahaan,
  o.qty_total,
  o.sub_total_order,
  o.harga_diskon,
  o.total_order,
  o.jenis_pembayaran,
  o.status
FROM
  ${process.env.DB_NAME}.order_sum o
LEFT JOIN
  ${process.env.DB_NAME}.salesperson s 
ON
  s.id_sales = o.id_sales
LEFT JOIN
  ${process.env.DB_NAME}.lead l
ON
  l.id_lead = o.id_lead`;
  return dbpool.execute(query);
};

const getAllOrderByTanggal = (tanggal_start, tanggal_end) => {
  const query = `SELECT
    o.id_order,
    o.tanggal_order,
    s.nama_sales,
    l.nama_lead,
    l.nama_perusahaan,
    o.qty_total,
    o.sub_total_order,
    o.harga_diskon,
    o.total_order,
    o.jenis_pembayaran,
    o.status
  FROM
    ${process.env.DB_NAME}.order_sum o
  LEFT JOIN
    ${process.env.DB_NAME}.salesperson s 
  ON
    s.id_sales = o.id_sales
  LEFT JOIN
    ${process.env.DB_NAME}.lead l
  ON
    l.id_lead = o.id_lead
  WHERE
    DATE(o.tanggal_order)
  BETWEEN DATE('${tanggal_start}') AND DATE('${tanggal_end}')`;
  return dbpool.execute(query);
};

const getConversionRate = () => {
  const query = `SELECT (SELECT COUNT(*) FROM ${process.env.DB_NAME}.LEAD WHERE STATUS=1) AS 'cust', (SELECT COUNT(*) FROM ${process.env.DB_NAME}.LEAD WHERE STATUS=0) AS 'lead'`;
  return dbpool.execute(query);
};

const getConversionRateBySales = () => {
  const query = `SELECT 
    s.nama_sales,
    COALESCE((SELECT COUNT(*) FROM ${process.env.DB_NAME}.LEAD WHERE STATUS=1 AND id_sales = l.id_sales), 0) AS 'cust',
    COALESCE((SELECT COUNT(*) FROM ${process.env.DB_NAME}.LEAD WHERE STATUS=0 AND id_sales = l.id_sales), 0) AS 'lead',
    CASE 
      WHEN COALESCE((SELECT COUNT(*) FROM ${process.env.DB_NAME}.LEAD WHERE id_sales = l.id_sales), 0) = 0 THEN 0
      ELSE ROUND((COALESCE((SELECT COUNT(*) FROM ${process.env.DB_NAME}.LEAD WHERE STATUS=1 AND id_sales = l.id_sales), 0) / COALESCE((SELECT COUNT(*) FROM ${process.env.DB_NAME}.LEAD WHERE id_sales = l.id_sales), 0)) * 100, 2)
    END AS 'conversion_rate'
  FROM
    ${process.env.DB_NAME}.salesperson s
  LEFT JOIN
    ${process.env.DB_NAME}.lead l ON s.id_sales = l.id_sales
  GROUP BY 
    s.id_sales, s.nama_sales;
  `;
  return dbpool.execute(query);
};

module.exports = {
  getLeadBySalesTanggal,
  getAllSales,
  getAllOrder,
  getAllOrderByTanggal,
  getConversionRate,
  getConversionRateBySales,
};
