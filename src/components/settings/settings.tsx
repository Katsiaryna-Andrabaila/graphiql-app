import { Box, Center, Flex, Text, Title, useMantineColorScheme } from '@mantine/core';
import { SegmentedControl } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconMoon, IconSun } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { ButtonClear } from './clearButton';

export const Settings = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const mobile = useMediaQuery('(max-width: 36em)');
  const { t } = useTranslation();

  return (
    <>
      <Flex
        direction={mobile ? 'column' : 'row'}
        justify="space-between"
        align="center"
        pt="1.5rem"
        pb="1.5rem"
        sx={{ borderTop: '1px solid #A6A7AB' }}
      >
        <Box w="100%" mb={mobile ? '1rem' : ''} mr={mobile ? '' : '2rem'}>
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
      <Flex
        direction={mobile ? 'column' : 'row'}
        justify="space-between"
        align="center"
        pt="1.5rem"
        pb="1.5rem"
        sx={{ borderTop: '1px solid #A6A7AB' }}
      >
        <Box w="100%" mb={mobile ? '1rem' : ''} mr={mobile ? '' : '2rem'}>
          <Title order={3}>{t('modal.storage')}</Title>
          <Text>{t('modal.storageText')}</Text>
        </Box>
        <Box>
          <ButtonClear />
        </Box>
      </Flex>
    </>
  );
};
