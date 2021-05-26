import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Progress, Table } from 'reactstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { ProductsContext } from '../../contexts/ProductsContext';

const OrderDetails =  (props) => {
  const { mobile, index, i, show, order } = props;
  const { products } = useContext(ProductsContext);
  const className = 
  (mobile ? "order-detail d-flex d-xl-none" : "order-detail d-none d-xl-flex") 
  + (index === i && show ? " detail-active" : "");
  let result = []
  if (products && products.length && order && order.lines) {
    result = order.lines.map(function(line) {
      for (let product of products) {
        if (line.product === product.id)
          return {
            ...product,
            quantity: line.quantity
          };
      }
    });
  }
 
  return(
    <div className={className} style={mobile ? {maxHeight:"0", overflow:"hidden", padding:"0"} : null}>
      <h3 className="bt-header d-none d-xl-block">Order Details</h3>
      {
        !order ? <span style={{
          fontSize:"15px",
          fontWeight:"700",
          color:"rgb(119, 121, 140)",
          display:"block",
          width:"100%",
          textAlign:"center",
          padding:"40px 0px"
        }}>No Order found.</span> :
        <React.Fragment>
          <div className="details">
            <div className="address">
              <div className="title">Delivery Address</div>
              <span>{order && `${order.customer_address}, ${order.customer_district}, ${order.customer_ward}` }</span>
              <div className="title mt-4">Payment Method</div>
              <span>{order.payment_method === 'CASH' ? 'Cash On Delivery' : 'Online Payment'}</span>
            </div>
            <div className="info">
              <div>
                Sub Total
                <span>${order && order.total_amount }.00</span>
              </div>
              <div>
                Discount
                <span>$0</span>
              </div>
              <div>
                Delivery Fee
                <span>$0</span>
              </div>
              <div>
                Total
                <span>${order && order.total_amount }.00</span>
              </div>
            </div>
          </div>
          {/* <div className="progress-wrapper">
            <Progress value={(order.status / 3) * 100}>
              <div className="des">
                <div className={`check-btn ${order.status < 1 ? 'not-completed' : ''}`}>
                  {
                    order.status === 1 ?
                    <FontAwesomeIcon icon={faCheck} /> :
                    1
                  }
                </div>
                <div className="text">Order Received</div>
              </div>
              <div className="des">
                <div className={`check-btn ${order.status < 2 ? 'not-completed' : ''}`}>
                  {
                    order.status === 2 ?
                    <FontAwesomeIcon icon={faCheck} /> :
                    2
                  }
                </div>
                <div className="text">Order On The Way</div>
              </div>
              <div className="des">
                <div className={`check-btn ${order.status < 3 ? 'not-completed' : ''}`}>
                  {
                    order.status === 3  ?
                    <FontAwesomeIcon icon={faCheck} /> :
                    3
                  }
                </div>
                <div className="text">Order Delivered</div>
              </div>
            </Progress>
          </div> */}
          <div className="items">  
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
                  result && result.length ?
                  result.map(item => 
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
        </React.Fragment>
      }
    </div>
  );
}

OrderDetails.propTypes = {
  mobile: PropTypes.bool,
  index: PropTypes.number,
  i: PropTypes.number,
  show: PropTypes.bool,
  order: PropTypes.shape({
    address: PropTypes.string,
    city: PropTypes.string,
    district: PropTypes.string,
    totalPrice: PropTypes.number,
    cart: PropTypes.array
  })
}

export default OrderDetails;