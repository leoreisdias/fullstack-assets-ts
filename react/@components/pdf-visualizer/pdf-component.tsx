"use client";
import { pdfjs } from "react-pdf";
import { Document, Page } from "react-pdf";
import { useEffect, useState } from "react";
import { Box, Flex } from "styled-system/jsx";
import { CaretLeft, CaretRight } from "@phosphor-icons/react/dist/ssr";
import "react-pdf/dist/Page/TextLayer.css";
import { css } from "styled-system/css";
import { PDFViewerProps } from "./type";
import { Button } from "../button";
import { Skeleton } from "../loadings/skeleton";
import { Text } from "@/components/ui/text";

// pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/legacy/build/pdf.worker.js", import.meta.url).toString();
// pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.js";
// pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";  // VERSÃO ANTERIOR 27/03
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`; // NOTE: TEMP VERSION UNTIL PDFJS DIST IS UPDATED

const LoadingText = () => {
  return (
    <Flex
      justify="center"
      align="center"
      flexDir="column"
      gap={4}
      w="full"
      h="600px"
    >
      <Box
        css={{
          width: "50px",
          aspectRatio: "1",
          display: "grid",
          "&::before, &::after": {
            content: '""',
            gridArea: "1/1",
            "--c":
              "no-repeat radial-gradient(farthest-side, #25b09b 92%, #0000)",
            background:
              "var(--c) 50% 0, var(--c) 50% 100%, var(--c) 100% 50%, var(--c) 0 50%",
            backgroundSize: "12px 12px",
            animation: "l12 1s infinite",
          },
          "&::before": {
            margin: "4px",
            filter: "hue-rotate(45deg)",
            backgroundSize: "8px 8px",
            animationTimingFunction: "linear",
          },
        }}
      />
      <Text as="span">Carregando página...</Text>
    </Flex>
  );
};

// NOTE: Precisa ser importado usando do next/dynamic para funcionar no SSR -> const PDFViewer = dynamic(() => import("@/components/pdf-viewer"), { ssr: false });
/**
 * Componente para visualização de arquivos PDF
 * @param url URL do arquivo PDF
 * @description Precisa ser importado usando do next/dynamic para funcionar no SSR
 * @description Exemplo: const PDFViewer = dynamic(() => import("@/components/pdf-viewer"), { ssr: false });
 */
export default function PDFViewerBase({
  url,
  mode,
  width,
  renderTopPagination,
}: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [hasError, setHasError] = useState(false);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  const nextPage = () => {
    setPageNumber((prev) => prev + 1);
  };

  const prevPage = () => {
    setPageNumber((prev) => prev - 1);
  };

  useEffect(() => {
    try {
      // Tente renderizar o componente PDF
      pdfjs.getDocument(url).promise.then(
        (pdf) => {
          setNumPages(pdf.numPages);
        },
        (error) => {
          console.error("Erro ao carregar PDF:", error);
          setHasError(true);
        }
      );
    } catch (error) {
      console.error("Erro ao renderizar PDF:", error);
      setHasError(true);
    }
  }, [url]);

  if (hasError) {
    return (
      <iframe
        src={url}
        width="100%"
        title="PDF Viewer"
        style={{ border: "none", maxHeight: "1000px", height: "100%" }}
      />
    );
  }

  if (numPages === 0) {
    return <Skeleton maxH="700px" h="full" w="full" />;
  }

  if (numPages === 0) {
    return <Skeleton h={1000} w="full" />;
  }

  return (
    <Flex
      position="relative"
      overflowY="auto"
      overflowX="hidden"
      w="full"
      animation="fadeIn 0.3s ease"
      p={4}
      justify="flex-start"
      align="center"
      flexDir="column"
      bg="white"
      shadow="lg"
      rounded="lg"
    >
      {mode === "book" &&
        !!renderTopPagination &&
        renderTopPagination({
          pageNumber,
          numPages,
          nextPage,
          prevPage,
        })}
      <Document
        file={url}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={LoadingText}
      >
        {mode === "scroll" &&
          Array.from(new Array(numPages), (el, index) => (
            <Page
              width={width}
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              loading={LoadingText}
            />
          ))}

        {mode === "book" && (
          <Page
            className={css({ width: "100%", h: "100%" })}
            pageNumber={pageNumber}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            // height={1000}
            loading={LoadingText}
          />
        )}
      </Document>
      {mode === "book" && !renderTopPagination && (
        <Flex
          justify="space-between"
          position="absolute"
          w="fit"
          bottom={4}
          right="50%"
          translate="auto"
          translateX="50%"
          align="center"
          gap={2}
          shadow="md"
          rounded="lg"
        >
          <Button
            _hover={{ bg: "gray.2" }}
            variant="link"
            size="icon"
            onClick={prevPage}
            disabled={pageNumber <= 1}
          >
            <CaretLeft size={24} />
          </Button>
          <p>
            {pageNumber} de {numPages}
          </p>
          <Button
            _hover={{ bg: "gray.2" }}
            variant="link"
            size="icon"
            onClick={nextPage}
            disabled={pageNumber >= numPages}
          >
            <CaretRight size={24} />
          </Button>
        </Flex>
      )}
    </Flex>
  );
}
