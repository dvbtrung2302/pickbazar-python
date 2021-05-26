import React, { useContext, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { 
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Button
} from 'reactstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudUploadAlt, faTimes } from "@fortawesome/free-solid-svg-icons";

import '../../css/Admin/ProductFunc.css';
import { AdminContext } from '../../contexts/AdminContext';

function validateFn(input = '', info = '') {
  if (!input) {
    return `The ${info} field is required.`
  }
  if (info !== 'price' && info !== 'value') {
    if (input.length < 6) {
      return `${info.charAt(0).toUpperCase() + info.slice(1)} must be at least 5 characters.`
    }
  }
  return '';
}

const ProductFunc = () => {
  const { open, setOpen, product, setProducts, option, setPromotions, promotion } = useContext(AdminContext);
  const [ data, setData ] = useState({});
  const [errors, setError] = useState({
    name: '',
    price: '',
    author: '',
    slug: ''
  });
  const [imageSrc, setImageSrc] = useState("");
  const divElement = useRef(null);
  const [categories, setCategories] = useState([]);
  const imageRef= useRef(null);

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/categories/?format=json`)
         .then(res => {
           setCategories(res.data)
         })
         .catch(err => {
           console.log(err);
         })
  }, [])

  useEffect(() => {
    if (option === 'promotions-add' || option === 'promotions-update') {
      if (option !== 'promotions-add') {
        setData({
          ...promotion,
          title: promotion.name
        });
      }
    } else {
      if (option !== 'add') {
        setData(product);
      } else {
        setData({category:  categories && categories.length && categories[0].id});
      }
    }

    if (open) {
      divElement.current.focus();
    }
    return () => {
      setData({});
      setError({});
    }
  }, [open, product, option])
  
  const categoryList = [
    { name: 'Children Literature' },
    { name: 'Comic Book' },
    { name: 'Fantasy' },
    { name: 'Horror' },
    { name: 'Novel' },
    { name: 'Romantic' },
    { name: 'Science Fiction' },
    { name: 'Thriller' }
  ];

  const validate = (isPromotion) => {
    if (isPromotion) {
      const nameError = validateFn(data.title, 'name') || '';
      const descriptionError = validateFn(data.description, 'description') || '';
      const codeError = validateFn(data.code, 'code') || '';
      const valueError = validateFn(data.value, 'value') || '';
  
      if (nameError || descriptionError || codeError || valueError) {
        setError({
          name: nameError,
          description: descriptionError,
          code: codeError,
          value: valueError,
        })
        return false;
      }
      return true;
    } else {
      const nameError = validateFn(data.title, 'name') || '';
      const descriptionError = validateFn(data.description, 'description') || '';
      const priceError = validateFn(data.price, 'price') || '';
      const slugError = validateFn(data.slug, 'slug') || '';
  
      if (nameError || descriptionError || priceError || slugError) {
        setError({
          name: nameError,
          description: descriptionError,
          price: priceError,
          slug: slugError
        })
        return false;
      }
      return true;
    }
  }

  const toSlug = (str) => {
    // Chuyển hết sang chữ thường
    str = str.toLowerCase();     
 
    // xóa dấu
    str = str.replace(/(à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ)/g, 'a');
    str = str.replace(/(è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ)/g, 'e');
    str = str.replace(/(ì|í|ị|ỉ|ĩ)/g, 'i');
    str = str.replace(/(ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ)/g, 'o');
    str = str.replace(/(ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ)/g, 'u');
    str = str.replace(/(ỳ|ý|ỵ|ỷ|ỹ)/g, 'y');
    str = str.replace(/(đ)/g, 'd');
 
    // Xóa ký tự đặc biệt
    str = str.replace(/([^0-9a-z-\s])/g, '');
 
    // Xóa khoảng trắng thay bằng ký tự -
    str = str.replace(/(\s+)/g, '-');
 
    // xóa phần dự - ở đầu
    str = str.replace(/^-+/g, '');
 
    // xóa phần dư - ở cuối
    str = str.replace(/-+$/g, '');
 
    // return
    return str;
  }

  const handleEsc = (event) => {
    if (event.keyCode === 27) {
      setOpen(false)
    }
  }

  const handleImage = (event) => {
    const file = event.currentTarget.files[0];
    imageRef.current = file;
    const reader = new FileReader();
    const url = reader.readAsDataURL(file);

    reader.onloadend = (e) => {
      setImageSrc(reader.result);
    }
  }

  const handleInput = (event) => {
    if (event.target.name === 'title') {
      setData({...data, [event.target.name]: event.target.value, slug: toSlug(event.target.value)});
    } else {
      setData({...data, [event.target.name]: event.target.value});
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const token = localStorage.getItem('adminToken');
    if (option === 'promotions-add' || option === 'promotions-update') {
      const isValid = validate(true);
      if ( option !== 'promotions-add') {
        if (JSON.stringify(data) === JSON.stringify(promotion)) {
          return;
        }
        const postData = {
          name: data.name,
          category: data.category,
          slug: data.slug,
          description: data.description,
          price: data.price,
          sale: 0,
          sex: "MAN",
          available: true,
          size: []
        }
        console.log(postData)
        // if (isValid) {
        //   axios.patch('https://dvbt-bookstore.herokuapp.com/promotion/update-promotion', postData, { headers: {"Authorization" : `Bearer ${token}`}})
        //        .then(res => {
        //           setOpen(false);
        //           setPromotions();
        //        })
        // }
      } else {
        if (isValid) {
          const postData = {
            name: data.title,
            code: data.code,
            description: data.description,
            value: data.value,
            image: data.image
          }
          axios.post('https://dvbt-bookstore.herokuapp.com/promotion/create-promotion', postData, { headers: {"Authorization" : `Bearer ${token}`}})
               .then(res => {
                  setOpen(false);
                  setPromotions();
               })
        }
      }
    } else {
      if ( option !== 'add') {
        if (JSON.stringify(data) === JSON.stringify(product) && imageRef.current) {
          const formData = new FormData(); 
          formData.append('image', imageRef.current);
          formData.append('product', product.id);
          axios.post('http://127.0.0.1:8000/api/product_upload_image/', formData,  {headers: {'Content-Type': 'application/json'}})
                .then(res => {
                  setOpen(false);
                  setProducts();
                })
          return
        }
        const isValid = validate();
        if (isValid) {
          const postData = {
            name: data.title,
            category: data.category,
            slug: data.slug,
            description: data.description,
            price: data.price,
            sale: 0,
            sex: "MAN",
            available: true,
            size: []
          }
          axios.patch(`http://127.0.0.1:8000/api/products/${product.id}/`, postData)
               .then(res => {
                  setOpen(false);
                  setProducts();
               })
        }
      } else {
        const isValid = validate();
        const postData = {
          name: data.title,
          category: data.category,
          slug: data.slug,
          description: data.description,
          price: data.price,
          sale: 0,
          sex: "MAN",
          available: true,
          size: []
        }

        if (isValid) {
          axios.post('http://127.0.0.1:8000/api/products/', postData)
               .then(res => {
                 setOpen(false);
                 setProducts();
               })
        }
      }
    }
  }

  const handleDelete = () => {
    const token = localStorage.getItem('adminToken');
    const postData = {
      id: data.id
    }
    axios.delete(`http://127.0.0.1:8000/api/products/${data.id}/`, postData)
          .then(res => {
            setOpen(false);
            setProducts();
          })
  }
  
  const handleDeletePromotion = () => {
    const token = localStorage.getItem('adminToken');
    const postData = {
      _id: data._id
    }
    axios.post('https://dvbt-bookstore.herokuapp.com/promotion/delete-promotion', postData, { headers: {"Authorization" : `Bearer ${token}`}})
          .then(res => {
            setOpen(false);
            setPromotions();
          })
  }

  return(
    <div 
      className={ open ? "ProductFuncBackground update-active" : "ProductFuncBackground" } 
      onClick={() => setOpen(false)}
      onKeyDown={handleEsc}
      tabIndex="0"
      ref={divElement}
      >
      {
        option === "promotions-add" || option === 'promotions-update' ?
        <Container 
          className={ open ? "ProductFunc update-active" : "ProductFunc" }
          onClick={(event) => event.stopPropagation()}
        >
          <Row
            style={{
              position: "fixed",
              top: "0",
              width: "100%",
              left: "0",
              right: "0",
              margin: "0",
              padding: "50px 35px 0 70px",
            }}
          >
            <Col className="d-flex justify-content-between p-0">
              <h3 className="bt-header mb-5" style={{fontSize:"18px", color:"rgb(22,31,106)"}}>{option === 'promotions-add' ? 'Add Promotions' :'Update Promotions'}</h3>
              <FontAwesomeIcon icon={faTimes} onClick={() => setOpen(false)}/>
            </Col>
          </Row>
          <Form 
            style={{
              height: "100%",
              overflow: "scroll"
            }}
            onSubmit={handleSubmit}
          >
            <Row className="mb-5 w-100 m-0">
              <Col xl="4" style={{padding:"30px"}}>
                <span className="product-title">Upload your Promotion image here</span>
              </Col>
              <Col xl="8" className="product-background">
                <FormGroup>
                  <Input id="file" type="file" accept="image/*" name="image" onChange={handleImage} />
                  <Label for="file" className="input-wrapper">
                    <FontAwesomeIcon icon={faCloudUploadAlt} size="2x" />
                    <span>
                      <span>Drag/Upload </span>
                      your image here.
                    </span>
                  </Label>
                  {
                    data.image &&
                    <div className="img-wrapper">
                      <img src={data.image} alt="" />
                    </div>
                  }
                </FormGroup>
              </Col>
            </Row>

            <Row className="w-100 m-0">
              <Col xl="4" style={{padding:"30px"}}>
                <span className="product-title">Add your Promotions description and necessary information from here</span>
              </Col>
              <Col className="product-background">
                <FormGroup className="update-form">
                  <Label className="product-label" for="name">
                    Name
                    <span className="ml-1 text-danger">*</span>
                  </Label>
                  <Input autoComplete="off" onChange={handleInput} value={data.title || ''} className="product-form-control" id="name" type="text" name="title"/>
                  {errors.name && <div className="validation">{errors.name}</div>}
                </FormGroup>

                <FormGroup className="update-form">
                  <Label className="product-label" for="description">
                    Description
                    <span className="ml-1 text-danger">*</span>
                  </Label>
                  <div>
                    <textarea 
                      value={data.description || ''} 
                      className="product-form-control" 
                      id="description" 
                      type="text" 
                      name="description" 
                      onChange={handleInput}
                      autoComplete="off"
                    />
                  </div>
                  {errors.description && <div className="validation">{errors.description}</div>}
                </FormGroup>

                <FormGroup className="update-form">
                  <Label className="product-label" for="code">
                    Code
                    <span className="ml-1 text-danger">*</span>
                  </Label>
                  <Input autoComplete="off" onChange={handleInput} value={data.code || ''} className="product-form-control" id="code" type="text" name="code"/>
                  {errors.code && <div className="validation">{errors.code}</div>}
                </FormGroup>

                <FormGroup className="update-form">
                  <Label className="product-label" for="value">
                    Discount %
                    <span className="ml-1 text-danger">*</span>
                  </Label>
                  <Input autoComplete="off" onChange={handleInput} value={data.value || ''} className="product-form-control" id="author" type="number" name="value"/>
                  {errors.value && <div className="validation">{errors.value}</div>}
                </FormGroup>
              </Col>
            </Row>
            
            <Row className="update-btn">
              <Col xs="12" md="4" className="p-0 cancle-btn w-100">
                <Button className="w-100" onClick={() => setOpen(false)}>Cancle</Button>
              </Col>
              {
                option !== 'promotions-add' &&
                <Col xs="12" md="4" className="p-0 delete-btn w-100">
                  <Button className="w-100" onClick={handleDeletePromotion}>Delete Promotions</Button>
                </Col>
              }
              <Col xs="12" md="4" className="p-0 submit-btn w-100">
                <Button className="w-100" type="submit">{option === 'promotions-add' ? 'Create Promotion' : 'Update Promotion'}</Button>
              </Col>
            </Row>
          </Form>
        </Container> :
        <Container 
          className={ open ? "ProductFunc update-active" : "ProductFunc" }
          onClick={(event) => event.stopPropagation()}
        >
          <Row
            style={{
              position: "fixed",
              top: "0",
              width: "100%",
              left: "0",
              right: "0",
              margin: "0",
              padding: "50px 35px 0 70px",
            }}
          >
            <Col className="d-flex justify-content-between p-0">
              <h3 className="bt-header mb-5" style={{fontSize:"18px", color:"rgb(22,31,106)"}}>{option === 'add' ? 'Add Product' :'Update Product'}</h3>
              <FontAwesomeIcon icon={faTimes} onClick={() => setOpen(false)}/>
            </Col>
          </Row>
          <Form 
            style={{
              height: "100%",
              overflow: "scroll"
            }}
            onSubmit={handleSubmit}
          >
            {
              option !== "add" &&
              <Row className="mb-5 w-100 m-0">
                <Col xl="4" style={{padding:"30px"}}>
                  <span className="product-title">Upload your Product image here</span>
                </Col>
                <Col xl="8" className="product-background">
                  <FormGroup>
                    <Input id="file" type="file" accept="image/*" name="image" onChange={handleImage} />
                    <Label for="file" className="input-wrapper">
                      <FontAwesomeIcon icon={faCloudUploadAlt} size="2x" />
                      <span>
                        <span>Drag/Upload </span>
                        your image here.
                      </span>
                    </Label>
                    {
                      data.image &&
                      <div className="img-wrapper">
                        <img src={imageSrc || `http://127.0.0.1:8000${product.photo[0]}`} alt="" />
                      </div>
                    }
                  </FormGroup>
                </Col>
              </Row>
            }

            <Row className="w-100 m-0">
              <Col xl="4" style={{padding:"30px"}}>
                <span className="product-title">Add your Product description and necessary information from here</span>
              </Col>
              <Col className="product-background">
                <FormGroup className="update-form">
                  <Label className="product-label" for="name">
                    Name
                    <span className="ml-1 text-danger">*</span>
                  </Label>
                  <Input autoComplete="off" onChange={handleInput} value={data.title || ''} className="product-form-control" id="name" type="text" name="title"/>
                  {errors.name && <div className="validation">{errors.name}</div>}
                </FormGroup>

                <FormGroup className="update-form">
                  <Label className="product-label" for="description">
                    Description
                    <span className="ml-1 text-danger">*</span>
                  </Label>
                  <div>
                    <textarea 
                      value={data.description || ''} 
                      className="product-form-control" 
                      id="description" 
                      type="text" 
                      name="description" 
                      onChange={handleInput}
                      autoComplete="off"
                    />
                  </div>
                  {errors.description && <div className="validation">{errors.description}</div>}
                </FormGroup>

                <FormGroup className="update-form">
                  <Label className="product-label" for="price">
                    Price
                    <span className="ml-1 text-danger">*</span>
                  </Label>
                  <Input autoComplete="off" onChange={handleInput} value={data.price || ''} className="product-form-control" id="price" type="number" name="price"/>
                  {errors.price && <div className="validation">{errors.price}</div>}
                </FormGroup>

                <FormGroup className="update-form">
                  <Label className="product-label" for="category">
                    Category
                    <span className="ml-1 text-danger">*</span>
                  </Label>
                  <Input 
                    autoComplete="off"
                    onChange={handleInput} 
                    className="product-form-control" 
                    id="category" 
                    type="select" 
                    name="category"
                    value={
                      data.category ||
                      (categories && 
                      categories.length && 
                      categories.find(item => item.id === product.category) &&
                      categories.find(item => item.id === product.category).id)
                    }
                  >
                    { categories.map(item => ({value: item.id, name: item.name})).map(category => 
                        <option key={category.value} value={category.value}>{category.name}</option>
                      ) 
                    }
                  </Input>
                </FormGroup>

                <FormGroup className="update-form">
                  <Label className="product-label" for="slug">
                    Slug
                    <span className="ml-1 text-danger">*</span>
                  </Label>
                  <Input autoComplete="off" onChange={handleInput} value={(data.title && toSlug(data.title)) || ''} className="product-form-control" id="slug" type="text" name="slug"/>
                  {errors.slug && <div className="validation">{errors.slug}</div>}
                </FormGroup>
              </Col>
            </Row>
            
            <Row className="update-btn">
              <Col xs="12" md="4" className="p-0 cancle-btn w-100">
                <Button className="w-100" onClick={() => setOpen(false)}>Cancle</Button>
              </Col>
              {
                option !== 'add' &&
                <Col xs="12" md="4" className="p-0 delete-btn w-100">
                  <Button className="w-100" onClick={handleDelete}>Delete Product</Button>
                </Col>
              }
              <Col xs="12" md="4" className="p-0 submit-btn w-100">
                <Button className="w-100" type="submit">{option === 'add' ? 'Create Product' : 'Update Product'}</Button>
              </Col>
            </Row>
          </Form>
        </Container>
      }
    </div>
  );
}

export default ProductFunc;