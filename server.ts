import express, { Request, Response } from 'express';
import cors from 'cors';
import multer from 'multer';

const app = express();

// Enable CORS for all incoming requests (Vercel, Localhost, etc.)
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure Multer in memory to prevent write issues on Render's ephemeral filesystem
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB file size limit
});

// In-memory reports data store
const reportsStore: any[] = [];

// GET /api/reports - Retrieve all reported incidents
app.get('/api/reports', (req: Request, res: Response) => {
  res.status(200).json({
    count: reportsStore.length,
    reports: reportsStore,
  });
});

// POST /api/reports - Endpoint receiving FormData from Reports.tsx
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

      const uploadedFiles = req.files as Express.Multer.File[] | undefined;

      const newReport = {
        id: `report_${Date.now()}`,
        title,
        location,
        category,
        severity,
        description,
        reporterName: reporterName || null,
        reporterContact: reporterContact || null,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
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

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});