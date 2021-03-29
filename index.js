
const express              = require("express");
const bodyParser           = require('body-parser');
const app                  = express();
const conn                 = require('./Database/connection');
const categoriesController = require("./categories/CategoriesController");
const articlesController   = require("./articles/ArticlesController");
const categoryModel        = require("./categories/CategoryModel");
const articleModel         = require("./articles/ArticleModel");
const Article = require("./articles/ArticleModel");


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



app.get("/", (req, res)=>{
    Article.findAll({
        order: [['id','DESC']]
    }).then(articles => {
        res.render('index', {articles: articles})
    })
});

app.get("/:slug", (req,res) => {
    var slug = req.params.slug;
    Article.findOne({
        where: {
            slug: slug
        }
    }).then(article => {
        if (article != undefined) {
            res.render("article", {article: article});            
        } else {
            res.redirect("/");
        }
    }).catch( err => {
        console.log("MESAGE ERROR => " + err);
    })
})

module.exports = app;