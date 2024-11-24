import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

class FinancialReportService {
    constructor(financialData) {
        // Defensive check to ensure data is properly structured
        if (!financialData ||
            !financialData.incomeBreakdown ||
            !financialData.expensesBreakdown) {
            throw new Error('Invalid financial data structure');
        }
        this.financialData = financialData;
    }
    async generateReport() {
        try {
            // Validate financial data
            if (!this.financialData) {
                throw new Error('No financial data available');
            }

            // Generate comprehensive report object
            const report = {
                summary: this.generateSummary(),
                profitLoss: this.financialData.profitLoss,
                incomeBreakdown: this.financialData.incomeBreakdown[0],
                expensesBreakdown: this.financialData.expensesBreakdown[0],
                mrrData: this.financialData.mrrData,
                generatedAt: new Date().toISOString()
            };

            return report;
        } catch (error) {
            console.error('Report generation error:', error);
            throw error;
        }
    }

    generateSummary() {
        // Safe access with default values
        const income = this.sanitizeNumberArray(
            this.financialData.incomeBreakdown[0],
            'amount'
        ).reduce((sum, val) => sum + val, 0);

        const expenses = this.sanitizeNumberArray(
            this.financialData.expensesBreakdown[0],
            'amount'
        ).reduce((sum, val) => sum + val, 0);

        const netProfit = income - expenses;

        return {
            totalIncome: income,
            totalExpenses: expenses,
            netProfit: netProfit,
            profitMargin: income > 0
                ? ((netProfit / income) * 100).toFixed(2) + '%'
                : 'N/A'
        };
    }

    // Utility method to safely extract numeric values
    sanitizeNumberArray(array, key) {
        if (!Array.isArray(array)) return [];
        return array.map(item =>
            typeof item[key] === 'number' ? item[key] : 0
        );
    }

    async exportToPDF(report) {
        try {
            const pdfDoc = await PDFDocument.create();
            const page = pdfDoc.addPage();
            const { width, height } = page.getSize();
            const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

            page.drawText('Financial Report', {
                x: 50,
                y: height - 50,
                size: 24,
                font: font
            });

            // Add summary details
            let yPosition = height - 100;
            const summary = report.summary;
            const summaryText = [
                `Total Income: $${summary.totalIncome.toLocaleString()}`,
                `Total Expenses: $${summary.totalExpenses.toLocaleString()}`,
                `Net Profit: $${summary.netProfit.toLocaleString()}`,
                `Profit Margin: ${summary.profitMargin}`
            ];

            summaryText.forEach(line => {
                page.drawText(line, {
                    x: 50,
                    y: yPosition,
                    size: 12,
                    font: font
                });
                yPosition -= 20;
            });

            const pdfBytes = await pdfDoc.save();
            const fileUri = `${FileSystem.documentDirectory}financial_report.pdf`;

            await FileSystem.writeAsStringAsync(fileUri,
                String.fromCharCode.apply(null, pdfBytes),
                { encoding: FileSystem.EncodingType.UTF8 }
            );

            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(fileUri);
            }

            return fileUri;
        } catch (error) {
            console.error('PDF export error:', error);
            throw error;
        }
    }


    async downloadPDF() {
        try {
            const pdfDoc = await PDFDocument.create();
            const page = pdfDoc.addPage([600, 800]);

            const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
            const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

            const drawText = (text, x, y, size = 12, font = helvetica, color = rgb(0, 0, 0)) => {
                page.drawText(text, { x, y, size, font, color });
            };

            // Title
            drawText('Financial Report', 50, 750, 24, helveticaBold, rgb(0.1, 0.1, 0.1));

            // Summary
            const summary = this.generateSummary();
            let yPos = 700;

            drawText('Financial Summary', 50, yPos, 16, helveticaBold);
            yPos -= 30;

            const summaryDetails = [
                `Total Income: $${summary.totalIncome.toLocaleString()}`,
                `Total Expenses: $${summary.totalExpenses.toLocaleString()}`,
                `Net Profit: $${summary.netProfit.toLocaleString()}`,
                `Profit Margin: ${summary.profitMargin}`
            ];

            summaryDetails.forEach(line => {
                drawText(line, 70, yPos, 12);
                yPos -= 25;
            });

            // Income Breakdown
            yPos -= 20;
            drawText('Income Breakdown', 50, yPos, 16, helveticaBold);
            yPos -= 30;

            const incomeBreakdown = this.sanitizeNumberArray(
                this.financialData.incomeBreakdown[0],
                'amount'
            );

            this.financialData.incomeBreakdown[0].forEach((item, index) => {
                drawText(`${item.category}: $${incomeBreakdown[index].toLocaleString()}`, 70, yPos, 12);
                yPos -= 25;
            });

            // PDF bytes and file saving
            const pdfBytes = await pdfDoc.save();
            const fileUri = `${FileSystem.documentDirectory}financial_report_${Date.now()}.pdf`;

            // Use base64 encoding instead of UTF-8
            await FileSystem.writeAsStringAsync(fileUri,
                btoa(String.fromCharCode.apply(null, pdfBytes)),
                { encoding: FileSystem.EncodingType.Base64 }
            );

            return fileUri;
        } catch (error) {
            console.error('Detailed PDF download error:', error);
            throw error;
        }
    }
}

export default FinancialReportService;