import { Button, rem } from '@mantine/core';
import { IconTrash, IconCheck } from '@tabler/icons-react';
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppContext } from '../../HOC/Provider';

export function ButtonClear() {
  const [isDone, setDone] = useState(false);
  const { t } = useTranslation();
  const { setHistory } = useContext(AppContext);

  const handleClickClean = () => {
    setDone(true);
    setHistory && setHistory([]);
  };

  return (
    <Button
      variant="light"
      rightIcon={
        isDone ? <IconCheck size="1.2rem" stroke={1.5} /> : <IconTrash size="1.2rem" stroke={1.5} />
      }
      radius="md"
      size="sm"
      styles={{
        root: { paddingRight: rem(14), height: rem(48) },
        rightIcon: { marginLeft: rem(22) },
      }}
      onClick={handleClickClean}
    >
      {isDone ? t('modal.cleared') : t('modal.clearData')}
    </Button>
  );
}
