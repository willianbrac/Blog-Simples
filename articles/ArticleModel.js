const Sequelize = require("sequelize");
const conn      = require("../Database/connection");
const Category  = require("..//categories/CategoryModel"); //importando a model para ela poder ser usada no relacionamento.

const Article = conn.define('articles', {
    title:{
        type: Sequelize.STRING, allowNull: false
    }, 
    slug:{                                            //versão de um título da model para ser utilizado em uma rota
        type: Sequelize.STRING, allowNull: false 
    },
    body:{
        type: Sequelize.TEXT, allowNull: false
    }
});

Category.hasMany   (Article);    //uma categoria tem muitos artigos
Article.belongsTo (Category);    //um artigo pertence a uma categoria

//Article.sync({force: true});

module.exports = Article;