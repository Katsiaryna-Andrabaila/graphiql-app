import { useTranslation } from 'react-i18next';
import HeaderResponsive from '../components/Header/Header';

const WelcomePage = () => {
  const { t } = useTranslation();

  return (
    <>
      <HeaderResponsive
        links={[
          { link: '/', label: `${t('homeLink')}` },
          { link: '/redactor', label: `${t('redactorLink')}` },
        ]}
      />
      {t('welcomePageHeader')}
    </>
  );
};

export default WelcomePage;
