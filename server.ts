import 'dotenv/config';
import express, { Request, Response } from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

import authRouter from './server/authRoutes.js';
import { initializePostgres } from './server/postgresDb.js';

// Resolve __dirname when using ES modules ("type": "module" in package.json)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(helmet());
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Authentication API
app.use('/api/auth', authRouter);

// Configure Multer in-memory storage
// Prevents write errors on Render's ephemeral disk
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
});

const reportsStore: any[] = [];

// API Route: Get all reports
app.get('/api/reports', (req: Request, res: Response) => {
  res.status(200).json({
    count: reportsStore.length,
    reports: reportsStore,
  });
});

// API Route: Submit new report
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

app.use(express.static(path.resolve(__dirname, 'dist')));

app.get('/{*path}', (req: Request, res: Response) => {
  if (req.path.startsWith('/api')) {
    res.status(404).json({
      error: 'API endpoint not found',
    });
    return;
  }

  res.sendFile(
    path.resolve(__dirname, 'dist', 'index.html'),
  );
});

const PORT = Number(process.env.PORT) || 5000;

// Initialize PostgreSQL before starting the server
initializePostgres()
  .then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error(
      'Failed to initialize PostgreSQL:',
      error,
    );
    process.exit(1);
  });