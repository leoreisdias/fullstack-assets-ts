"use client";

import dynamic from "next/dynamic";
import { PDFViewerProps } from "./type";

const Viewer = dynamic(() => import("@/components/pdf-viewer/pdf-component"), {
  ssr: false,
});

export const PDFViewer = (props: PDFViewerProps) => {
  return <Viewer {...props} />;
};
