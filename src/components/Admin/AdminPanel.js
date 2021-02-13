import { Redirect } from 'react-router-dom';

const AdminPanel = ({ adminUser }) => {
  if (!adminUser) return <Redirect to="/admin" />;

  return (
    <div>
      <h1>Admin Panel</h1>
    </div>
  );
};

export default AdminPanel;
