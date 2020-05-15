//configurando o servidor
const express = require("express")
const server = express()

//configurar servidor para arquivo estaticos
server.use(express.static('public'))

//habilitar body do form
server.use(express.urlencoded({ extended: true}))

//configurar conexão banco de dados
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password:'toor',
    host: 'localhost',
    port: 5432,
    database: 'doe'
})

//configurando a template engine
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express: server,
    noCache: true,
})


//configurar apresentação da pagina
server.get("/", function(req, res) {
    db.query("SELECT * FROM donors", function(err, result){
        if (err) return res.send("Erro de Banco de dados.")
    
        const donors = result.rows
        return res.render("index.html", { donors })
    })
})

server.post("/", function(req, res) {
    //pegar dados do form
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if (name == "" || email == "" || blood == "") {
        return res.send("Todos os campos são obrigatórios")
    }

    // add valor dentro do banco de dados
    const query =  `
        INSERT INTO donors ("name", "email", "blood") 
        VALUES ($1, $2, $3)`
    
    const values = [name, email, blood]
    
    db.query(query, values, function(err){
        if (err) return res.send("Erro no Banco de dados.")

        return res.redirect("/")
    })


})

//ligar server e permitir acesso na porta 3000
server.listen(3000, function() {
    console.log("Server Iniciado.")
})