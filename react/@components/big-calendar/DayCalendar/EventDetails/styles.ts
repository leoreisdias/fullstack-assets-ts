import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  gap: 1rem;
`;

export const Event = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 2rem;

  border-top: 1px solid ${({ theme }) => theme.COLORS.border};

  width: 100%;
  padding-top: 1rem;

  color: ${({ theme }) => theme.COLORS.font};
  font-size: 1rem;
`;

export const EventTime = styled.div<{ isFinished?: boolean }>`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 0.5rem;

  color: ${({ theme, isFinished }) =>
    isFinished ? theme.COLORS.grayAux : theme.COLORS.font};
`;

export const EventFlag = styled.div<{ color?: string; isFinished?: boolean }>`
  display: inline-block;
  border-radius: 2px;
  width: 0.25rem;
  height: 1.5rem;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);

  background-color: ${({ theme, color, isFinished }) =>
    isFinished ? theme.COLORS.grayAux : color ?? theme.COLORS.blue};
`;

export const EventTitle = styled.div<{ isFinished?: boolean }>`
  font-weight: 600;
  text-decoration: ${({ isFinished }) =>
    isFinished ? 'line-through' : 'none'};

  color: ${({ theme, isFinished }) =>
    isFinished ? theme.COLORS.grayAux : theme.COLORS.font};
`;

export const NewEvent = styled.div`
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
`;
