const pdfParse = require('pdf-parse');
console.log('Exported keys:', Object.keys(pdfParse));
const { PDFParse } = pdfParse;
console.log('PDFParse class:', PDFParse);
try {
    const parser = new PDFParse({ data: Buffer.from("dummy") });
    console.log('Parser instance created');
} catch(e) {
    console.log('Error during instantiation:', e.message);
}
