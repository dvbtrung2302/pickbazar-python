import React, { useContext, useState, useEffect } from 'react';
import { 
  Container,
  Row, 
  Spinner
} from 'reactstrap';

import '../../css/Client/Products.css';
import { ProductsContext } from '../../contexts/ProductsContext';
import NotFound from '../NotFound';
import ProductsLoading from './ProductsLoading';
import Product from './Product';

export default function(props) {
  const { products, filters, isLoadMore } = useContext(ProductsContext);
  const {_limit, _keyword, category, categoryName } = filters;
  const [ items, setItems ] = useState([]);
  const [ visible, setVisible ] = useState(10);
  const [ isLoading, setLoading ] = useState(false);

  const loadMore = () => {
    setLoading(true);
    return setTimeout(() => {
      setVisible(visible + 8)
      setLoading(false);
    }, 1000);
  }

  useEffect(() => {
    if (category && !_keyword) {
      setItems(products.filter(item => item.category === category));
    } else if (_keyword && !category) {
      setItems(products.filter(item => item.name.toLowerCase().includes(_keyword.toLowerCase())));
    } else if (_keyword && category) {
      setItems(products.filter(item => item.category === category).filter(item => item.name.toLowerCase().includes(_keyword.toLowerCase())));
    } else {
      setItems(products);
    }
  }, [products, category])

  return(
    <div className="Products">
      <Container className="h-100">
        {
          (_keyword) && 
          <Row style={{padding: "0 15px", marginBottom: "15px", fontWeight: "600"}}>
            {
              category ? 
              <div>
                Results for 
                <p className="d-inline font-weight-bold" style={{color: "rgb(0, 158, 127)"}}> "{_keyword}" </p> 
                in 
                <p className="d-inline font-weight-bold" style={{color: "rgb(0, 158, 127)"}}> {categoryName}</p>. 
              </div> :
              <div>
                Results for 
                <p className="d-inline font-weight-bold" style={{color: "rgb(0, 158, 127)"}}> "{_keyword}"</p>.
              </div>
            }
          </Row>
        }
        {
          (!items.length) ?
          (_keyword && !items.length ? <NotFound /> : <ProductsLoading /> ) :
          <Row>
            {
               items.slice(0, visible).map(item => 
                <Product 
                  key={item.id} 
                  item={{
                    ...item,
                    _id: item.id,
                    image: `http://127.0.0.1:8000${item.photo[0]}`,
                    categoryName: item.category_name,
                    title: item.name,
                    price: item.price
                  }} 
                />
                  
              )
            }
          </Row>
        }
        <Row className="m-0 w-100 d-flex justify-content-center">
            {
              (visible < items.length && !isLoading) &&
            <button onClick={loadMore} type="button" className="load-more mb-3">
              Load more
            </button>
            }
            { isLoading && <Spinner style={{color:"rgb(0, 158, 127)"}} className="mb-3" /> }
          </Row>
      </Container>
    </div>
  );
}