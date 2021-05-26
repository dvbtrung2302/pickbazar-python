import React, { useState, useContext, useEffect } from 'react';
import { Link  } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThLarge } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import '../../css/Client/Category.css';
import Burger from '../Burger';
import { ProductsContext } from '../../contexts/ProductsContext';

const Category = (props) => {
  const { setCategory, filters } = useContext(ProductsContext);
  const [ isClick, setClick ] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/categories/?format=json`)
         .then(res => {
           console.log(res);
           setCategories(res.data)
         })
         .catch(err => {
           console.log(err);
         })
  }, [])

  const handleCatClick = () => {
    setClick(!isClick);
  }
  
  return (
    <div className={isClick ? "Category category-active" : "Category"}>
      <div className="logo">
        <FontAwesomeIcon icon={faThLarge} className="mr-2" />
        Select your Category
      </div>
      <ul>
        { categories.map(item => 
          <li key={item.id} className="my-3" onClick={() => setCategory({id: item.id, name: item.name})}>
            <Link 
              to="/"
              className={filters.category === item.id ? 'active' : null}
            >
              {item.name}
            </Link>
          </li>
        )}
      </ul>
      <Burger isClick={isClick} handleCatClick={handleCatClick} />
    </div>
  );
}

export default Category;