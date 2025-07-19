import express from 'express';
import cors from 'cors';
import path from 'path';
import dashboardRoutes from './routes/dashboardRoutes';

// Create Express application
const app = express();

// Configure environment variables
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the data directory
app.use('/data', express.static(path.join(__dirname, 'data')));

// Routes
app.use('/api/dashboard', dashboardRoutes);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Dashboard API available at http://localhost:${PORT}/api/dashboard`);
});
