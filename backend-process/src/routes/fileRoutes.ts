import { Router, Application } from 'express';
import FileController from '../controllers/fileController';
import FileService from '../services/fileService';

const router = Router();
const fileService = new FileService(__dirname); // Provide the basePath argument
const fileController = new FileController(fileService);

router.get('/download/pdf', fileController.downloadPDF.bind(fileController));
router.get('/download/png', fileController.downloadPNG.bind(fileController));

export const setFileRoutes = (app: Application) => {
    app.use('/files', router);
};