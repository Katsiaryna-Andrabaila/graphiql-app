import { Outlet } from "react-router-dom";
import { Footer } from "./Footer/Footer";
import { useTranslation } from 'react-i18next';
import HeaderResponsive from "./Header/Header";


export const Layout = () => {
  const { t } = useTranslation();
  return (
    <>
        <HeaderResponsive
        links={[
          { link: '/', label: `${t('redactorLink')}` },
          { link: '/about', label: `${t('homeLink')}` },
        ]}
      />
      <main className="main">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};