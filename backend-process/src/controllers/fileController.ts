import { Request, Response } from 'express';
import FileService from '../services/fileService';

class FileController {
    constructor(private fileService: FileService) {}

    async downloadPDF(req: Request, res: Response) {
        try {
            const pdfBuffer = await this.fileService.generatePDF();
            res.set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename="report.pdf"',
                'Content-Length': pdfBuffer.length
            });
            res.send(pdfBuffer);
        } catch (error) {
            res.status(500).send('Error generating PDF');
        }
    }

    async downloadPNG(req: Request, res: Response) {
        try {
            const pngBuffer = await this.fileService.generatePNG();
            res.set({
                'Content-Type': 'image/png',
                'Content-Disposition': 'attachment; filename="report.png"',
                'Content-Length': pngBuffer.length
            });
            res.send(pngBuffer);
        } catch (error) {
            res.status(500).send('Error generating PNG');
        }
    }
}

export default FileController;