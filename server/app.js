const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override'); 
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product');
const userRoutes = require("./routes/user"); 
const path = require('path');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors'); 
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const sequelize = require('./models/connectDB');
require('dotenv').config();
const apiProductRoutes = require("./routes/api/apiProduct");
const apiUserRoutes = require('./routes/api/apiUser'); 
const authMiddleware = require("./middleware/auth");
const setUsernameMiddleware = require("./middleware/setUsername"); 
const apiCartRoutes = require("./routes/api/apiCart");

const app = express();

const store = new SequelizeStore({
    db: sequelize,
});

app.set("trust proxy", 1);

app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(helmet({
  crossOriginResourcePolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      baseUri: ["'self'"],
      fontSrc: ["'self'", 'https:', 'data:'],
      formAction: ["'self'", 'http://localhost:3000', 'http://localhost:5173/'],
      frameAncestors: ["'self'"],
      imgSrc: ["'self'", 'data:'],
      objectSrc: ["'none'"],
      scriptSrc: ["'self'"],
      scriptSrcAttr: ["'none'"],
      styleSrc: ["'self'", 'https:', "'unsafe-inline'"],
      upgradeInsecureRequests: [],
    },
  },
}));

app.use(morgan('dev'));

app.use(express.static("public"));
app.use(methodOverride('_method'));

app.use(
  "/bootstrap/css",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/css"))
);
app.use(
  "/bootstrap/js",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/js"))
);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 

app.use(session({
    secret: process.env.SESSION_SECRET || 'your_secret_key', 
    store: store,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 30 * 60 * 1000, 
        secure: false, 
        httpOnly: true, 
    },
}));

app.use(setUsernameMiddleware);

store.sync(); 

app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/categories', categoryRoutes);
app.use('/products', productRoutes);
app.use('/users', userRoutes);
app.use("/v1/api/products", apiProductRoutes);
app.use('/api/user', apiUserRoutes);
app.use("/v1/api/cart", apiCartRoutes);

app.get('/', (req, res) => {
    res.redirect('/users/login');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, async () => {
    console.log(`Server đang chạy trên cổng ${PORT}.`);
    try {
        await sequelize.authenticate();
        console.log('Kết nối với cơ sở dữ liệu thành công.');
    } catch (error) {
        console.error('Không thể kết nối với cơ sở dữ liệu:', error);
    }
});

process.on('SIGTERM', () => {
    server.close(() => {
        console.log('Server closed');
    });
});
