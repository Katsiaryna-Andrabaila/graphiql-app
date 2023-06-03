import { CSSObject } from '@mantine/core';

export const historyStyles: CSSObject = {
  maxWidth: '25%',
  width: '25%',
  padding: '1rem',
  gap: '0',
  '@media (max-width: 700px)': {
    position: 'absolute',
    zIndex: 3,
    background: 'rgba(213, 214, 220, 0.906)',
    marginLeft: '48px',
    width: 'calc(100% - 48px)',
    maxWidth: 'calc(100% - 48px)',
    height: '97.6vh',
  },
};
export const historyButtonsStyles: CSSObject = {
  justifyContent: 'start',
  width: '90%',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  fontSize: '0.75rem',
};
