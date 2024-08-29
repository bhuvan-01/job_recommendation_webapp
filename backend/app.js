require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const jobRoutes = require('./routes/job');
const userRoutes = require('./routes/user');
const companyRoutes = require('./routes/company');
const applicationRoutes = require('./routes/application');
const connectDB = require('./config/db');
const path = require('path');
const socketIo = require('socket.io');
const http = require('http');
const chalk = require('chalk');
const adminRoutes = require('./routes/admin');
const adminJobRoutes = require('./routes/adminJobRoutes'); 
const newsletterRoutes = require('./routes/newsLetter');
const contactRoutes = require('./routes/contact')



const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
  },
});
const port = process.env.PORT || 5000;
app.set('io', io);
app.use((req, res, next) => {
  req.io = io;
  next();
});

// middlewares
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cors());
app.use(morgan('dev'));

// connect DB
connectDB();

// routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/users', userRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/admin', adminRoutes);
app.use('/api/admin/jobs', adminJobRoutes);
app.use('/api', newsletterRoutes);
app.use('/api', contactRoutes);


//chalk configs
const error = chalk.red;
const success = chalk.green;

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('setup', (userData) => {
    socket.join(userData?.userId);
    console.log(chalk.bgGreen(`User ${userData?.userId} connected\n`));
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(port, () => {
  console.log(chalk.bgBlue(`Server listening on http://localhost:${port}`));
});

const sendNotification = (userId, notification) => {
  console.log(userId, notification);
  io.to(userId).emit('notification', notification);
};

module.exports = { sendNotification };
