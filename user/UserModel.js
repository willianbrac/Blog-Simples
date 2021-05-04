const Sequelize = require("sequelize");
const conn = require("../Database/connection");

const User = conn.define('users', {
    email:{
        type: Sequelize.STRING, allowNull: false
    }, 
    password:{                                            //versão de um título da model para ser utilizado em uma rota
        type: Sequelize.STRING, allowNull: false 
    }
});

//User.sync({force: true});

module.exports = User;
