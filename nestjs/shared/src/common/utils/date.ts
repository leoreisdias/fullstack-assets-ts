import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const formatDate = (
  date: string | Date | null | undefined,
  mask = 'dd/MM/yyyy',
  fallback = '',
) => {
  if (!date) return fallback;

  const isoDate = typeof date === 'string' ? date : date.toISOString();

  return format(parseISO(isoDate), mask, {
    locale: ptBR,
  });
};

export { formatDate };
