import { useTranslation } from 'react-i18next';

const NotFoundPage = () => {
  const { t } = useTranslation();

  return <>{t('notFound')}</>;
};

export default NotFoundPage;
