import PdfPrinter from "pdfmake";
import fs from 'fs';
import { documentSchema } from "../zod";
import { safeEvalAssign } from "../lib/safe";
import { processImageURL } from "../lib/processImageURL";
function generatePdf(req, res) {
    var fonts = {
        // ...字体定义...
        Roboto: {
            normal: 'fonts/alibaba.ttf',
            bold: 'fonts/alibaba-bold.ttf',
            italics: 'fonts/alibaba.ttf',
            bolditalics: 'fonts/alibaba-bold.ttf'
        }
    };
    const documentData = req.body;
    // 使用Zod schema验证请求体数据
    const validationResult = documentSchema.safeParse(documentData);
    if (!validationResult.success) {
        res.status(400).json({ error: '数据格式不正确', details: validationResult.error });
        return
    }

    var printer = new PdfPrinter(fonts);

    var pdfDoc = printer.createPdfKitDocument(documentData);
    res.setHeader('Content-Disposition', 'attachment; filename="generated.pdf"');
    // 将生成的 PDF 发送给客户端
    pdfDoc.pipe(res);
    pdfDoc.end();
}


async function generatePdf2(req, res) {
    try {
        var fonts = {
            // ... font definitions ...
            Roboto: {
                normal: 'fonts/alibaba.ttf',
                bold: 'fonts/alibaba-bold.ttf',
                italics: 'fonts/alibaba.ttf',
                bolditalics: 'fonts/alibaba-bold.ttf'
            }
        };

        const documentData = await new Promise((resolve, reject) => {
            let bodyData = '';
            req.on('data', (chunk) => {
                bodyData += chunk.toString(); // Concatenate data to bodyData
            });

            req.on('end', () => {
                try {
                    resolve(safeEvalAssign(bodyData));
                } catch (error) {
                    reject(error);
                }
            });
        });

        const validationResult = documentSchema.safeParse(documentData);
        if (!validationResult.success) {
            res.status(200).json({code:-1, error: '数据格式不正确', details: validationResult.error });
            return;
        }

        const processedData = await processImageURL(documentData);

        var printer = new PdfPrinter(fonts);
        const pdfDoc = printer.createPdfKitDocument(processedData);
        
        res.setHeader('Content-Disposition', 'attachment; filename="generated.pdf"');
        pdfDoc.pipe(res);
        pdfDoc.end();

    } catch (error) {
        console.error(error);
        res.status(200).json({code:-1, error: error.message || error || '内部错误', details: error.stack });
    }
}
export const pdfController = { generatePdf, generatePdf2 }