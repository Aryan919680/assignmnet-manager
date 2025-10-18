import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Use pdfjs-dist from node_modules directly
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url
).toString();

export default function PdfViewer ({ pdfUrl }) {
  return (
    <iframe
      src={pdfUrl}
      className="w-full h-[90vh]"
      title="PDF Viewer"
      style={{ border: 'none' }}
    />
  );
}


// export default PdfViewer;
