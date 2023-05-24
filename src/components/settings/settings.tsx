import { Box, Center, createStyles, Flex, Text, Title, useMantineColorScheme } from '@mantine/core';
import { SegmentedControl } from '@mantine/core';
import { IconMoon, IconSun } from '@tabler/icons-react';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { AppContext } from '../../HOC/Provider';
import { ButtonClear } from './clearButton';
import { settingsStyle } from './settingsStyle';


export const Settings = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const { t } = useTranslation();
  const { classes } = settingsStyle();
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
          <Title order={3}>{t('modal.language')}</Title>
          <Text>{t('modal.languageText')}</Text>
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
