import { useTranslation } from 'react-i18next';
import HeaderResponsive from '../components/Header/Header';

const RedactorPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <HeaderResponsive
        links={[
          { link: '/', label: 'Home' },
          { link: '/redactor', label: 'Redactor' },
        ]}
      />
      {t('redactor')}
    </>
  );
};

export default RedactorPage;
