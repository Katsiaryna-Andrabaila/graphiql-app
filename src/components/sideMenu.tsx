import { ActionIcon, Box, Flex, Modal, Stack, Tooltip } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconBrush,
  IconHistory,
  IconPlayerPlay,
  IconSchema,
  IconSettings,
  IconVariable,
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { SideMenuProps } from '../types/types';
import { Settings } from './settings/settings';

export const SideMenu = ({
  isOpenSchema,
  showVariables,
  variablesHandler,
  handleClickSchema,
  execOperation,
  prettify,
  handleClickHistory,
}: SideMenuProps) => {
  const [opened, { open, close }] = useDisclosure(false);
  const { t } = useTranslation();
  return (
    <>
      <Flex justify="space-between" align="center" direction="column" wrap="wrap">
        <Stack p={10}>
          <Tooltip
            label={
              isOpenSchema
                ? `${t('sideMenu.hide')} ${t('sideMenu.schema')}`
                : `${t('sideMenu.show')} ${t('sideMenu.schema')}`
            }
            color="gray"
            position="bottom"
          >
            <ActionIcon onClick={handleClickSchema}>
              <IconSchema />
            </ActionIcon>
          </Tooltip>
          <Tooltip label={t('sideMenu.run')} color="gray" position="bottom">
            <ActionIcon onClick={execOperation}>
              <IconPlayerPlay />
            </ActionIcon>
          </Tooltip>
          <Tooltip label={t('sideMenu.pretty')} color="gray" position="bottom">
            <ActionIcon onClick={prettify}>
              <IconBrush />
            </ActionIcon>
          </Tooltip>
          <Tooltip label={t('sideMenu.history')} color="gray" position="bottom">
            <ActionIcon onClick={handleClickHistory}>
              <IconHistory />
            </ActionIcon>
          </Tooltip>
          <Tooltip
            label={
              showVariables
                ? `${t('sideMenu.show')} ${t('sideMenu.variables')}`
                : `${t('sideMenu.hide')} ${t('sideMenu.variables')}`
            }
            color="gray"
            position="bottom"
          >
            <ActionIcon onClick={variablesHandler}>
              <IconVariable />
            </ActionIcon>
          </Tooltip>
        </Stack>
        <Box>
          <Tooltip label={t('sideMenu.settings')} color="gray" position="bottom">
            <ActionIcon onClick={open}>
              <IconSettings />
            </ActionIcon>
          </Tooltip>
        </Box>
      </Flex>
      <Modal size="l" opened={opened} onClose={close} title={t('modal.title')} centered>
        <Settings />
      </Modal>
    </>
  );
};
