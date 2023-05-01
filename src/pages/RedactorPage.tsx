import { useTranslation } from 'react-i18next';

const RedactorPage = () => {
  const { t } = useTranslation();

  return <>{t('redactor')}</>;
};

export default RedactorPage;
