/**
 * Load .env
 */
require('dotenv').config();

/**
 * IMPORTS
 */
const express = require('express');
const app = express();
const path = require('path');  
const morgan = require('morgan');
const BodyParser = require('body-parser');
const mongoose = require('mongoose');
const deliveriesRoutes = require('./routes/v1/deliveries');

/**
 * LISTEN
 */
if(process.env.ENV === 'PROD'){
    let port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`[Express] Routeasy case está online na porta: ${port}`);
    }); 
}

/**
 * Database connection
 */
mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {useNewUrlParser: true});

/**
 * Connection callback
 */
mongoose.connection.on('connected', () => {
    console.log(`[MongoDB] Routeasy case conectou com sucesso: ${process.env.MONGODB_CONNECTION_STRING}`);
});

/**
 * Debug
 */
app.use(morgan('dev'));

/**
 * STATIC
 */
app.use('/img',express.static(path.join(__dirname, 'public/img')));
app.use('/js',express.static(path.join(__dirname, 'public/js')));
app.use('/css',express.static(path.join(__dirname, 'public/css')));

/**
 * INDEX
 */
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/index.html'));
}); 

/**
 * Parse JSON
 */
app.use(BodyParser.urlencoded({extended: true}));
app.use(BodyParser.json());

/**
 * CORS
 */
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", process.env.ENV === 'PROD' ? process.env.CLIENT_URL_PROD : process.env.CLIENT_URL_DEV);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-csrf-token");
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});

app.options("/*", (req, res, next) => {
    res.header('Access-Control-Allow-Origin', process.env.ENV === 'PROD' ? process.env.CLIENT_URL_PROD : process.env.CLIENT_URL_DEV);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, x-csrf-token');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.sendStatus(200);
});
/**
 * ROUTES
 */
app.use('/api/v1/deliveries', deliveriesRoutes);

/**
 * Parsing Errors
 */
app.use((req, res, next) => {
    let error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;