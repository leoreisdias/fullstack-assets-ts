import styled, { css } from 'styled-components';

export const DayContainerHeight = 120;

export const DayCalendarContainer = styled.div<{ isToday: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  width: 100%;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 1.75rem 2px 0 2px;
  margin: 0;
  height: ${DayContainerHeight}px;
  border: ${({ theme, isToday }) =>
    isToday
      ? `2px solid${theme.COLORS.blue}`
      : `1px solid${theme.COLORS.border}`};
  background-color: ${({ theme }) => theme.COLORS.background};

  cursor: pointer;

  position: relative;
`;

type DayIndicatorProps = {
  outside?: boolean;
  isToday?: boolean;
};

export const DayIndicator = styled.div<DayIndicatorProps>`
  position: absolute;

  top: 5px;
  left: 5px;

  color: ${({ theme, isToday }) =>
    isToday ? theme.COLORS.blue : theme.COLORS.font};
  font-size: 1rem;
  font-weight: 600;

  ${({ outside }) =>
    outside &&
    css`
      color: ${({ theme }) => theme.COLORS.grayAux};
    `}
`;

type EventProps = {
  color: string;
  isFinished?: boolean;
};

export const Event = styled.div<EventProps>`
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;
  justify-content: flex-start;
  padding: 4px 4px;
  margin: 0;
  background-color: ${({ theme, color, isFinished }) =>
    isFinished ? theme.COLORS.grayLight : color ?? theme.COLORS.red};

  color: ${({ theme, isFinished }) =>
    isFinished ? theme.COLORS.grayAux : theme.COLORS.white};

  text-decoration: ${({ isFinished }) => isFinished && 'line-through'};

  border-radius: 2px;

  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);

  cursor: pointer;
`;

export const EventTitle = styled.div`
  font-size: 0.75rem;

  overflow-x: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 120px;

  pointer-events: none;
`;

export const MoreEvents = styled.div`
  cursor: pointer;
  margin-top: 0.25rem;

  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  color: ${({ theme }) => theme.COLORS.grayAux};
  font-weight: 500;
`;
