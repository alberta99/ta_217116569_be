const mysql = require("mysql2");
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'database_ta'
});

function getConnection() {
    return new Promise(function (resolve, reject) {
        pool.getConnection(function (err, conn) {
            if (err) reject(err);
            else resolve(conn);
        });
    });
}

function executeQuery(conn, query) {
    return new Promise(function (resolve, reject) {
        conn.query(query, function (err, res) {
            if (err) reject(err);
            else resolve(res);
        });
    });
}