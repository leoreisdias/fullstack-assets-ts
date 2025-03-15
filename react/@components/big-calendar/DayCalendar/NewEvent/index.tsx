import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

import {
  ButtonPrimary,
  ButtonSecondary,
  DatePickerGroup,
  InputLabel,
  InputText,
  SubTitle,
} from '@/components/_generics';
import { useModal } from '@/components/_generics/Modals/Default/useModal';
import { ICalendarEventDTO } from '@/interfaces/payloads/ICalendarEventDTO';
import { createCalendarEvent } from '@/services/calendar';
import { calendarEventSchema } from '@/utils';
import { yupResolver } from '@hookform/resolvers/yup';

import * as S from './styles';

type NewEventProps = {
  onCancel: () => void;
  mutate: () => void;
};

export const NewEvent = ({ onCancel, mutate }: NewEventProps) => {
  const methods = useForm<ICalendarEventDTO>({
    resolver: yupResolver(calendarEventSchema),
  });

  const onSubmit = async (data: ICalendarEventDTO) => {
    const res = await createCalendarEvent({
      ...data,
      color: '#2ECC71',
    });

    if (res?.statusCode === 201) {
      mutate();
      onCancel();

      return toast.success('Registro salvo com sucesso!');
    }
  };

  return (
    <S.NewEventContainer>
      <SubTitle
        sx={{
          border: 'none',
          textAlign: 'center',
        }}
      >
        Nova reunião
      </SubTitle>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <S.InputGroup>
            <InputLabel htmlFor="title" title="Titulo" />
            <InputText id="title" name="title" placeholder="Informe o título" />
          </S.InputGroup>

          <S.Times>
            {/* <S.InputGroup>
              <InputLabel htmlFor="start" title="Tempo Inicio" />
              <InputText id="start" name="start" mask="99:99" />
            </S.InputGroup>

            <S.InputGroup>
              <InputLabel htmlFor="end" title="Tempo Fim" />
              <InputText id="end" name="end" mask="99:99" />
            </S.InputGroup> */}

            <DatePickerGroup nameStart="start" nameEnd="end" />
          </S.Times>

          {/* <S.InputGroup>
            <InputLabel htmlFor="repeat" title="Essa reunião se repete?" />
            <InputSelect
              id="repeat"
              name="repeat"
              options={[
                { value: 'none', label: 'Nunca' },
                { value: 'daily', label: 'Diariamente' },
                { value: 'weekly', label: 'Semanalmente' },
                { value: 'monthly', label: 'Mensalmente' },
              ]}
            />
          </S.InputGroup>

          <S.InputGroup>
            <InputLabel htmlFor="participant" title="Participante (opcional)" />
            <InputText id="participant" name="participant" />
          </S.InputGroup> */}

          <S.ButtonGroup>
            <ButtonSecondary
              type="button"
              title="Cancelar"
              simpleMode
              onClick={onCancel}
            />
            <ButtonPrimary type="submit" title="Salvar" />
          </S.ButtonGroup>
        </form>
      </FormProvider>
    </S.NewEventContainer>
  );
};
