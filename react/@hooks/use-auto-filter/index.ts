// NOTE: This hook is used to automatically filter the table based on the URL search params
// Crafted to work with the useSearchParams hook and Tanstack table library

export const useAutoFilter = (
  table: Table<any>,
  isManualPagination?: boolean
) => {
  const searchParams = useSearchParams();
  const { setColumnFilters } = table;

  useEffect(() => {
    if (isManualPagination) return;
    const filters = Array.from(searchParams.entries()).map(([key, value]) => {
      const id = key.replace(/\[\]$/, "");
      return { id, value };
    });
    setColumnFilters(filters);
  }, [searchParams, setColumnFilters, isManualPagination]);
};
