import React from "react";

type PdfViewerProps = {
  pdfUrl: string;
};

export default function PdfViewer({ pdfUrl }: PdfViewerProps) {
  return (
    <iframe
      src={pdfUrl}
      className="w-full h-[90vh]"
      title="PDF Viewer"
      style={{ border: "none" }}
    />
  );
}
