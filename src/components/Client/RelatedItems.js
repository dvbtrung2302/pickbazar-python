import React, { useContext, useEffect, useState } from 'react';
import {
 Container,
 Row
} from 'reactstrap';

import '../../css/Client/RelatedItems.css';
import Product from './Product';
import { ProductsContext } from '../../contexts/ProductsContext';
import ProductsLoading from './ProductsLoading';

export default function() {
  const { relatedItems, products } = useContext(ProductsContext);
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(products.filter(item => item.category === relatedItems).slice(0, 8));
  }, [relatedItems, products])

  return(
    <div className="RelatedItems">
      <Container>
        <Row className="ml-2">
          <h1>Related Items</h1>
        </Row>
        {
          !items.length ? <ProductsLoading /> :
          <Row>
            {
              items.map(product => 
                <Product 
                  key={product._id} 
                  item={{
                    ...product,
                    _id: product.id,
                    image: `http://127.0.0.1:8000${product.photo[0]}`,
                    category: product.category_name,
                    title: product.name,
                    price: product.price
                  }} 
                  type='related' 
                />)
            }
          </Row>
        }
      </Container>
    </div>
  );
}