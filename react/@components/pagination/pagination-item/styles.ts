import styled from "styled-components";

export const Button = styled.button`
  font-size: 14px;
  font-weight: 600;
  padding: 5px 11px;
  border-radius: 6px;
  border: 0;
  background: transparent;
  color: #005191;

  &.active {
    background: rgba(6, 149, 219, 0.1);
    color: #0695db;
  }

  &:hover {
    color: #0695db;
  }
`;
