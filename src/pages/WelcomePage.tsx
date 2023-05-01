import { useTranslation } from 'react-i18next';

const WelcomePage = () => {
  const { t } = useTranslation();

  return <>{t('welcomePageHeader')}</>;
};

export default WelcomePage;
