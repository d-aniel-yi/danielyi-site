"use client";

export function ResumePdfViewer({ src = "/resume/resume.pdf" }: { src?: string }) {
  return (
    <div>
      <div className="rounded-xl border border-black/10 dark:border-white/10 overflow-hidden bg-white">
        <object
          data={src}
          type="application/pdf"
          className="w-full h-[calc(100vh-220px)]"
        >
          <p className="p-4 text-sm">
            PDF preview unavailable. You can
            {" "}
            <a className="underline" href={src} target="_blank" rel="noopener noreferrer">open</a>
            {" "}or{ " "}
            <a className="underline" href={src} download>download</a>
            {" "}the resume.
          </p>
        </object>
      </div>
      <div className="mt-2 text-xs opacity-70">
        If the PDF doesn’t display in your browser, use the open or download link above.
      </div>
    </div>
  );
}


