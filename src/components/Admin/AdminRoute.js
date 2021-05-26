import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';

import { AdminContext } from '../../contexts/AdminContext';

const AdminRoute = ({ component: Component, ...rest }) => {
  const { adminToken } = useContext(AdminContext);
  return(
    <>
      <Route 
        {...rest}
        render={props =>
          adminToken ? (
            <Component {...props} />
          ) : (
            <Redirect to="/admin/login" />
          )
        }
      />
      {/* <Route 
        {...rest}
        render={props =>
          <Component {...props} />
        }
      /> */}
    </>
  );
}

export default AdminRoute;