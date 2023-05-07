import { Routes, Route } from "react-router-dom";
import NotFoundPage from '../pages/NotFoundPage';
import LoginPage from '../pages/LoginPage';
import RedactorPage from '../pages/RedactorPage';
import WelcomePage from '../pages/WelcomePage';
import { Layout } from "../components/layout";

export const Routing = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<RedactorPage />} />
        <Route path="about" element={<WelcomePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}





//   {
//     path: '/',
//     element: <WelcomePage />,
//     errorElement: <Navigate to="/404" replace />,
//   },
//   {
//     path: '/404',
//     element: <NotFoundPage />,
//   },
//   {
//     path: '/login',
//     element: <LoginPage />,
//   },
//   {
//     path: '/redactor',
//     element: <RedactorPage />,
//   },
// ];
