import { PDFParse } from 'pdf-parse';
console.log('PDFParse loaded');

async function test() {
    try {
        const buffer = Buffer.from("test pdf content");
        const parser = new PDFParse({ data: buffer });
        console.log('Parser instance created');
        if (typeof parser.getText === 'function') {
             console.log('getText method exists');
             try {
                 await parser.getText(); 
             } catch (e) {
                 console.log('getText failed (expected for invalid PDF):', e.message);
             }
        } else {
             console.log('getText method MISSING');
        }
    } catch(e) {
        console.log('Error:', e.message);
    }
}
test();
