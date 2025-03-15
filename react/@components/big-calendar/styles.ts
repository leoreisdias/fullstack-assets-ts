import styled, { css } from "styled-components";

import { DayContainerHeight } from "./DayCalendar/styles";

export const Container = styled.section`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 1rem;
  justify-content: flex-start;
`;

export const Month = styled.div`
  font-size: 2rem;
  color: ${({ theme }) => theme.COLORS.fontDark};
  font-weight: 600;
  text-transform: capitalize;
`;

export const CalendarContainer = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(8, 1fr);
`;

export const SwitcherContainer = styled.div<{ isToday?: boolean }>`
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;
  justify-content: center;
  padding: 0 0 0 0;
  margin: 0 0 0 0;
  height: ${DayContainerHeight}px;
  border: 1px solid ${({ theme }) => theme.COLORS.border};
  background-color: ${({ theme }) => theme.COLORS.bgBlueIcons};

  gap: 0.5rem;
`;

export const CalendarHeader = styled.div<{ isToday?: boolean }>`
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;
  justify-content: center;
  padding: 0 0 0 0;
  margin: 0 0 0 0;
  height: ${DayContainerHeight}px;
  border: 1px solid ${({ theme }) => theme.COLORS.border};
  background-color: ${({ theme }) => theme.COLORS.bgBlueIcons};

  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.COLORS.fontDark};

  ${({ isToday }) =>
    isToday &&
    css`
      border: 2px solid;
      border-image: linear-gradient(96.45deg, #02e95e 5.05%, #0575e6 56.92%) 1;
    `}
`;

export const Switcher = styled.div`
  cursor: pointer;

  display: flex;
  width: fit-content;
  padding: 0.25rem;
  align-items: center;
  justify-content: center;

  background: rgba(206, 212, 218, 0.5);
  border-radius: 50%;
`;

export const EmptyCard = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  justify-content: center;
  padding: 0 0 0 0;
  margin: 0 0 0 0;
  height: ${DayContainerHeight}px;
  border: 1px solid ${({ theme }) => theme.COLORS.border};
  background-color: ${({ theme }) => theme.COLORS.borderGray};
`;
