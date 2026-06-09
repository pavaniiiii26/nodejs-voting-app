import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import bodyParser from 'body-parser';
import './db.js';


// Import routes
import userRoutes from './routes/userRoutes.js';
import candidateRoutes from './routes/candidateRoutes.js';

const app = express();

app.use(express.json());

// Routes
app.use('/user', userRoutes);
app.use('/candidate', candidateRoutes);

app.get('/', (req, res) => {
  res.send('Server Running Successfully');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});