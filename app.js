require('dotenv').config();
require('express-async-errors');
const express = require('express');
const connectDB = require('./db/connect');
const productRouter = require('./routes/products');

const app = express();

const errorHandlerMilddleware = require('./middleware/error-handler');
const notFoundHandlerMilddleware = require('./middleware/not-found');

// middleware
app.use(express.json());

// Routes
app.get('/', (req, res, next) => {
  res.send('<h1>Store API</h1><a href="/api/v1/products">products routes</a>');
  next();
});

app.use('/api/v1/products', productRouter);

app.use(errorHandlerMilddleware);
app.use(notFoundHandlerMilddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    // Connection to DB
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => console.log(`Server running on port:${port}`));
  } catch (err) {
    console.log(err);
  }
};

start();
