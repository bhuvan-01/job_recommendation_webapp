const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const jobRoutes = require('./routes/job');
const userRoutes = require('./routes/user');
const companyRoutes = require('./routes/company');
const connectDB = require('./config/db');
const path = require('path');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middlewares
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cors());

// connect DB
connectDB();

// routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/users', userRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
