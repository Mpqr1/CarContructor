const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sql = require('../config/dbconfig');
const User = require('../models/User'); // เรียกใช้ User model

// ฟังก์ชันสร้าง JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, 'secretKey', { expiresIn: '1h' }); // ใช้ secretKey ที่ปลอดภัย
};

// API สำหรับการลงทะเบียนผู้ใช้ใหม่
router.post('/register', async (req, res) => {
  const { user_name, user_email, user_password, user_role } = req.body;

  try {
    const query = `SELECT * FROM Users WHERE user_email = @Email`;
    const request = new sql.Request();
    request.input('Email', sql.VarChar, user_email);
    const result = await request.query(query);

    if (result.recordset.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // เข้ารหัสรหัสผ่าน
    const user = new User(user_name, user_email, user_password, user_role);
    await user.hashPassword();

    // เพิ่มข้อมูลผู้ใช้ใหม่ลงในฐานข้อมูล MSSQL
    const insertQuery = `
      INSERT INTO Users (user_name, user_email, user_password, user_role)
      VALUES (@user_name, @user_email, @user_password, @user_role);
    `;
    const insertRequest = new sql.Request();
    insertRequest.input('user_name', sql.NVarChar, user.user_name);
    insertRequest.input('user_email', sql.NVarChar, user.user_email);
    insertRequest.input('user_password', sql.NVarChar, user.user_password);
    insertRequest.input('user_role', sql.NVarChar, user.user_role);
    await insertRequest.query(insertQuery);

    // สร้าง JWT Token
    const token = generateToken(user.user_id);

    res.status(201).json({
      _id: user.user_id,
      username: user.user_name,
      email: user.user_email,
      role: user.user_role,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
});

// API สำหรับการเข้าสู่ระบบ
router.post('/login', async (req, res) => {
    const { user_email, user_password } = req.body;
  
    try {
      // ตรวจสอบผู้ใช้จาก email
      const query = `SELECT * FROM Users WHERE user_email = @Email`;
      const request = new sql.Request();
      request.input('Email', sql.NVarChar, user_email);
      const result = await request.query(query);
  
      const user = result.recordset[0]; // ดึงผู้ใช้คนแรกที่พบ
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // ตรวจสอบรหัสผ่าน
      const isMatch = await bcrypt.compare(user_password, user.user_password);
  
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid password' });
      }
  
      // สร้าง JWT Token
      const token = generateToken(user.user_id);
  
      // ส่งข้อมูลผู้ใช้กลับไปพร้อมกับ Token
      res.json({
        _id: user.user_id,
        username: user.user_name,
        email: user.user_email,
        role: user.user_role,
        token,
      });
    } catch (error) {
      res.status(500).json({ message: 'Error logging in user', error });
    }
  });

  router.get('/:id', (req, res) => {
    const { id } = req.params;
    const query = `SELECT user_id, user_name, user_email FROM Users WHERE user_id = @id`;
    const request = new sql.Request();
    request.input('id', sql.Int, id);
    request.query(query, (err, result) => {
        if (err) {
            console.error('Error fetching user info:', err);
            res.status(500).send('Server error while fetching user info');
        } else if (!result.recordset.length) {
            res.status(404).send('User not found');
        } else {
            res.send(result.recordset[0]);
        }
    });
});

module.exports = router;
