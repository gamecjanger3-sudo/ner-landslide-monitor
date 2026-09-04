import express, { Request, Response } from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve __dirname when using ES modules ("type": "module" in package.json)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure Multer in-memory storage (prevents write errors on Render's read-only/ephemeral disk)
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB file size limit
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

      // Validate required text fields
      if (!title || !location || !description) {
        res.status(400).json({ error: 'Missing required report fields (title, location, description).' });
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
        latitude: latitude && !isNaN(Number(latitude)) ? Number(latitude) : null,
        longitude: longitude && !isNaN(Number(longitude)) ? Number(longitude) : null,
        attachmentsCount: uploadedFiles ? uploadedFiles.length : 0,
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
      res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
  }
);

// Serve built Vite frontend static files from the dist folder
app.use(express.static(path.join(__dirname, 'dist')));

// SPA Fallback: Return index.html for all non-API web routes
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});