const express = require('express');
const router = express.Router();
const sql = require('../config/dbconfig');


router.post('/', (req, res) => {
    const { car_name, car_desc, car_price, car_stock, car_image, car_status } = req.body;
    const query = `
        INSERT INTO Cars (car_name, car_desc, car_price, car_stock, car_image, car_status)
        VALUES (@car_name, @car_desc, @car_price, @car_stock, @car_image, @car_status);
    `;
    const request = new sql.Request();
    request.input('car_name', sql.NVarChar, car_name);
    request.input('car_desc', sql.NVarChar, car_desc);
    request.input('car_price', sql.Decimal, car_price);
    request.input('car_stock', sql.Int, car_stock);
    request.input('car_image', sql.NVarChar, car_image);
    request.input('car_status', sql.Bit, car_status); 
    request.query(query, (err, result) => {
        if (err) {
            console.error('Error adding car:', err);
            res.status(500).send(err);
        } else {
            res.send('Car added successfully');
        }
    });
});


router.get('/', (req, res) => {
    const query = 'SELECT * FROM Cars';
    new sql.Request().query(query, (err, result) => {
        if (err) {
            console.error('Error fetching cars:', err);
            res.status(500).send('Server error while fetching cars');
        } else {
            res.send(result.recordset);
        }
    });
});


router.get('/available', (req, res) => {
    const query = `SELECT * FROM Cars WHERE car_status = 1`;
    new sql.Request().query(query, (err, result) => {
        if (err) {
            console.error('Error fetching available cars:', err);
            res.status(500).send('Error fetching available cars');
        } else {
            res.send(result.recordset);
        }
    });
});


router.get('/:id', (req, res) => {
    const { id } = req.params;
    const query = `SELECT * FROM Cars WHERE car_id = @id`;
    const request = new sql.Request();
    request.input('id', sql.Int, id);
    request.query(query, (err, result) => {
        if (err) {
            console.error('Error fetching car by ID:', err);
            res.status(500).send('Server error while fetching car by ID');
        } else if (!result.recordset.length) {
            res.status(404).send('Car not found');
        } else {
            res.send(result.recordset[0]);
        }
    });
});


router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { car_name, car_desc, car_price, car_stock, car_image, car_status } = req.body;
    const query = `
        UPDATE Cars 
        SET car_name = @car_name, car_desc = @car_desc, car_price = @car_price, car_stock = @car_stock, car_image = @car_image, car_status = @car_status
        WHERE car_id = @id;
    `;
    const request = new sql.Request();
    request.input('id', sql.Int, id);
    request.input('car_name', sql.NVarChar, car_name);
    request.input('car_desc', sql.NVarChar, car_desc);
    request.input('car_price', sql.Decimal, car_price);
    request.input('car_stock', sql.Int, car_stock);
    request.input('car_image', sql.NVarChar, car_image);
    request.input('car_status', sql.Bit, car_status);
    request.query(query, (err, result) => {
        if (err) {
            console.error('Error updating car:', err);
            res.status(500).send(err);
        } else {
            res.send('Car updated successfully');
        }
    });
});


router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const query = `DELETE FROM Cars WHERE car_id = @id`;
    const request = new sql.Request();
    request.input('id', sql.Int, id);
    request.query(query, (err, result) => {
        if (err) {
            console.error('Error deleting car:', err);
            res.status(500).send('Server error while deleting car');
        } else {
            res.send('Car deleted successfully');
        }
    });
});

module.exports = router;
