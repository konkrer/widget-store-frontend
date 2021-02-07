import { Route } from 'react-router-dom';
import { useState } from 'react';

// local imports
import AdminLogin from '../../components/Admin/AdminLogin';
import AdminPanel from '../../components/Admin/AdminPanel';

const Admin = () => {
  const [adminUser, setAdminUser] = useState(null);

  return (
    <>
      <Route exact path="/admin">
        <AdminLogin adminUser={adminUser} setAdminUser={setAdminUser} />
      </Route>
      <Route path="/admin/panel">
        <AdminPanel adminUser={adminUser} />
      </Route>
    </>
  );
};

export default Admin;
