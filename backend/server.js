const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const carRoutes = require('./routes/carRoutes'); // Route สำหรับจัดการข้อมูลห้องพัก
const userRoutes = require('./routes/userRoutes'); // Route สำหรับจัดการข้อมูลผู้ใช้ (MSSQL)
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/cars', carRoutes); // ใช้ SQL Server สำหรับจัดการห้องพัก
app.use('/users', userRoutes); // ใช้ SQL Server สำหรับจัดการข้อมูลผู้ใช้
app.use('/bookings', bookingRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
