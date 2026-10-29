import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';

const Layout = ({ loading, error }) => {
  let body = <Outlet />;
  if (loading) body = <p>Đang tải câu hỏi...</p>;
  if (error) body = <p>Không tải được câu hỏi.</p>;

  return (
    <div>
      <NavBar />
      <main className="content">{body}</main>
    </div>
  );
};

export default Layout;