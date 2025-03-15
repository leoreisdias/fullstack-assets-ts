import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

import { AdvancedFiltersOptions } from '@/app/components/Filters';
import { InputText } from '@/app/components/Form/Inputs';
import { InputNumber } from '@/app/components/Form/Inputs/InputNumber';
import { InputSelect } from '@/app/components/Form/Inputs/InputSelect';
import { Box } from '@/styled-system/jsx';

type Props = {
  field: AdvancedFiltersOptions;
};

export const DynamicField = ({ field }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string | undefined | null | string[]) => {
      const params = new URLSearchParams(searchParams.toString());

      if (!value || (Array.isArray(value) && value.length === 0)) {
        params.delete(name);
        params.delete(`${name}[]`);
      } else {
        params.set(
          Array.isArray(value) && field.isMulti ? `${name}[]` : name,
          Array.isArray(value) ? value.join(',') : value,
        );
      }

      return params.toString();
    },
    [field.isMulti, searchParams],
  );

  const onChangeValue = (value: string | undefined | null | string[]) => {
    const queryString = createQueryString(field.name, value);
    router.push(`${pathname}?${queryString}`, {
      scroll: false,
    });
  };

  if (field.type === 'text') {
    return (
      <Box maxW="260px">
        <InputText
          name={field.name}
          label={field.label}
          onChangeValue={onChangeValue}
        />
      </Box>
    );
  }

  if (field.type === 'number') {
    return (
      <Box maxW="260px">
        <InputNumber
          name={field.name}
          label={field.label}
          onChangeValue={onChangeValue}
          format={field.mask}
        />
      </Box>
    );
  }

  if (field.type === 'select') {
    return (
      <Box maxW="260px">
        <InputSelect
          isClearable
          name={field.name}
          label={field.label}
          onChangeValue={values => onChangeValue(values as string[])}
          options={field.options ?? []}
          isMulti={field.isMulti}
        />
      </Box>
    );
  }

  return null;
};
