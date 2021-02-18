const express = require('express')
const server = express()
require('dotenv').config()
// 'pg' postgres
const Pool = require('pg').Pool //pool é pra manter a conexao ativa, pra nao ficar logando/deslogando
const db = new Pool({
    user: process.env.USER,
    password: process.env.PASSWORD,
    host: 'localhost',
    port: 5432,
    database: process.env.DATABASE
})

const query = `INSERT INTO donors ("name", "email", "blood") VALUES ($1, $2, $3)`

server.use(express.static('public'))

//habilitar body do formulario
server.use(express.urlencoded({ extended: true }))

const nunjucks = require('nunjucks') // usar javascript no HTML
nunjucks.configure("./", {
    express: server,
    noCache: true
})

server.post('/', (req, res) => {
    const { name, email, blood } = req.body

    if (name == "", email == "", blood == "") {
        return res.send("Todos os campos são obrigatórios")
    }
    const values = [name, email, blood]

    db.query(query, values, err => {
        if (err) return res.send("Erro ao inserir no banco")

        return res.redirect('/')
    })
})

server.get('/', (req, res) => {
    db.query("SELECT * FROM donors", (err, result) => {
        if(err) return res.send("Erro ao recuperar dados do banco")
      
        const donors = result.rows
        return res.render("index.html", { donors })
    })
})


server.listen(3000, () => console.log('server ativo'))