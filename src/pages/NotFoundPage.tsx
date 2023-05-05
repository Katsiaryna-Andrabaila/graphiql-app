import { useTranslation } from 'react-i18next';
import { Footer } from '../components/Footer/Footer';
import HeaderResponsive from '../components/Header/Header';
import { Text, Title } from '@mantine/core';

const NotFoundPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <HeaderResponsive
        links={[
          { link: '/', label: `${t('homeLink')}` },
          { link: '/redactor', label: `${t('redactorLink')}` },
        ]}
      />
      <Title order={3} mt={30} fw={500}>
        {t('404Page.notFound')}
        <Text component="a" fw={600} href="/">
          {t('404Page.mainPage')}
        </Text>
      </Title>
      <Footer />
    </>
  );
};

export default NotFoundPage;
