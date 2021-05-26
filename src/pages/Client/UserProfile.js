import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Form,
  FormGroup,
  Label,
  Input,
  Button
} from 'reactstrap';

import '../../css/Client/UserProfile.css';
import { AuthContext } from '../../contexts/AuthContext';
import UserInfo from '../../components/Client/UserInfo';
import Alert from '../../components/Alert';
import UserSideBar from '../../components/Client/UserSideBar';
import LoadingPage from '../../components/LoadingPage';

const  UserProfile = () => {
  const { user, userLogin, loading, token } = useContext(AuthContext);
  const [data, setData] = useState({});
  const [isSave, setSave] = useState(false);
  const [dataPass, setDataPass] = useState({});
  const [error, setError] = useState(false);
  const [invalid, setInvalid] = useState("");

  useEffect(() => {
    document.title = 'Profile - PickBazar';
    setData(user);
  }, [user])

  const handleSubmit = (event) => {
    event.preventDefault();
    if (JSON.stringify(data) === JSON.stringify(user)) {
      return;
    }
    // if (data.district === 'Quận/Huyện' || data.city === 'Tỉnh/Thành phố')  {
    //   return;
    // }
    
    // const token = localStorage.getItem('token');
    axios.put('http://127.0.0.1:8000/api/me/', data, { headers: {"Authorization" : `Bearer ${token}`}})
         .then(res => {
           setSave(true);
         })
        //  .then(() => {
        //    setTimeout(() => {
        //     setSave(false)
        //    }, 2000)
        //  })
  }

  const handleChangePass = (event) => {
    event.preventDefault();
    if (!dataPass.new_password || !dataPass.confirm_new_password) {
      setError(true)
      setInvalid("")
      return;
    }
    if (dataPass.confirm_new_password !== dataPass.new_password) {
      setInvalid("Confirm password does not match")
      return;
    }
    const postData = {
      ...data,
      password: dataPass.new_password
    }
    
    axios.put('http://127.0.0.1:8000/api/me/', postData, { headers: {"Authorization" : `Bearer ${token}`}})
         .then(res => {
           setSave(true);
           setDataPass({})
         })
        //  .then(() => {
        //    setTimeout(() => {
        //     setSave(false)
        //    }, 2000)
        //  })
  }

  const handleInput = (event) => {
    setData({...data, [event.target.name]: event.target.value })
  }
  const handlePassInput = (event) => {
    setDataPass({...dataPass, [event.target.name]: event.target.value })
  }

  return(
    <div className="UserProfile user-container">
      <Alert option="edit" isOpen={isSave} />
      <div>
        <UserSideBar page="profile" />
      </div>
      {
        loading ?
        <LoadingPage /> :
        <div className="user-wrapper">
          <div className="profile mb-5">
            <h3 className="bt-header">Your Profile</h3>
            <Form className="AuthForm" onSubmit={handleSubmit}>
              <FormGroup>
                <Label for="name">FIRST NAME</Label>
                <Input 
                  id="first_name" 
                  type="text" 
                  name="first_name" 
                  value={data.first_name || ''}
                  onChange={handleInput}
                  required
                  disabled
                  autoComplete="off"
                />
              </FormGroup>
              <FormGroup>
                <Label for="name">LAST NAME</Label>
                <Input 
                  id="last_name" 
                  type="text" 
                  name="last_name" 
                  value={data.last_name || ''}
                  onChange={handleInput}
                  required
                  autoComplete="off"
                  disabled
                />
              </FormGroup>
              <FormGroup>
                <Label for="email">USERNAME</Label>
                <Input 
                  id="username"
                  name="username"
                  value={data.username || ''}
                  onChange={handleInput}
                  required  
                  disabled
                  autoComplete="off"
                />
              </FormGroup>
            </Form>
          </div>
          <div className="profile mb-5">
            <h3 className="bt-header">Change Password</h3>
            <Form className="AuthForm" onSubmit={handleChangePass}>
              <FormGroup>
                <Label for="name">NEW PASSWORD</Label>
                <Input 
                  id="new_password" 
                  type="password" 
                  name="new_password" 
                  value={dataPass.new_password || ''}
                  onChange={handlePassInput}
                  autoComplete="off"
                />
                {error && !dataPass.new_password && <div style={{position: "absolute"}} className="validation">This field is required.</div>}
              </FormGroup>
              <FormGroup>
                <Label for="email">CONFIRM NEW PASSWORD</Label>
                <Input 
                  id="confirm_new_password"
                  type="password" 
                  name="confirm_new_password"
                  value={dataPass.confirm_new_password || ''}
                  onChange={handlePassInput}
                  autoComplete="off"
                />
                {error && !invalid && !dataPass.confirm_new_password && <div style={{position: "absolute"}} className="validation">This field is required.</div>}
                {invalid  && <div style={{position: "absolute"}} className="validation">{invalid}</div>}
              </FormGroup>
              <Button type="submit">Change</Button>
            </Form>
          </div>
          {/* <div className="contact mb-5">
            <h3 className="bt-header">Contact Number</h3>
            <UserInfo isPhone handleInput={handleInput} handleSubmit={handleSubmit} data={data}/>
          </div>
          <div className="address">
            <h3 className="bt-header">Delivery Address</h3>
            <UserInfo handleInput={handleInput} handleSubmit={handleSubmit} data={data}/>
          </div> */}
        </div>
      }
    </div>
  );
}

export default UserProfile;