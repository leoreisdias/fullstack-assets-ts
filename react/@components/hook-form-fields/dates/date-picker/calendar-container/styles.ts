import { styled } from 'styled-system/jsx';

export const Container = styled('div', {
  base: {
    display: 'flex',
    flexDirection: 'column',
    background: 'rgba(250, 252, 255, 1)',
    border: 'solid 1px rgba(206, 212, 218, 1)',
    borderRadius: '8px',
    fontFamily: 'Montserrat, sans-serif',
    width: '280px',
    zIndex: 999999,
  },
});

export const CloseButton = styled('button', {
  base: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: '8px 8px 0px 0px',
  },
});

export const ActionFooterContainer = styled('div', {
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0px 10px 10px 10px',
    fontSize: '12px',
    fontWeight: 500,
    color: '#fff',
  },
});

export const ActionFooterCancel = styled('button', {
  base: {
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: 'rgba(5, 117, 230, 1)',
  },
});

export const ActionFooterAccept = styled('button', {
  base: {
    background: 'rgba(5, 117, 230, 1)',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    outline: 'none',
    padding: '4px 10px',
  },
});
