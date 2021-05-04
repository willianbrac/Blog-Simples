
const express              = require("express");
const bodyParser           = require('body-parser');
const app                  = express();
const conn                 = require('./Database/connection');
const categoriesController = require("./categories/CategoriesController");
const articlesController   = require("./articles/ArticlesController");
const categoryModel        = require("./categories/CategoryModel");
const articleModel         = require("./articles/ArticleModel");
const Article              = require("./articles/ArticleModel");
const userController       = require("./user/userController");
const UserModel            = require("./user/UserModel");

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static('public'));


conn.authenticate().then(() => {
    console.log("connected with mysql");
}).catch((err) => {
    console.log(err);
})


//------------------------Routers-------------------------------------

app.use("/", categoriesController);
app.use("/", articlesController  );
app.use("/", userController);



app.get("/", (req, res)=>{
    articleModel.findAll({
        order: [['id','DESC']],
        limit: 4
    }).then(articles => {
        categoryModel.findAll().then(categories => {
            res.render('index', {articles: articles, categories: categories});
        })
    })
});

app.get("/:slug", (req,res) => {
    var slug = req.params.slug;
    articleModel.findOne({
        where: {
            slug: slug
        }
    }).then(article => {
        if (article != undefined) {
            categoryModel.findAll().then(categories => {
                res.render('article', {article: article, categories: categories});
            })          
        } else {
            res.redirect("/");
        }
    }).catch( err => {
        console.log("MESSAGE ERROR => " + err);
    })
});

app.get("/category/:slug", (req,res) => {
    var slug = req.params.slug;
    categoryModel.findOne({
        where: {slug: slug },
        include: [{model: articleModel}]
    }).then(category => {
        if (category != undefined) {
            categoryModel.findAll().then(categories => {
                res.render('index', {articles: category.articles, categories: categories});
            }) 
        } else {
            res.redirect("/");
        }
    }).catch( err => {
        console.log("MESSAGE ERROR => " + err);
    })
});

module.exports = app;