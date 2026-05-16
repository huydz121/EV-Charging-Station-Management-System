const express = require('express');
const connectDB = require('./config/database');
const config = require('./config/index');

const app = express();

// Connect to MongoDB
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('EV Charging System API is running...');
});

const PORT = config.port || 3000;
app.listen(PORT, () => {
  console.log(`? Server running on http://localhost:`);
});
