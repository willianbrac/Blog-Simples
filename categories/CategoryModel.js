const Sequelize = require("sequelize");
const conn = require("../Database/connection");

const Category = conn.define('categories', {
    title:{
        type: Sequelize.STRING, allowNull: false
    }, 
    slug:{                                            //versão de um título da model para ser utilizado em uma rota
        type: Sequelize.STRING, allowNull: false 
    }
});

//Category.sync({force: true});

module.exports = Category;
