import React, { useContext, useEffect, useState } from 'react';
import {
  Container,
  Row,
  Col,
  Table
} from 'reactstrap';
import axios from "axios";

import { AdminContext } from '../../contexts/AdminContext';
import TaskBar from '../../components/Admin/TaskBar';
import NotFound from '../../components/NotFound';
import Loadingpage from '../../components/LoadingPage';

const Customers = () => {
  const { newUsers, filter, loading } = useContext(AdminContext);
  const [users, setUsers] = useState([])
  const { adminToken } = useContext(AdminContext);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/users/", { headers: {"Authorization" : `Bearer ${adminToken}`}})
        setUsers(res.data);
      } catch (error) { 
        console.log(error);
      }
    }
    fetchUsers()
  }, [])

  return(
    <div className="Customers admin-page">
      <Container>
        {
          loading ?
          <Loadingpage /> :
          <React.Fragment>
            {/* <Row style={{padding: "0 15px"}}>
              <Col className="admin-col mb-4 pb-0">
                <TaskBar option="customers" />
              </Col>
            </Row> */}
            {
              <Row style={{padding: "0 15px"}}>
                <Col 
                  className="admin-col p-0" 
                  style={{
                    overflow:"auto", 
                    maxHeight:"450px",
                  }}
                >
                  <Table className="admin-table">
                    <thead>
                      <tr>
                        <th>Number</th>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Username</th>
                        <th>Total Order</th>
                      </tr>
                    </thead>
    
                    <tbody>
                      {
                        users.filter(item => item.id !== 5).map((user, index) => 
                          <tr key={user.id}>
                            <td>{index + 1}</td>
                            <td>{user.id}</td>
                            <td>{user.first_name} {user.last_name}</td>
                            <td>{user.username}</td>
                            <td>{user.orders_creator.length}</td>
                          </tr>
                        )
                      }
                    </tbody>
                  </Table>
                </Col>
              </Row>
              
            }
          </React.Fragment>
        }
      </Container>
    </div>
  );
}

export default Customers;