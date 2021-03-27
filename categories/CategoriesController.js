const express  = require("express");
const router   = express.Router();
const category = require("./CategoryModel");
const slugify  = require("slugify");

router.get("/adm/categories/new", (req, res) => {      //renderiza as pagina de cadastro de categoria
    res.render("admin/categories/new");
});

router.post("/categories/save", (req, res) => {        //salva as informações
    var title = req.body.title;

    if(title != undefined){
        category.create({
            title : title,
            slug  : slugify(title)           // versão sem espaço e tudo minúsculo de um texto
        }).then(() => {
            res.redirect("/adm/categories");
        })
    }else{
        res.redirect("/adm/categories/new"); //redirecionamento para a pagina a mesma página
    }
});

router.get("/adm/categories", (req,res) => {   //lista as categorias que foram cadastradas
    category.findAll().then(categories => {
        res.render("admin/categories/index", {categories: categories});
    });
});

router.post("/categories/delete", (req, res) => {
    id = req.body.id;
    if (id != undefined) {
        if (!isNaN(id)) {
            category.destroy({
                where: {
                    id : id
                }
            }).then(() => {
                res.redirect("/adm/categories")
            })
        } else {
            res.redirect("/adm/categories"); //redireciona se não for número
        }
    } else {
        res.redirect("/adm/categories"); //redireciona se for um null
    }
});

router.get("/adm/categories/edit/:id", (req, res) => {
    var id = req.params.id;

    if(isNaN(id)){
        res.redirect("/adm/categories")
    }
    category.findByPk(id).then(category => {                           //findByPk: procurar pela primary key
        if(category != undefined){                                     //se o id da categoria pesquisada for diferente de indefinido
            res.render("admin/categories/edit", {category: category}); //renderiza a página de edição passando um json com a categoria
        }else{
            res.redirect("/adm/categories");                           //se hover alguma objeção é redirecionado para a página com  todas as categorias
        }
    }).catch((err) => {
        res.redirect("/adm/categories");
    })
});

router.post("/categories/update", (req, res) =>{     //rota para atualizar os campos no BD
    var id = req.body.id;
    var title = req.body.title;

    category.update({title: title, slug: slugify(title)}, {                //atualiza o título pelo id. com o novo título recebido no formulário
        where:{
            id: id
        }
    }).then(() => {
        res.redirect("/adm/categories");
    })
});

module.exports = router;

