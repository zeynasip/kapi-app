const express = require('express');
const mysql = require('mysql');

const app = express();

const con = mysql.createConnection({
    host: '104.197.149.181',
    user: 'root',
    password: 'admin1234',
    database: 'db',
});

app.use(express.json());

app.post('/', function(request, response){
    const message = request.body.message;
    
    if (message == "login") {
        const pNum = request.body.pNum;
        const password = request.body.password;
        con.connect(function(err) {
            if (err) throw err;
            con.query("SELECT * FROM people", function (err, result) {
                if (err) throw err;
                Object.keys(result).forEach(function(key) {
                    var row = result[key];
                    if (row.pNum == pNum && password == row.password) {
                        response.send({
                            message: "1",
                            pNum: row.pNum,
                            password: row.password,
                            name: row.name,
                            surname: row.surname,
                            role: row.role,
                            permission: row.permission
                        });
                    }
                });
                response.send({ message: "0" });
            });
        });
    }

    if (message == "createUser") {
        let values = [[request.body.pNum, request.body.password, request.body.name, request.body.surname, request.body.role, request.body.permission]];
        let sql = "INSERT INTO people (pNum, password, name, surname, role, permission) VALUES ?";
        con.connect(function(err) {
            if (err) throw err;
            con.query(sql, [values], function (err, result) {
                if (err) throw err;
                response.send({ message: "Kullanıcı oluşturuldu.." })
            });
        });
    }

    if (message == "permission") {
        const pNum = request.body.pNum;
        con.connect(function(err) {
            if (err) throw err;
            con.query("UPDATE people SET permission=1 WHERE pNum=?", [pNum], function (err, result) {
                if (err) throw err;
                response.send({ message: "Yetkilendirme başarılı.."});
            });
        });
    }
});
con.end();

module.exports = app;