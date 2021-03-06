const express = require('express');
var bodyParser = require('body-parser');
const path = require('path');
const mysql = require('mysql');
const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


var db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: ''    ,
    database: 'trello'
});

db.connect(function (error) {
    if (error) console.log(error)
})

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

const BOARDS_TABLE = 'boards';
const CATALOG_TABLE = 'catalog';
const TASKS_TABLE = 'taskscollection';

const qrBoard = `CREATE TABLE IF NOT EXISTS ${BOARDS_TABLE} (id int NOT NULL, orders int NOT NULL, title CHAR(130) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL, PRIMARY KEY (id))`;
const qrCatalog = `CREATE TABLE IF NOT EXISTS ${CATALOG_TABLE} (id int NOT NULL, title CHAR(130) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL, board int)`;
const qrTasks = `CREATE TABLE IF NOT EXISTS ${TASKS_TABLE} (id int, board int, catalog int, title VARCHAR(120) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL, isComplited VARCHAR(15))`;
db.query(qrBoard);
db.query(qrCatalog, (err) => {
    console.log(err)
});
db.query(qrTasks);

app.get('/boards', function (req, res) {
    const query = `SELECT * from ${BOARDS_TABLE}`;
    db.query(query, function (error, resp) {
        res.status(200)
        res.send(resp)
    })
});

app.post('/boards', function (req, res) {
    if (req.originalUrl === '/boards') {
        const data = req.body;
        console.log(req.body);
        const query = `INSERT INTO ${BOARDS_TABLE} (title, id, orders) VALUES ('${data.title}', '${data.id}', ${data.order})`
        db.query(query, function (error, rows, fields) {
            res.status(200);
            res.send(data)
        })
    }
});

app.post('/setboards', function (req, res) {
    const data = req.body;
    const removeQuery = `DELETE from ${BOARDS_TABLE}`;

    db.query(removeQuery, () => {
        data.forEach((el) => {
            const qr = `INSERT INTO ${BOARDS_TABLE} (title, id, orders) VALUES ('${el.title}', '${el.id}', '${el.order}')`;
            db.query(qr)
        });
    });
});

app.delete('/boards', function (req, response) {
    const boardId = req.body['id'];
    deleteBoard(boardId);
    deleteBoardCatalogs(boardId);

    function deleteBoardCatalogs (id) {
        db.query(`DELETE FROM catalog WHERE board = ${id}`)
        db.query(`DELETE FROM taskscollection WHERE board = ${id}`)
    }

    function deleteBoard (id) {
        db.query(`SELECT * FROM ${BOARDS_TABLE}`, function (error, res) {
            res.forEach((board) => {
                if (board.id === id) {
                    const sql = `DELETE FROM ${BOARDS_TABLE} WHERE id = ${id}`;
                    db.query(sql)
                }
            })
        })
    }
    response.status(200)
});

// CATALOG

app.get('/catalog', function (req, res) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    const boardId = req.query.boardId;
    const qeeryTasks = `SELECT * FROM ${TASKS_TABLE} WHERE board = ${+boardId}`;
    const query = `SELECT *  FROM catalog WHERE board = ${+boardId}`;
    db.query(query, function(error, success) {
        if (success) {
            const resultData = [...success];
            db.query(qeeryTasks, function (er, tasks) {
                resultData.map((catalog) => {
                    catalog.tasks = [];
                    tasks && tasks.forEach((task) => {
                        if (+task.catalog === +catalog.id) {
                            catalog.tasks.push(task)
                        }
                    })
                });
                res.status(200);
                res.send(resultData)
            })
        } else {
            res.status(400);
            res.send(error)
        }
    })
});

app.post('/catalog', function (req, res) {
    if (req.originalUrl === '/catalog') {
        const data = req.body;
            const query = `INSERT INTO catalog (id, title, board) VALUES (${data.id}, '${data.title}', '${data.boardId}')`
            db.query(query, function (er, suc) {
                if (!er) {
                    res.status(200);
                    res.send(data)
                } else {
                    res.status(401);
                    res.send(er)
                }
            })
        }
});

app.delete('/catalog', function (req, res) {
    const {boardId, catalogId} = req.body;
    const qrCatalog = `DELETE FROM ${CATALOG_TABLE} WHERE board = ${boardId} AND id = ${catalogId}`;
    const qrTasks = `DELETE FROM ${TASKS_TABLE} WHERE board = ${boardId} AND catalog = ${catalogId}`;
    db.query(qrCatalog, function(err, data) {
        if (!err) {
            db.query(qrTasks);
            res.status(200);
            res.send(data)
        }
    });

});

app.post('/tasks', function (req, res) {
    const allTasks = req.body.data;
    const boardId = req.body.boardId;
    const query = 'SELECT * from taskscollection';

    db.query(`DELETE FROM ${TASKS_TABLE} WHERE board = ${boardId}`, (err, suc) => {
        allTasks.forEach((task) => {
            db.query(`INSERT INTO taskscollection (id, board, catalog, title, isComplited) VALUES ('${task.id})', '${boardId}', '${task.catalog}', '${task.title}', '${task.isComplited}')`, function (error) {
              console.log(error)
            })
        })
    });

    db.query(query, function (er, suc) {
        res.status(200);
        res.send(suc)
    })
});

// TASKS


express.static(path.join(__dirname, 'client/build'))
app.listen(3001, function () {
    console.log('Its okay')
});