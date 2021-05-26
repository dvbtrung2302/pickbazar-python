import React, { useContext, useEffect, useState } from 'react';
import {
  Container,
  Row,
  Col,
  Table,
  Modal
} from 'reactstrap';
import '../../css/Admin/AdminOrder.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faShippingFast, faCheck } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

import { AdminContext } from '../../contexts/AdminContext';
import TaskBar from '../../components/Admin/TaskBar';
import NotFound from '../../components/NotFound';
import LoadingPage from '../../components/LoadingPage';
import Spinner from 'reactstrap/lib/Spinner';
import { ProductsContext } from '../../contexts/ProductsContext';

const AdminOrders = () => {
  const { filtedOrders, filter, loading } = useContext(AdminContext);
  const { products } = useContext(ProductsContext);
  const [orders, setOrders] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const token = localStorage.getItem('adminToken');
  const [modal, setModal] = useState(false);
  const [orderItems, setOrdersItem] = useState([]);

  const toggle = () => setModal(!modal);
  // const getStatus = (status) => {
  //   switch (status) {
  //     case 1: return <FontAwesomeIcon size="2x" icon={faTimes} />
  //     case 2: return <FontAwesomeIcon size="2x" icon={faShippingFast} />
  //     default: return <FontAwesomeIcon size="2x" icon={faCheck} />
  //   }
  // }

  useEffect(() => {
    setOrders(filtedOrders)
  }, [filtedOrders])

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://127.0.0.1:8000/api/orders/', { headers: {"Authorization" : `Bearer ${token}`}})
      setOrders(res.data.reverse())
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  // const handleStatusClick = async (status, data) => {
  //   if (status === data.status) return;
  //   try {
  //     const postData = {
  //       ...data,
  //       status: status
  //     }
  //     const res = await axios.patch('https://dvbt-bookstore.herokuapp.com/order/update-status', postData, { headers: {"Authorization" : `Bearer ${token}`}});
  //     fetchOrders();
  //   } catch (error) {
  //     console.log(error);
  //   } 
  // }

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`http://127.0.0.1:8000/api/orders/${id}`, { headers: {"Authorization" : `Bearer ${token}`}})
      fetchOrders()
    } catch (error) { 
      console.log(error);
    }
  }

  return(
    <div className="AdminOrders admin-page">
      <Container>
        {
          isLoading || loading ?
          <LoadingPage /> :
          <React.Fragment>
            {/* <Row style={{padding: "0 15px"}}>
              <Col className="admin-col mb-4 pb-0">
                <TaskBar option="orders" />
              </Col>
            </Row> */}
            {
              (filter.addressKeyword && !filtedOrders.length) ? 
              <NotFound type="admin" /> : 
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
                        <th>Order Id</th>
                        <th>Time</th>
                        <th>Amount</th>
                        <th>Payment Method</th>
                        <th>Customer's Email</th>
                        <th>Contact</th>
                        <th>Delivery Address</th>
                        <th>Delete Order</th>
                        {/* <th>Status</th> */}
                      </tr>
                    </thead>
    
                    <tbody>
                      {
                        orders.map((order, index) => 
                          <tr key={order.id}>
                            <td>{index + 1}</td>
                            <td style={{cursor: "pointer"}} onClick={() => {toggle(); setOrdersItem(order.lines)}}>{order.id}</td>
                            <td>{order.created}</td>
                            <td>${order.total_amount}</td>
                            <td>{order.payment_method === 'CASH' ? 'Cash On Delivery' : 'Online Payment'}</td>
                            <td>{order.customer_email}</td>
                            <td>{order.customer_phone}</td>
                            <td>{`${order.customer_address}, ${order.customer_district}, ${order.customer_ward}`}</td>
                            <td onClick={() => handleDelete(order.id)} style={{cursor: "pointer"}}><FontAwesomeIcon size="2x" icon={faTimes}/></td>
                            {/* <td className="status">
                              <div className="main">
                                {getStatus(order.status)}
                              </div>
                              <div className="list">
                                <div onClick={() => handleStatusClick(1, order)}>
                                  <FontAwesomeIcon size="2x" icon={faTimes}/>
                                </div>
                                <div onClick={() => handleStatusClick(2, order)}>
                                  <FontAwesomeIcon size="2x" icon={faShippingFast} />
                                </div>
                                <div onClick={() => handleStatusClick(3, order)}>
                                  <FontAwesomeIcon size="2x" icon={faCheck}/>
                                </div>
                              </div>
                            </td> */}
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
        <Row>
        <Modal isOpen={modal} toggle={toggle}>
          <div className="items-modals">  
            <Table>
              <thead>
                <tr>
                  <th></th>
                  <th>Items</th>
                  <th>Quantity</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                { 
                  orderItems && orderItems.length && products && products.length ?
                  orderItems.map(function(line) {
                    for (let product of products) {
                      if (line.product === product.id) {
                        return {
                          ...product,
                          quantity: line.quantity
                        };
                      }
                    }}).map(item => 
                  <tr key={item._id}>
                    <th scope="row">
                      <div className="img-wrapper">
                        <img src={`http://127.0.0.1:8000${item.photo[0]}`} alt="" />
                      </div>
                    </th>
                    <td>
                      <div className="title">{item.name}</div>
                      <div className="price">${item.final_price}.00</div>
                    </td>
                    <td>
                      {item.quantity}
                    </td>
                    <td>${parseInt(item.quantity) * item.final_price}.00</td>
                  </tr>) : null
                }
              </tbody>
            </Table>
          </div>
        </Modal>
        
        </Row>
      </Container>
    </div>
  );
}

export default AdminOrders;