const express   = require("express");
const router    = express.Router();
const User      = require("./UserModel");
const bcrypt    = require("bcryptjs");

router.get("/admin/users",
    (req, res) => {
        User.findAll({
            order: [['createdAt', 'DESC']]
        }).then(users => {
            res.render("admin/users/index", {users: users});
        });
    });

router.get("/admin/users/create", (req, res) => {
    res.render("admin/users/create");
}); 

router.post("/users/create", (req, res) => {
        var email    = req.body.email;
        var password = req.body.password;
        //res.json({email, password});

        User.findOne({
            where:{
                email: email
            }
        }).then( user => {
            if(user == undefined){
                var salt = bcrypt.genSaltSync(10);
                var hash = bcrypt.hashSync(password, salt);

                User.create({
                    email: email,
                    password: hash
                }).then(( ) => {
                    res.redirect("/adm/categories")
                }).catch((err) => {
                    res.send("Erro ao salvar novo usuário: " + err);
                });

            }else{
                res.send("Este email já está cadastrado!");
            }
        })
    });
    
    
router.get("/login", (req, res) => {
    res.render("admin/users/login");
}); 

router.post("/authenticate", (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({where: {email: email}}).then(user => {
        if(user != undefined){
            var correctPass = bcrypt.compareSync(password, user.password);
            if(correctPass){
                req.session.user = { 
                    id: user.id, 
                    email: user.email
                }
                res.redirect("/adm/articles");
            }else{
                res.send("Senha Incorreta");
            }
        }else{
            res.send("Este email não foi encontrado!");
        }
    })
}); 

module.exports = router;