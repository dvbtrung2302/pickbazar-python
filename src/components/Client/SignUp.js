import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {
  Form,
  FormGroup,
  Button, 
  Input,
  Label
} from 'reactstrap';

import { AreaContext } from '../../contexts/AreaContext';

function validateFn(input = '', info = '', length = true, password) {
  if (!input) {
    return `The ${info} field is required.`
  }
  if (input.length < 6 && length) {
    return `${info.charAt(0).toUpperCase() + info.slice(1)} must be at least 5 characters.`
  }
  if (input !== password && password) {
    return "Password Incorect."
  }
  return '';
}

const SignUp = (props) => {
  const { changeForm } = props;
  const [user, setUser] = useState({
    first_name: '',
    last_name: '',
    username: '',
    password: '',
    confirm_password: "",
  });
  const [errors, setError] = useState({
    first_name: '',
    last_name: '',
    username: '',
    password: '',
    confirm_password: "",
  });
  const { cities, districts, handleCityClick } = useContext(AreaContext); 
  
  // useEffect(() => {
  //   axios.get('https://dvbt-areas.herokuapp.com/cities')
  //        .then(res => {
  //          setCity(res.data);
  //        })
  // })

  // const handleCity = (event) => {
  //   event.preventDefault();
  //   axios.get(`https://dvbt-areas.herokuapp.com/districts?city=${event.target.value}`)
  //        .then(res => {
  //          setDistrict(res.data);
  //        })
  // }

  const validate = () => {
    const firstNameError = validateFn(user.first_name, 'First Name', false) || '';
    const lastNameError = validateFn(user.last_name, 'Last Name', false) || '';
    const usernameError = validateFn(user.username, 'Username') || '';
    const passwordError = validateFn(user.password, 'Password') || '';
    const confirmPasswordError = validateFn(user.confirm_password, 'Confirm Password', true, user.password) || '';
    
    if (firstNameError || lastNameError || usernameError || passwordError || confirmPasswordError) {
      setError({
        first_name: firstNameError,
        last_name: lastNameError,
        username: usernameError,
        password: passwordError,
        confirm_password: confirmPasswordError,
      })
      return false;
    }
    return true;
  }

  const handleInput = (event) => {
    event.preventDefault();
    setUser({...user, [event.target.name]: event.target.value})
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const isValid = validate();
    if (isValid) {
      axios.post('http://127.0.0.1:8000/api/sign_up/', {
              username: user.username,
              password: user.password,
              first_name: user.first_name,
              last_name: user.last_name
            })
            .then((res) => {
              changeForm('signin');
            })
            .catch(err => {
              console.log(err)
            });
    }
  };
  return(
    <div className="AuthForm">
      <div className="header">
        <h1>Sign Up</h1>
        <p>By signing up, you agree to Pickbazar's</p>
      </div>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label for="first_name">
            FIRST NAME
            <span className="ml-1 text-danger">*</span>
          </Label>
          <Input id="first_name" type="text" name="first_name" onChange={handleInput} autoComplete="off" />
          {errors.first_name && <div className="validation">{errors.first_name}</div>}
        </FormGroup>
        <FormGroup>
          <Label for="last_name">
            LAST NAME
            <span className="ml-1 text-danger">*</span>
          </Label>
          <Input id="last_name" type="text" name="last_name" onChange={handleInput} autoComplete="off" />
          {errors.last_name && <div className="validation">{errors.last_name}</div>}
        </FormGroup>
        <FormGroup>
          <Label for="username">
            USERNAME
            <span className="ml-1 text-danger">*</span>
          </Label>
          <Input id="username" type="text" name="username" onChange={handleInput} autoComplete="off"/>
          {errors.username && <div className="validation">{errors.username}</div>}
        </FormGroup>
        <FormGroup>
          <Label for="password">
            PASSWORD
            <span className="ml-1 text-danger">*</span>
          </Label>
          <Input id="password" type="password" name="password" onChange={handleInput} autoComplete="off"/>
          {errors.password && <div className="validation">{errors.password}</div>}
        </FormGroup>
        <FormGroup>
          <Label for="confirm_password">
            CONFIRM PASSWORD
            <span className="ml-1 text-danger">*</span>
          </Label>
          <Input id="confirm_password" type="password" name="confirm_password" onChange={handleInput} autoComplete="off"/>
          {errors.confirm_password && <div className="validation">{errors.confirm_password}</div>}
        </FormGroup>
        <Button size="lg" block type="submit">
          Continue
        </Button>
      </Form>
      <div className="footer">
        Already have an account?
        <span onClick={() => changeForm('signin')}>Sign In</span>
      </div>
    </div>
  )
}

SignUp.propTypes = {
  changeForm: PropTypes.func
}

export default SignUp;