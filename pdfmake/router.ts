import express from 'express';
import { pdfController, puppeteerController } from './modules';

const router = express.Router();

router.post('/v1/generate-pdf', pdfController.generatePdf);
router.post('/v2/generate-pdf', pdfController.generatePdf2);
router.post('/v1/print-page-pdf', puppeteerController.printPage);

export default router