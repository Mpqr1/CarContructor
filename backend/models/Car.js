class Car {
    constructor(car_name, car_desc, car_price, car_stock, car_image_url) {
        this.car_name = car_name;
        this.car_desc = car_desc;
        this.car_price = car_price;
        this.car_stock = car_stock;  // Added car_stock
        this.car_image_url = car_image_url; // Added field for storing image URL
        this.car_status = car_status;
    }
}

module.exports = Car;
