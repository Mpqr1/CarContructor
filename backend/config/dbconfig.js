const sql = require('mssql');

// ตั้งค่าการเชื่อมต่อฐานข้อมูล MSSQL
const config = {
  user: 'sa',
  password: 'pp123pp456',
  server: 'DESKTOP-D3K0GTC', // เช่น localhost หรือ IP ของ server
  database: 'RentCarDB',
  options: {
    encrypt: true, // ใช้การเข้ารหัสการเชื่อมต่อ
    trustServerCertificate: true,
  }
};

// เชื่อมต่อกับฐานข้อมูล
sql.connect(config, (err) => {
  if (err) {
    console.log('Error connecting to the database:', err);
  } else {
    console.log('Connected to MSSQL database');
  }
});

module.exports = sql;
