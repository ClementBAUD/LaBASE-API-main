let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
const sequelize = require('./src/db/sequelize');
const fileUpload = require('express-fileupload');
const cors = require('cors');
// const { dabaseconnexion } = require("./src/db/connexion.mongo");
// const mongoose = require('mongoose');
// const webpush = require('web-push');

const favicon = require('serve-favicon');

let indexRouter = require('./src/routes/index');
let usersRouter = require('./src/routes/users');
let magasinRouter = require('./src/routes/magasin');
let ProduitMiseDispo = require('./src/routes/produitdispo')
let Commandes = require('./src/routes/commande');
let imagesRoutes = require('./src/routes/images');
let ProduitRoutes = require('./src/routes/produits');
let listcommande = require('./src/routes/liste.commande');

let FamilleRoutes = require('./src/routes/famille');
let statutcompt = require('./src/routes/statutcompte')

let statutcommande = require('./src/routes/statutcommande')
let notification = require('./src/routes/notification')

let message = require('./src/routes/messages')

//console.log(webpush.generateVAPIDKeys())

let parametre= require('./src/routes/params')

let app = express();
//connexion mogodb
/*  mongoose.connect(dabaseconnexion(), { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Database connection')
    })
    .catch(err => {
        console.log(err)
    })  */

//connexion mysql 
sequelize.initDb();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(function(req, res, next) {
    let allowedOrigins = ['*']; // list of url-s
    let origin = req.headers.origin;
    if (allowedOrigins.indexOf(origin) > -1) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.header("Access-Control-Allow-Methods", "DELETE, POST, GET,PUT, OPTIONS")
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Expose-Headers', 'Content-Disposition');
    next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.use(favicon(__dirname + '/favicon.png'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
}));




// header 
global.__basedir = __dirname;
app.get('/', (req, res) => {
    res.json('Bienvenue sur La B.A.S.E! 👋')
})

app.use('/api/v1/', indexRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/magasin', magasinRouter);
app.use('/api/v1/Produit_dispo', ProduitMiseDispo);
app.use('/api/v1/commande', Commandes);
app.use('/api/v1/images', imagesRoutes);
app.use('/api/v1/produit', ProduitRoutes);
app.use('/api/v1/famille', FamilleRoutes);
app.use('/api/v1/listcommande', listcommande);

app.use('/api/v1/statutcompt', statutcompt);
app.use('/api/v1/statutcommande', statutcommande);
app.use('/api/v1/notification', notification);
app.use('/api/v1/parametre', parametre);
app.use('/api/v1/message', message);





//Commandes
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});



module.exports = app;