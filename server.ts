import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

import authRouter from './server/authRoutes.js';
import { initializePostgres } from './server/postgresDb.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// 1. Configure CORS
const allowedCorsMiddleware = cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (origin.includes('vercel.app') || origin.includes('localhost')) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});

app.use(allowedCorsMiddleware);

// Express 5 Fix: Use named parameter '{*path}' instead of raw '*'
app.options('/{*path}', allowedCorsMiddleware);

// 2. Security Headers & Body Parsers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Root & Health Check Routes
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'Backend server is active' });
});

app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// 4. API Routes
app.use('/api/auth', authRouter);

// Configure Multer in-memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
});

const reportsStore: any[] = [];

app.get('/api/reports', (req: Request, res: Response) => {
  res.status(200).json({
    count: reportsStore.length,
    reports: reportsStore,
  });
});

app.post(
  '/api/reports',
  upload.array('attachments'),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        title,
        location,
        category,
        severity,
        description,
        reporterName,
        reporterContact,
        latitude,
        longitude,
      } = req.body;

      if (!title || !location || !description) {
        res.status(400).json({
          error:
            'Missing required report fields (title, location, description).',
        });
        return;
      }

      const uploadedFiles = req.files as Express.Multer.File[] | undefined;

      const newReport = {
        id: `report_${Date.now()}`,
        title,
        location,
        category: category || 'Landslide',
        severity: severity || 'high',
        description,
        reporterName: reporterName || null,
        reporterContact: reporterContact || null,
        latitude:
          latitude && !isNaN(Number(latitude))
            ? Number(latitude)
            : null,
        longitude:
          longitude && !isNaN(Number(longitude))
            ? Number(longitude)
            : null,
        attachmentsCount: uploadedFiles
          ? uploadedFiles.length
          : 0,
        createdAt: new Date().toISOString(),
      };

      reportsStore.push(newReport);

      res.status(201).json({
        success: true,
        message: 'Incident report submitted successfully',
        report: newReport,
      });
    } catch (error: any) {
      console.error('Error handling report submission:', error);
      res.status(500).json({
        error: error.message || 'Internal Server Error',
      });
    }
  },
);

// Express 5 Fix: Use '{*path}' syntax for catch-all API and static routes
app.use('/api/{*path}', (req: Request, res: Response) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

app.use(express.static(path.resolve(__dirname, 'dist')));

app.get('/{*path}', (req: Request, res: Response) => {
  const indexPath = path.resolve(__dirname, 'dist', 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(200).json({ status: 'ok', message: 'API Server is running.' });
    }
  });
});

const PORT = Number(process.env.PORT) || 5000;

console.log('Connecting to PostgreSQL database...');
initializePostgres()
  .then(() => {
    console.log('PostgreSQL initialized successfully.');
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to initialize PostgreSQL:', error);
    process.exit(1);
  });