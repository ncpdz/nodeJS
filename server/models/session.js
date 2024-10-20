const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const sequelize = require('./connectDB'); 

const store = new SequelizeStore({
    db: sequelize,
});

const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET || 'your_secret_key', 
    store: store,
    resave: false,
    saveUninitialized: false, 
    cookie: {
        maxAge: 30 * 60 * 1000,
        secure: false,
    },
});

store.sync(); 

module.exports = sessionMiddleware;
