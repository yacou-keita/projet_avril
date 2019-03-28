const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const session = require('express-session');
const app = express();

const user = require('./routes/user');

const port = 8080;

//configuration de la base de données
const db = mysql.createConnection ({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'market'
});

//connexion à la base de données
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connecté à la base de données');
});
global.db = db;

//configuration du middleware
app.set('port', process.env.port || port);
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());
//app.use('/public/assets/css', express.static(__dirname+'/node_modules/bootstrap/dist/css'));
//app.use('/public/assets/js', express.static(__dirname+'/node_modules/bootstrap/dist/js'));
//app.use('/public/assets/js', express.static(__dirname+'/node_modules/jquery/dist'));
app.use(session({ secret: 'secret', resave: true, saveUninitialized: true/*, cookie: { maxAge: 60000 }*/ }));



//routes pour les vues
app.get('/', user.accueil);
app.get('/inscription', user.inscription);
app.post('/inscription', user.inscriptionPage);
app.get('/connexion', user.connexionPage);
app.get('/deconnexion', user.deconnexion);
app.post('/connexion', user.connexion);
app.get('/market', user.fruits);
app.get('/espace-administration', user.admin);
app.get('/ajouter-produit', user.ajouterProduit);
app.post('/ajouter-produit', user.ajouterProduitPost);
app.get('/voir/:id', user.view);

//port de l'application
app.listen(port, () => {
    console.log(`Port du serveur: ${port}`);
});