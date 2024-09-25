import { PDFDocument, rgb } from 'pdf-lib';
import { saveAs } from 'file-saver';

const generatePDF = async (transaction, total) => {
     const pdfDoc = await PDFDocument.create();
     const page = pdfDoc.addPage([600, 400]);

     const { width, height } = page.getSize();
     page.drawText('Чек на покупку', {
          x: 50,
          y: height - 50,
          size: 20,
          color: rgb(0, 0.53, 0.71),
     });

     let yOffset = height - 80;
     transaction.forEach((item, index) => {
          page.drawText(`${item.nomi} - ${item.quantity} x ${item.sotishnarxi} сум`, {
               x: 50,
               y: yOffset - index * 20,
               size: 12,
          });
     });

     page.drawText(`Итоговая сумма: ${total} сум`, {
          x: 50,
          y: yOffset - transaction.length * 20 - 20,
          size: 14,
          color: rgb(0.2, 0.84, 0.67),
     });

     const pdfBytes = await pdfDoc.save();
     saveAs(new Blob([pdfBytes], { type: 'application/pdf' }), 'cheque.pdf');
};
