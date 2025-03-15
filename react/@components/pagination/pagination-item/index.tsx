import { Button } from "./styles";

interface PaginationItemProps {
  numberPage: number;
  isCurrent?: boolean;
  onPageChange: (page: number) => void;
}

export function PaginationItem({
  numberPage,
  isCurrent = false,
  onPageChange,
}: PaginationItemProps) {
  if (isCurrent) {
    return <Button className="active">{numberPage}</Button>;
  }

  return <Button onClick={() => onPageChange(numberPage)}>{numberPage}</Button>;
}
