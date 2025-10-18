import { useEffect, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist";

// Use CDN for worker to avoid build issues
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface PdfViewerProps {
  blob: Blob;
}

export default function PdfViewer({ blob }: PdfViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!containerRef.current) return;
      containerRef.current.innerHTML = "";

      const arrayBuffer = await blob.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

      for (let i = 1; i <= pdf.numPages; i++) {
        if (cancelled) break;
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.25 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        canvas.style.width = "100%";
        canvas.style.height = `${viewport.height}px`;
        canvas.style.display = "block";
        canvas.style.background = "#fff";
        const context = canvas.getContext("2d");
        if (!context) continue;
        await page.render({ canvasContext: context as any, viewport }).promise;
        containerRef.current.appendChild(canvas);
      }
    })();

    return () => {
      cancelled = true;
      if (containerRef.current) containerRef.current.innerHTML = "";
    };
  }, [blob]);

  return (
    <div ref={containerRef} className="h-[80vh] overflow-auto space-y-4 p-2 bg-background" />
  );
}
