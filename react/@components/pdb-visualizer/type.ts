export type PDFViewerProps = {
  url: string;
  mode: "scroll" | "book";
  width?: number;
  renderTopPagination?: (props: {
    pageNumber: number;
    numPages: number;
    prevPage: () => void;
    nextPage: () => void;
  }) => JSX.Element;
};
