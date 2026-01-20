import { Outlet } from 'react-router-dom';
import Header from '../Header/Header';
import BottomNav from '../BottomNav/BottomNav';
import './Layout.css';

const Layout = () => {
  return (
    <div className="app-layout">
      <Header />
      <main className="app-main">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
};

export default Layout;
