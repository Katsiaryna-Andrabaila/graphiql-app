import { Box, Center, createStyles, Flex, Text, Title, useMantineColorScheme } from '@mantine/core';
import { SegmentedControl } from '@mantine/core';
import { IconMoon, IconSun } from '@tabler/icons-react';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { AppContext } from '../../HOC/Provider';
import { ButtonClear } from './clearButton';

const useStyles = createStyles((theme) => ({
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

export const Settings = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const { t } = useTranslation();
  const { classes } = useStyles();
  const { lang, handleChangeLanguage } = useContext(AppContext);

  return (
    <>
      <Flex className={classes.settingsContainer}>
        <Box className={classes.settingsContainer__box}>
          <Title order={3}>{t('modal.theme')}</Title>
          <Text>{t('modal.themeAdjust')}</Text>
        </Box>
        <Box>
          <SegmentedControl
            value={colorScheme}
            onChange={(value: 'light' | 'dark') => toggleColorScheme(value)}
            data={[
              {
                value: 'light',
                label: (
                  <Center>
                    <IconSun size="1rem" stroke={1.5} />
                    <Box ml={10}>{t('modal.light')}</Box>
                  </Center>
                ),
              },
              {
                value: 'dark',
                label: (
                  <Center>
                    <IconMoon size="1rem" stroke={1.5} />
                    <Box ml={10}>{t('modal.dark')}</Box>
                  </Center>
                ),
              },
            ]}
          />
        </Box>
      </Flex>
      <Flex className={classes.settingsContainer}>
        <Box className={classes.settingsContainer__box}>
          <Title order={3}>{t('modal.storage')}</Title>
          <Text>{t('modal.storageText')}</Text>
        </Box>
        <Box>
          <ButtonClear />
        </Box>
      </Flex>
      <Flex className={classes.settingsContainer}>
        <Box className={classes.settingsContainer__box}>
          <Title order={3}>{t('modal.theme')}</Title>
          <Text>{t('modal.themeAdjust')}</Text>
        </Box>
        <Box>
          <SegmentedControl
            value={lang}
            onChange={handleChangeLanguage}
            data={[
              { label: 'RU', value: 'ru' },
              { label: 'EN', value: 'en' },
            ]}
          />
        </Box>
      </Flex>
    </>
  );
};
