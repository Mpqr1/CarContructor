const express = require('express');
const router = express.Router();
const sql = require('../config/dbconfig');
const jwt = require('jsonwebtoken');

// Function to verify token and extract user ID
const verifyToken = (req) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) throw new Error('No token provided');

  return jwt.verify(token, 'secretKey', (err, user) => {
    if (err) throw new Error('Failed to authenticate token');
    return user;
  });
};

// API สำหรับการจองรถ
router.post('/', (req, res) => {
  const { car_id, user_id, startDate, endDate, totalDays, totalPrice, country, contact, company, phone, additional, bookingStatus = 'booking' } = req.body;

  const bookingQuery = `
    INSERT INTO Bookings (car_id, user_id, start_date, end_date, total_days, total_price, booking_status, country, contact, company, phone, additional)
    VALUES (@car_id, @user_id, @startDate, @endDate, @totalDays, @totalPrice, @bookingStatus, @country, @contact, @company, @phone, @additional);
  `;

  const updateStockQuery = `
    UPDATE Cars
    SET car_stock = car_stock - 1
    WHERE car_id = @car_id AND car_stock > 0;
  `;

  const request = new sql.Request();
  request.input('car_id', sql.Int, car_id);
  request.input('user_id', sql.Int, user_id);
  request.input('startDate', sql.Date, startDate);
  request.input('endDate', sql.Date, endDate);
  request.input('totalDays', sql.Int, totalDays);
  request.input('totalPrice', sql.Decimal, totalPrice);
  request.input('bookingStatus', sql.NVarChar, bookingStatus);
  request.input('country', sql.NVarChar, country);
  request.input('contact', sql.NVarChar, contact);
  request.input('company', sql.NVarChar, company);
  request.input('phone', sql.NVarChar, phone);
  request.input('additional', sql.NVarChar, additional);

  request.query(updateStockQuery, (updateErr, updateResult) => {
    if (updateErr || updateResult.rowsAffected[0] === 0) {
      console.error('Error updating car stock:', updateErr || 'No stock available');
      return res.status(400).json({ message: 'Car is out of stock or error occurred' });
    }

    request.query(bookingQuery, (bookingErr, bookingResult) => {
      if (bookingErr) {
        console.error('Error booking car:', bookingErr);
        return res.status(500).json({ message: 'Error booking car', error: bookingErr });
      }

      res.status(200).json({ message: 'Booking confirmed successfully and car stock updated' });
    });
  });
});


