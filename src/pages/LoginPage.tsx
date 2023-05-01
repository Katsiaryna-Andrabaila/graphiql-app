import { useTranslation } from 'react-i18next';

const LoginPage = () => {
  const { t } = useTranslation();

  return <>{t('login')}</>;
};

export default LoginPage;
