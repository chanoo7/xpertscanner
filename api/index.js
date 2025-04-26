const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const { sequelize } = require('./models/index');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());



// Fix: Remove conflicting manual CORS headers
// const allowedOrigins = ['http://localhost:3000', 'http://192.168.0.105:3000'];

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
//         callback(null, true);
//       } else {
//         callback(new Error('Not allowed by CORS'));
//       }
//     },
//     credentials: true,
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
//   })
// );
app.set('trust proxy', true);
const allowedOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://192.168.0.105:3000', 'http://192.168.1.12:3000'];
app.use(cors({
  origin: function(origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {  // Allow localhost without origin in dev
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Enable credentials to send cookies
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
}));


app.options('*', cors());


app.use('/auth', require('./auth/auth.controller'));
app.use('/product', require('./product/product.controller'));


// Fix: Correct `app.listen` syntax
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
    console.log(`Server running on http://localhost:${PORT}`);

    try {
      await sequelize.authenticate();
      console.log('Database connected successfully.');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
});
