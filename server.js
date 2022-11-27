let express = require('express');
let path = require("path");
let mysql = require("mysql");
const { isBuffer } = require('util');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { request, response } = require('express');
let cookieParser = require('cookie-parser');
let cookie = require('cookie-parser')


let app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cookie())


//CONNECT DATABASE
let connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root1234",
    database: 'web_midterm',
    multipleStatements: true
})

connection.connect((error) => {
    if (error) {
        throw error
    } else {
        console.log("MySQL Database is connected Successfully")
    }
})

app.get("/", function (request, response) {
    response.sendFile(path.join(__dirname + '/view/index.html'))
})

app.get('/checkLogin', async (request, response) => {
    try {
        if (request.cookies.userRegisterd) {
            const decode = jwt.verify(request.cookies.userRegisterd, 'webmidterm-123#@%');
            connection.query("SELECT * FROM User WHERE username = ?", [decode.username], (err, res) => {
                if (err) throw err;
                if (res[0]) {
                    response.json({ loggedIn: true, data: res[0] });
                } else {
                    response.json({ loggedIn: false })

                }
            })
        } else {
            response.json({ loggedIn: false })
        }
    } catch (err) {
        if (err) throw err
    }
})

app.get('/getstate', async (request, response) => {
    const decode = jwt.verify(request.cookies.userRegisterd, 'webmidterm-123#@%');
    connection.query("SELECT * FROM User where username = ?", [decode.username], (err, res) => {
        if (err) throw err;
        response.json({
            status: true,
            level: res[0].level,
            life: res[0].state,
            score: res[0].score,
        })
    })
})

app.post("/signup", async (request, response, next) => {
    var userName = request.body.username;
    // console.log(request.body.password);
    connection.query("SELECT * FROM User where username = ?", [userName], async (err, res) => {
        if (err) throw err;
        if (res[0]) {
            response.json({ status: false })
        } else {
            var password = request.body.password;
            const Hpassword = await bcrypt.hash(password, 8);
            connection.query("INSERT INTO User VALUES (?, ?, 0, 0, 0)", [userName, Hpassword], (err, res) => {
                if (err) throw err;
                const token = jwt.sign({ username: userName }, 'webmidterm-123#@%', {
                    expiresIn: '90d'
                })
                const cookieOptions = {
                    expiresIn: new Date(Date.now() + 90 + 24 + 60 + 60 + 1000),
                    httpOnly: true
                }
                response.cookie("userRegisterd", token, cookieOptions);
                response.json({ status: true })
            })
        }
    })
})

app.post("/signin", async (request, response, next) => {
    var { username, password } = request.body;
    connection.query("SELECT * FRoM User where username = ?", [username], async (err, res) => {
        if (err) throw err;
        if (!res.length || !await bcrypt.compare(password, res[0].password)) {
            response.json({
                status: false
            })
        } else {
            const token = jwt.sign({ username: username }, 'webmidterm-123#@%', {
                expiresIn: '90d'
            })
            const cookieOptions = {
                expiresIn: new Date(Date.now() + 90 + 24 + 60 + 60 + 1000),
                httpOnly: true
            }
            response.cookie("userRegisterd", token, cookieOptions);
            response.json({ status: true, data: res[0] })
        }
    })
})

app.get('/logout', async (request, response, next) => {
    response.clearCookie('userRegisterd');
    response.json({ status: true })
})

app.post('/updateLevle', async (request, response, next) => {
    let query = 'update User set level = ?, score = ? where username = ?'
    const decode = jwt.verify(request.cookies.userRegisterd, 'webmidterm-123#@%');
    connection.query(query, [request.body.level, request.body.score, decode.username], (err, res) => {
        if (err) throw err;
        response.json({ status: true })
    })
})

app.post('/updatelife', async (request, response, next) => {
    let query = 'update User set state = state-1 where username = ?'
    const decode = jwt.verify(request.cookies.userRegisterd, 'webmidterm-123#@%');
    connection.query(query, [decode.username], (err, res) => {
        if (err) throw err;
        response.json({ status: true })
    })
})

app.post('/newGame', async (request, response, next) => {
    const decode = jwt.verify(request.cookies.userRegisterd, 'webmidterm-123#@%');
    connection.query('SELECT * FROM User WHERE username = ?', [decode.username], (err, res) => {
        //IF USER WAS PLAYING GAME SAVE THEIR HISTORY
        if (res[0].level > 0) {
            let level = res[0].level;
            let state = res[0].state;
            let score = res[0].score;
            connection.query("insert into history (username, date, level, state, score) values (?, NOW(), ?, ?, ?)", [decode.username, level, state, score], (err, res) => {
                if (err) throw err
            })
        }
        connection.query('update User set level = 1, state = 5 where username = ?', [decode.username], (err, res) => {
            if (err) throw err;
            response.json({ status: true })
        })
    })
})

app.post('/recordhistory', async (request, response, next) => {
    const decode = jwt.verify(request.cookies.userRegisterd, 'webmidterm-123#@%');
    connection.query("insert into history (username, date, level, state, score) values (?, NOW(), ?, ?, ?); update User set level = 0, state = 0, score = 0 where username = ?;", [decode.username, request.body.level, request.body.state, request.body.score, decode.username], (err, res) => {
        if (err) throw err
        response.json({ status: true });
    })
})

app.post('/changePass', (request, response, next) => {
    let oldPass = request.body.oldpass;
    const decode = jwt.verify(request.cookies.userRegisterd, 'webmidterm-123#@%');
    connection.query('SELECT * FROM User WHERE username = ?', [decode.username], async (err, res) => {
        if (!await bcrypt.compare(oldPass, res[0].password)) {
            response.json({ status: false })
        } else {
            let newPass = request.body.newpass;
            const Hpassword = await bcrypt.hash(newPass, 8);
            connection.query('update User set password = ? where username = ?', [Hpassword, decode.username], (err, res) => {
                response.json({ status: true })
            })
        }
    })
})

app.post('/forgotPass', (request, response, next) => {
    let username = request.body.username;
    let newpass = request.body.newpass;

    connection.query('SELECT * FROM User WHERE username = ?', [username], async (err, res) => {
        if (err) throw err;
        if (!res[0]) {
            response.json({ status: false })
        } else {
            const Hpassword = await bcrypt.hash(newpass, 8);
            connection.query('update User set password = ? where username = ?', [Hpassword, username], (err, res) => {
                response.json({ status: true })
            })
        }
    })
})


app.listen(3000, () => {
    console.log("Server started on port 3000");
});