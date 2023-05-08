import { useTranslation } from 'react-i18next';
import { Text, Title } from '@mantine/core';

const NotFoundPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <Title order={3} mt={30} fw={500}>
        {t('404Page.notFound')}
        <Text component="a" fw={600} href="/">
          {t('404Page.mainPage')}
        </Text>
      </Title>
    </>
  );
};

export default NotFoundPage;
