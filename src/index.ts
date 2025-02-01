import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import quizRoutes from './routes/quiz.routes';
import analysisRoutes from './routes/analysis.routes';
import rankPrediction from './routes/rankPrediction.routes';
import historicalDataRoutes from './routes/historicalData.routes';
import NeetCollegeRoutes from './routes/neetPrediction.routes';
import collegeRoutes from './routes/college.routes';
dotenv.config();

const app: Application = express();
const port = process.env.PORT || 3000;
const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mydatabase';

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
};

app.get('/health', (req, res) => {
  res.status(200).json({
    server: 'running',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'not connected'
  });
});

app.use('/api', quizRoutes);
app.use('/api', analysisRoutes);
app.use('/api', rankPrediction);
app.use('/api', historicalDataRoutes);
app.use('/api', NeetCollegeRoutes);
app.use('/api/college', collegeRoutes);

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ status: 'error', message: err.message || 'Internal server error' });
});

const startServer = async () => {
  await connectDB();
  app.listen(port, () => console.log(`🚀 Server is running on port ${port}`));
};

startServer();

export default app;
