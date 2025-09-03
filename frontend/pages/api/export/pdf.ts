import { NextApiRequest, NextApiResponse } from 'next';
import { PDFDocument, rgb, PDFFont } from 'pdf-lib';
import { promises as fs } from 'fs';
import path from 'path';
import { getExportData } from '../../../lib/exportData';
import fontkit from '@pdf-lib/fontkit'; // --- FIX: Import fontkit ---

// Helper function to draw text and manage Y position
async function drawText(page: any, text: string, options: { x: number, y: number, font: PDFFont, size: number, color?: any, maxWidth?: number }) {
    page.drawText(text, {
        ...options,
        color: options.color || rgb(0, 0, 0),
        wordBreaks: [' '],
    });
    return options.y - (options.size * 1.5);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const token = req.headers.authorization?.split(' ')[1] as string;
        const { services } = req.body;

        const data = await getExportData(token, services);

        if (!data || !data.personalInfo || data.personalInfo.name === 'N/A') {
            return res.status(404).json({ 
                error: 'No Data Found For User', 
                details: 'Could not find any profile or analysis results for your account. Please ensure your profile is complete and you have run an analysis before exporting.' 
            });
        }

        const templatePath = path.join(process.cwd(), 'public', 'template.pdf');
        const templateBytes = await fs.readFile(templatePath);
        const templateDoc = await PDFDocument.load(templateBytes);
        
        const finalDoc = await PDFDocument.create();
        
        // --- FIX: Register fontkit with the PDF document ---
        finalDoc.registerFontkit(fontkit);

        const fontPath = path.join(process.cwd(), 'public', 'fonts', 'Inter-VariableFont_opsz,wght.ttf');
        const fontBytes = await fs.readFile(fontPath);
        const customFont = await finalDoc.embedFont(fontBytes);
        // For simplicity, we'll use the same font for regular and bold text.
        // You could load an Inter-Bold.ttf for a true bold effect if needed.
        const customBoldFont = customFont;

        const [homeTemplatePage] = await finalDoc.copyPages(templateDoc, [0]);
        const homePage = finalDoc.addPage(homeTemplatePage);
        const { width, height } = homePage.getSize();
        let currentY = height - 150;

        // Add a heading for Personal Information
        currentY -= 60;

        currentY = await drawText(homePage, 'Personal Information', { x: 50, y: currentY, font: customBoldFont, size: 26, color: rgb(0.05, 0.2, 0.4) });
        currentY -= 20;  // Add some space after the heading
        currentY += 10;
        currentY = await drawText(homePage, `Name: ${data.personalInfo.name}`, { x: 55, y: currentY, font: customFont, size: 20 });
        currentY = await drawText(homePage, `Email: ${data.personalInfo.email}`, { x: 55, y: currentY, font: customFont, size: 20 });
        currentY = await drawText(homePage, `Age: ${data.personalInfo.age}`, { x: 55, y: currentY, font: customFont, size: 20 });
        currentY = await drawText(homePage, `Gender: ${data.personalInfo.gender}`, { x: 55, y: currentY, font: customFont, size: 20 });
        currentY = await drawText(homePage, `State: ${data.personalInfo.state}`, { x: 55, y: currentY, font: customFont, size: 20 });

        currentY -= 30;

        currentY = await drawText(homePage, 'Report Overview', { x: 50, y: currentY, font: customBoldFont, size: 26, color: rgb(0.05, 0.2, 0.4) });
        currentY -= 20;
        
        if (data.overview.schemes) {
            currentY = await drawText(homePage, `Eligible Schemes: ${data.overview.schemes.total} (Central: ${data.overview.schemes.central}, State: ${data.overview.schemes.state})`, { x: 55, y: currentY, font: customFont, size: 20 });
            currentY -= 10;
        }
        if (data.overview.tax) {
            currentY = await drawText(homePage, `Tax Advisory: Saved ₹${data.overview.tax.taxSaved} with the ${data.overview.tax.bestRegime} regime.`, { x: 55, y: currentY, font: customFont, size: 20 });
            currentY -= 10;
        }
        if (data.overview.wealth) {
            currentY = await drawText(homePage, `Wealth Projection: Projected Corpus of ₹${data.overview.wealth.projectedCorpus}.`, { x: 55, y: currentY, font: customFont, size: 20 });
            currentY -= 10;
        }
        
        const pageMargin = 50;
        
        const addNewContentPage = async () => {
            const [contentTemplatePage] = await finalDoc.copyPages(templateDoc, [1]);
            return finalDoc.addPage(contentTemplatePage);
        };
        
        let contentPage = await addNewContentPage();
        currentY = height - 100;

        const checkNewPage = async () => {
            if (currentY < pageMargin + 40) {
                contentPage = await addNewContentPage();
                currentY = height - 100;
            }
        };

        if (data.details.schemes && data.details.schemes.length > 0) {
            currentY = await drawText(contentPage, 'Eligible Schemes Details', { x: 50, y: currentY, font: customBoldFont, size: 16, color: rgb(0.05, 0.2, 0.4) });
            currentY += 5;
            for (const scheme of data.details.schemes) {
                await checkNewPage();
                currentY = await drawText(contentPage, `• ${scheme.scheme_name} (${scheme.scheme_id})`, { x: 55, y: currentY, font: customFont, size: 11, maxWidth: width - 110 });
            }
            currentY -= 20;
        }

        if (data.details.tax && data.details.tax.bestRegime) {
             await checkNewPage();
             currentY = await drawText(contentPage, 'Tax Advisory Details', { x: 50, y: currentY, font: customBoldFont, size: 16, color: rgb(0.05, 0.2, 0.4) });
             currentY += 5;
             await checkNewPage();
             currentY = await drawText(contentPage, `Recommended Regime: ${data.details.tax.bestRegime}`, { x: 55, y: currentY, font: customFont, size: 11 });
             await checkNewPage();
             currentY = await drawText(contentPage, `Total Potential Savings: ₹${data.details.tax.taxSaved}`, { x: 55, y: currentY, font: customFont, size: 11 });
             currentY -= 20;
        }
        
        if (data.details.wealth && data.details.wealth.projection_data) {
             await checkNewPage();
             currentY = await drawText(contentPage, 'Wealth Projection Details', { x: 50, y: currentY, font: customBoldFont, size: 16, color: rgb(0.05, 0.2, 0.4) });
             currentY += 5;
             const projection = data.details.wealth.projection_data;
             await checkNewPage();
             currentY = await drawText(contentPage, `Year    Opening Capital    Annual Investment    Interest Earned    Closing Capital`, { x: 55, y: currentY, font: customBoldFont, size: 9 });
             for(const row of projection){
                 await checkNewPage();
                 const rowText = `${String(row.year).padEnd(7)} ${String(row.opening_capital).padEnd(18)} ${String(row.annual_investment).padEnd(20)} ${String(row.interest_earned).padEnd(18)} ${row.closing_capital}`;
                 currentY = await drawText(contentPage, rowText, { x: 55, y: currentY, font: customFont, size: 9 });
             }
        }
        
        const pageCount = finalDoc.getPageCount();
        for (let i = 0; i < pageCount; i++) {
            const page = finalDoc.getPage(i);
            page.drawText(`Page : ${i + 1} / ${pageCount}`, {
                x: width - 100,
                y: height - 45,
                font: customFont,
                size: 15,
                color: rgb(0.2, 0.2, 0.2),
            });
        }

        const pdfBytes = await finalDoc.save();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=PrajaSeva_Report.pdf');
        res.send(Buffer.from(pdfBytes));

    } catch (error: any) {
        console.error('Error generating PDF:', error);
        res.status(500).json({ error: 'An internal server error occurred while generating the PDF.', details: error.message });
    }
}

