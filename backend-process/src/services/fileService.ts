import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { JSDOM } from 'jsdom';

class FileService {
    constructor(private basePath: string) {}

    async generatePDF(): Promise<Buffer> {
        const doc = new jsPDF();

        // Add header with logo-like design
        doc.setFillColor(240, 165, 0);
        doc.rect(0, 0, doc.internal.pageSize.width, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.text('Financial Report', doc.internal.pageSize.width / 2, 25, { align: 'center' });

        // Add date
        doc.setTextColor(100, 100, 100);
        doc.setFontSize(12);
        doc.text(new Date().toLocaleDateString(), 20, 50);

        // Add summary box
        doc.setDrawColor(240, 165, 0);
        doc.setLineWidth(0.5);
        doc.rect(20, 60, 170, 40);

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(14);
        doc.text('Summary', 25, 70);
        doc.setFontSize(12);
        doc.text(`Total Income: 1000 T`, 25, 80);
        doc.text(`Total Expenses: 500 T`, 25, 90);
        const balance = 1000 - 500;
        doc.setTextColor(balance >= 0 ? 0 : 255, balance >= 0 ? 100 : 0, 0);
        doc.text(`Balance: ${balance} T`, 25, 100);

        // Create income table with better styling
        const incomeTableData = [['Salary', '1000 T']];
        let finalY = 0;
        autoTable(doc, {
            didDrawPage: (data) => {
                if (data.cursor) {
                    finalY = data.cursor.y;
                }
            },
            startY: 120,
            head: [['Income Source', 'Amount']],
            body: incomeTableData,
            theme: 'grid',
            headStyles: {
                fillColor: [240, 165, 0],
                textColor: [255, 255, 255],
                fontSize: 12,
                fontStyle: 'bold'
            },
            styles: {
                fontSize: 11,
                cellPadding: 5
            },
            alternateRowStyles: {
                fillColor: [252, 242, 220]
            }
        });
        
        // Create expense table with better styling
        const expenseTableData = [['Rent', '500 T']];
        const expenseTable = autoTable(doc, {
            startY: finalY + 20,
            head: [['Expense Category', 'Amount']],
            body: expenseTableData,
            theme: 'grid',
            headStyles: {
                fillColor: [255, 68, 68],
                textColor: [255, 255, 255],
                fontSize: 12,
                fontStyle: 'bold'
            },
            styles: {
                fontSize: 11,
                cellPadding: 5
            },
            alternateRowStyles: {
                fillColor: [255, 230, 230]
            }
        });

        // Add footer
        const pageCount = doc.getNumberOfPages();
        doc.setFontSize(10);
        doc.setTextColor(150, 150, 150);
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, { align: 'center' });
        }

        const pdfBuffer = doc.output('arraybuffer');
        return Buffer.from(pdfBuffer);
    }

    async generatePNG(): Promise<Buffer> {
        const dom = new JSDOM(`<!DOCTYPE html><html><body><div id="content">Generated PNG</div></body></html>`);
        const element = dom.window.document.getElementById('content');

        if (!element) {
            throw new Error('Element not found');
        }

        const canvas = await html2canvas(element);
        const pngDataUrl = canvas.toDataURL('image/png');
        const pngBuffer = Buffer.from(pngDataUrl.split(',')[1], 'base64');

        return pngBuffer;
    }
}

export default FileService;