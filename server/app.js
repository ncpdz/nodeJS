const express = require("express");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const userRoutes = require("./routes/user");
const path = require("path");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const sequelize = require("./models/connectDB");
require("dotenv").config();
const apiProductRoutes = require("./routes/api/apiProduct");
const apiUserRoutes = require("./routes/api/apiUser");
const authMiddleware = require("./middleware/auth");
const setUsernameMiddleware = require("./middleware/setUsername");
const apiCartRoutes = require("./routes/api/apiCart");

const app = express();

const store = new SequelizeStore({
  db: sequelize,
});

app.set("trust proxy", 1);

app.use(
  cors({
    origin: "http://localhost:5173", // Adjust this to your front-end URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Allow credentials (cookies) to be sent
  })
);

app.use(
  helmet({
    crossOriginResourcePolicy: false,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        baseUri: ["'self'"],
        fontSrc: ["'self'", "https:", "data:"],
        formAction: [
          "'self'",
          "http://localhost:3000",
          "http://localhost:5173/",
        ],
        frameAncestors: ["'self'"],
        imgSrc: ["'self'", "data:"],
        objectSrc: ["'none'"],
        scriptSrc: ["'self'"],
        scriptSrcAttr: ["'none'"],
        styleSrc: ["'self'", "https:", "'unsafe-inline'"],
        upgradeInsecureRequests: [],
      },
    },
  })
);

app.use(morgan("dev"));

app.use(express.static("public"));
app.use(methodOverride("_method"));

app.use(
  "/bootstrap/css",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/css"))
);
app.use(
  "/bootstrap/js",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/js"))
);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use(
//   session({
//     secret: "some_secure_random_string",
//     store: store,
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       maxAge: 30 * 60 * 1000,
//       secure: false,
//       httpOnly: true,
//     },
//   })
// );

app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } 
}));

app.use(setUsernameMiddleware);

store.sync();

app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));
app.use(express.static(path.join(__dirname, "public")));

app.use("/categories", categoryRoutes);
app.use("/products", productRoutes);
app.use("/users", userRoutes);
app.use("/api/products", apiProductRoutes);
app.use("/api/user", apiUserRoutes);
app.use("/api/cart", apiCartRoutes);

app.get("/", (req, res) => {
  res.redirect("/users/login");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}.`);
  try {
    await sequelize.authenticate();
    console.log("Database connection established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
});

process.on("SIGTERM", () => {
  server.close(() => {
    console.log("Server closed");
  });
});
