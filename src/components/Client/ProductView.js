import React, { useContext, useState, useEffect } from 'react';
import { 
  Container, 
  Row,
  Col
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

import '../../css/Client/ProductView.css';
import CartBtn from './CartBtn';
import { ProductsContext } from '../../contexts/ProductsContext';
import ProductViewLoading from './ProductViewLoading';

function ProductView(props) {
  const [ isShow, setShow ] = useState(false);
  const { setCategory, setProduct, product  } = useContext(ProductsContext);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    })
    document.title = product.title ? `${product.title} - PickBazar` : 'PickBazar';
    const id = props.match.params.title.split("-")[props.match.params.title.split("-").length - 1];
    setProduct(id);
  }, [props.match.params.title, product.title])
  // useEffect(() => {
  //   window.scrollTo({
  //     top: 0,
  //     behavior: "smooth"
  //   })
  //   document.title = product.title ? `${product.title} - PickBazar` : 'PickBazar';
  //   setProduct(props.match.params.title);
  //   return () => {
  //     setLoading(true);
  //   }
  // }, [product.title, props.match.params.title, setProduct]);

  return(
    <div className="ProductView py-5">
      <Container fluid="lg">
        {
          (!product && Object.keys(product).length === 0) ? <ProductViewLoading /> : 
          <Row>
            <Col xl="6" lg="6" className="mb-5 text-center">
              <button 
                className="btn back-btn"
                onClick={() => props.history.goBack()}
              >
                <FontAwesomeIcon icon={faArrowLeft} className="mr-2"/>
                Back
              </button>
              <div className="img-wrapper">
                <img 
                  src={product.photo && `http://127.0.0.1:8000${product.photo[0]}`}
                  alt="" 
                />
              </div>
            </Col>
            <Col xl="6" lg="6">
              <div className="title">
                <h1>{product.name}</h1>
                <p>In {product.category_name}</p>
              </div>
              <div className="des">
                <p className={isShow ? 'des-show' : ''}>
                  {product.description}
                </p>
                {
                  !isShow ? 
                  <div 
                    className="read-more"
                    onClick={() => setShow(!isShow)}
                  >
                    Read more
                  </div> :
                  <div 
                  className="read-more"
                  onClick={() => setShow(!isShow)}
                >
                  Less
                </div>
                }
              </div>
              <div className="price">${product.price}</div>
              <CartBtn product={product} />
              <div className="category">
                <Link onClick={() => setCategory({id: product.category, name: product.category_name})} to="/" className="btn">
                  {product.category_name}
                </Link>
              </div>
            </Col>
          </Row>
        }
      </Container>
    </div>
  );
}

export default ProductView;