const Sequelize = require('sequelize');

const Connection = new Sequelize('Blog_Willian','root','root',{
    host    : 'localhost',
    dialect : 'mysql', 
    timezone: '-05:00'
});
module.exports = Connection;