// API to update booking status (Check-in/Check-out)
router.patch('/update-status/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const getCarIdQuery = `
    SELECT car_id FROM Bookings WHERE booking_id = @id;
  `;

  const updateStatusQuery = `
    UPDATE Bookings
    SET booking_status = @status
    WHERE booking_id = @id;
  `;

  const updateStockQuery = `
    UPDATE Cars
    SET car_stock = car_stock + 1
    WHERE car_id = @car_id;
  `;

  const request = new sql.Request();
  request.input('id', sql.Int, id);
  request.input('status', sql.NVarChar, status);

  request.query(updateStatusQuery, (err) => {
    if (err) {
      console.error('Error updating booking status:', err);
      return res.status(500).send('Error updating booking status');
    }

    if (status === 'check-out') {
      request.query(getCarIdQuery, (getCarErr, result) => {
        if (getCarErr || result.recordset.length === 0) {
          console.error('Error fetching car ID:', getCarErr);
          return res.status(500).send('Error fetching car ID or booking not found');
        }

        const carId = result.recordset[0].car_id;
        request.input('car_id', sql.Int, carId);

        request.query(updateStockQuery, (updateErr) => {
          if (updateErr) {
            console.error('Error updating car stock:', updateErr);
            return res.status(500).send('Error updating car stock');
          }

          res.send('Booking status updated and car stock adjusted successfully');
        });
      });
    } else {
      res.send('Booking status updated successfully');
    }
  });
});

// API to get all bookings
router.get('/', (req, res) => {
  const query = `
    SELECT 
      b.booking_id, b.start_date, b.end_date, b.total_days, b.total_price, b.country, b.contact, b.company, b.phone, b.additional, b.booking_status, 
      r.car_name, u.user_name 
    FROM 
      Bookings b
    JOIN 
      Cars r ON b.car_id = r.car_id
    JOIN 
      Users u ON b.user_id = u.user_id;
  `;

  new sql.Request().query(query, (err, result) => {
    if (err) {
      console.error('Error fetching bookings:', err);
      return res.status(500).send('Server error while fetching bookings');
    }

    res.json(result.recordset);
  });
});

// API to get bookings for the logged-in user
router.get('/mybookings', (req, res) => {
  try {
    const user = verifyToken(req);
    const userId = user.id;

    const query = `
      SELECT 
        b.booking_id, b.start_date, b.end_date, b.total_days, b.total_price, b.country, b.contact, b.company, b.phone, b.additional, b.booking_status, 
        r.car_name, u.user_name 
      FROM 
        Bookings b
      JOIN 
        Cars r ON b.car_id = r.car_id
      JOIN 
        Users u ON b.user_id = u.user_id
      WHERE 
        b.user_id = @userId;
    `;

    const request = new sql.Request();
    request.input('userId', sql.Int, userId);

    request.query(query, (err, result) => {
      if (err) {
        console.error('Error fetching user bookings:', err);
        return res.status(500).send('Server error while fetching user bookings');
      }

      res.json(result.recordset);
    });
  } catch (err) {
    console.error('Token verification error:', err.message);
    res.status(401).json({ message: err.message });
  }
});

// API to delete a booking by ID and update car stock
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  const getCarIdQuery = `
    SELECT car_id FROM Bookings WHERE booking_id = @id;
  `;

  const deleteBookingQuery = `
    DELETE FROM Bookings WHERE booking_id = @id;
  `;

  const updateStockQuery = `
    UPDATE Cars
    SET car_stock = car_stock + 1
    WHERE car_id = @car_id;
  `;

  const request = new sql.Request();
  request.input('id', sql.Int, id);

  request.query(getCarIdQuery, (err, result) => {
    if (err || result.recordset.length === 0) {
      console.error('Error fetching car ID:', err);
      return res.status(500).send('Error fetching car ID or booking not found');
    }

    const carId = result.recordset[0].car_id;
    request.input('car_id', sql.Int, carId);

    request.query(deleteBookingQuery, (deleteErr) => {
      if (deleteErr) {
        console.error('Error deleting booking:', deleteErr);
        return res.status(500).send('Server error while deleting booking');
      }

      request.query(updateStockQuery, (updateErr) => {
        if (updateErr) {
          console.error('Error updating car stock:', updateErr);
          return res.status(500).send('Error updating car stock');
        }

        res.send('Booking deleted and car stock updated successfully');
      });
    });
  });
});

// API to update an existing booking
router.put('/update-booking/:id', (req, res) => {
  const { id } = req.params;
  const { car_id, start_date, end_date, total_days, total_price, booking_status } = req.body;

  const query = `
    UPDATE Bookings
    SET car_id = @car_id, start_date = @start_date, end_date = @end_date, total_days = @total_days, total_price = @total_price, booking_status = @booking_status
    WHERE booking_id = @id;
  `;

  const request = new sql.Request();
  request.input('id', sql.Int, id);
  request.input('car_id', sql.Int, car_id);
  request.input('start_date', sql.Date, start_date);
  request.input('end_date', sql.Date, end_date);
  request.input('total_days', sql.Int, total_days);
  request.input('total_price', sql.Decimal, total_price);
  request.input('booking_status', sql.NVarChar, booking_status);

  request.query(query, (err, result) => {
    if (err) {
      console.error('Error updating booking:', err);
      return res.status(500).json({ message: 'Error updating booking', error: err });
    }

    res.status(200).json({ message: 'Booking updated successfully' });
  });
});


module.exports = router;
