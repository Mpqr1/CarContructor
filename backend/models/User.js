const sql = require('mssql');
const bcrypt = require('bcryptjs');


class User {
    constructor(user_name, user_email, user_password, user_role, user_address) {
        this.user_name = user_name;
        this.user_email = user_email;
        this.user_password = user_password;
        this.user_role = user_role;
        this.user_address = user_address;
    }

   
    async hashPassword() {
        const salt = await bcrypt.genSalt(10);
        this.user_password = await bcrypt.hash(this.user_password, salt);
    }

    
    async matchPassword(enteredPassword) {
        return await bcrypt.compare(enteredPassword, this.user_password);
    }
}

module.exports = User;
