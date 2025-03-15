import { CaretLeft, CaretRight } from "phosphor-react";

import { PaginationItem } from "./pagination-item";
import { Button, PaginationContainer } from "./styles";

interface PaginationProps {
  lastPage: number;
  currentPage?: number;
  onNextPage: () => void;
  onPreviousPage: () => void;
  onPageChange: (page: number) => void;
}

const siblingsCount = 2;

function generatePagesArray(from: number, to: number) {
  return [...new Array(to - from)]
    .map((_, index) => {
      return from + index + 1;
    })
    .filter((page) => page > 0 && page !== 1);
}

export function Pagination({
  lastPage,
  currentPage = 1,
  onNextPage,
  onPreviousPage,
  onPageChange,
}: PaginationProps) {
  const previousPages =
    currentPage > 1
      ? generatePagesArray(currentPage - 1 - siblingsCount, currentPage - 1)
      : [];

  const nextPages =
    currentPage < lastPage
      ? generatePagesArray(
          currentPage,
          Math.min(currentPage + siblingsCount, lastPage - 1)
        )
      : [];

  const showInitialElipses = previousPages[0] > 2;
  const showFinalElipses = nextPages[nextPages.length - 1] < lastPage - 1;

  return (
    <PaginationContainer>
      <Button onClick={onPreviousPage} disabled={currentPage === 1}>
        <CaretLeft />
      </Button>

      {currentPage !== 1 && (
        <PaginationItem numberPage={1} onPageChange={onPageChange} />
      )}
      {showInitialElipses && "..."}

      {previousPages.length >= 1 &&
        previousPages.map((page) => {
          return (
            <PaginationItem
              key={page}
              numberPage={page}
              onPageChange={onPageChange}
            />
          );
        })}

      <PaginationItem
        numberPage={currentPage}
        onPageChange={onPageChange}
        isCurrent
      />

      {nextPages.length > 0 &&
        currentPage !== lastPage &&
        nextPages.map((page) => {
          return (
            <PaginationItem
              key={page}
              numberPage={page}
              onPageChange={onPageChange}
            />
          );
        })}

      {showFinalElipses && "..."}

      {currentPage !== lastPage && lastPage > 0 && (
        <PaginationItem numberPage={lastPage} onPageChange={onPageChange} />
      )}

      <Button onClick={onNextPage} disabled={currentPage === lastPage}>
        <CaretRight />
      </Button>
    </PaginationContainer>
  );
}
