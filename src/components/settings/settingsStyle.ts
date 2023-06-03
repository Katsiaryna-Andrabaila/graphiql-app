import { createStyles } from '@mantine/core';

export const settingsStyle = createStyles((theme) => ({
  settingsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem 0',
    borderTop: '1px solid #A6A7AB',
    [theme.fn.smallerThan('xs')]: {
      flexDirection: 'column',
    },
  },

  settingsContainer__box: {
    width: '100%',
    margin: '0 2rem 0 0',
    [theme.fn.smallerThan('xs')]: {
      margin: '0 0 1rem 0',
    },
  },
}));
