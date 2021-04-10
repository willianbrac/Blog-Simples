const express  = require("express");
const router   = express.Router();
const Category = require("../categories/CategoryModel");             // [x] utilizado a model de categoria
const Article  = require("./ArticleModel");                          // [x] Importando a model de artigo
const slugify  = require("slugify");

router.get("/adm/articles", (req, res) => {
    Article.findAll({
        include: [{ model: Category}],
        order: [['createdAt', 'DESC']]                                 // [x] pegando os dados da categoria do artigo
   }).then(articles => {                                               
        res.render("admin/articles/index", {articles: articles});    // [x] passando os dados para view
    });
});

router.get("/adm/articles/new", (req, res) => {                      // [x] rota para criar uma nova categoria
    Category.findAll().then(categories => {                          // [x] pegando todas as categorias cadastradas                       
        res.render("admin/articles/new", {categories: categories});  // [x] passando os dados para view
    });
    
});

router.post("/articles/save",(req, res) => {
    var title    = req.body.title;
    var body     = req.body.body;
    var category = req.body.categoryId;

    //res.json(req.body);

        Article.create({
            title: title,
            slug: slugify(title),
            body: body,
            categoryId: category
        }).then(() => {
            res.redirect("/adm/articles");
        });

});

router.post("/articles/delete", (req, res) => {
    var id = req.body.id;
    if (id != undefined) {
        if (!isNaN(id)) {
            Article.destroy({
                where: {
                    id : id
                }
            }).then(() => {
                res.redirect("/adm/articles");
            })
        } else {
            res.redirect("/adm/articles"); //redireciona se não for número  //apresentar mensagem
        }
    } else {
        res.redirect("/adm/articles"); //redireciona se for um null
    }
});

//recebe o artigo a ser editado
router.get("/adm/articles/edit/:id", (req, res) => {
    var id = req.params.id;
    Article.findByPk(id).then(article => {
        if (article != undefined) {
            Category.findAll().then(categories => {
                res.render("admin/articles/edit", {categories: categories, article: article});
            })
        } else {
            res.redirect("/");
        }
    }).catch((err) => {
        res.redirect("/");
    })
});

router.post("/articles/update", (req,res) => {
    var id = req.body.id
    var title = req.body.title
    var body = req.body.body
    var category = req.body.categoryId

    Article.update({
        title: title,
        body: body,
        categoryId: category, 
        slug: slugify(title),
        where:{
            id: id
        }
    }).then(()=>{
        res.redirect("/adm/articles")
    }).catch(err => {
        res.redirect("/adm/articles")
    })
})
module.exports = router;

