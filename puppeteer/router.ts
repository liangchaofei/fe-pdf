import express from "express";
import { puppeteerController } from "./modules";

const router = express.Router();

router.post("/v1/print-page-pdf", puppeteerController.printPage);

export default router;
