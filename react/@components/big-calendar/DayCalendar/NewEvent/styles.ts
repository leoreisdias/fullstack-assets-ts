import styled from 'styled-components';

export const NewEventContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;

  form {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 0.5rem;
`;

export const Times = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`;

export const ButtonGroup = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;

  margin-top: 2rem;

  button {
    max-width: 100px;
    height: 48px;
  }

  @media (max-width: 400px) {
    flex-direction: column-reverse;
    gap: 0.5rem;

    button {
      max-width: 100%;
      width: 100%;
    }
  }
`;
