import React from 'react';
import axios from 'axios';

export const AuthContext = React.createContext();

const CancelToken = axios.CancelToken;
const source = CancelToken.source();

export class AuthProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: localStorage.getItem('token') || '',
      refresh: localStorage.getItem('refresh_token') || '',
      user: {},
      isAlertOpen: false, 
      isCheckoutClick: false,
      loading: true
    }
    this.setStateDefault = this.setStateDefault.bind(this);
    this.setAlertOpen = this.setAlertOpen.bind(this);
    this.setCheckoutClick = this.setCheckoutClick.bind(this);
    this.userLogin = this.userLogin.bind(this);
  }

  componentDidMount() {
    axios.get('http://127.0.0.1:8000/api/me/', { headers: {"Authorization" : `Bearer ${this.state.token}`}}, { cancelToken: source.token })
         .then(res => {
            this.setState({
              user: res.data,
              loading: false
            })
         })
         .catch(err => {
            axios.post('http://127.0.0.1:8000/api/token/refresh/', {refresh: this.state.refresh})
                .then(res => {
                  localStorage.setItem('token', res.data.access);
                  this.setState({
                    token: res.data.access,
                    loading: false
                  })
                  axios.get('http://127.0.0.1:8000/api/me/', { headers: {"Authorization" : `Bearer ${res.data.access}`}}, { cancelToken: source.token })
                      .then(res => {
                          this.setState({
                            user: res.data,
                            loading: false
                          })
                      })
              })
         })
  }

  componentWillUnmount() {
    source.cancel();
  }

  userLogin(token = '', refresh = '') {
    axios.get('http://127.0.0.1:8000/api/me/', { headers: {"Authorization" : `Bearer ${token}`}} )
    .then(res => {
      this.setState({
        token: token,
        refresh: refresh,
        user: res.data,
        loading: false
      })
    })
  }

  setStateDefault() {
    this.setState({
      token: '',
      isAlertOpen: false,
      user: {},
      isCheckoutClick: false
    })  
  }

  setAlertOpen() {
    this.setState({
      isAlertOpen: true
    }, () => {
      setTimeout(() => {
        this.setState({
          isAlertOpen: false
        })
      }, 2000)
    })
  }

  setCheckoutClick() {
    this.setState({
      isCheckoutClick: !this.state.isCheckoutClick
    })
  }

  render() {
    const { token, user, isAlertOpen, isCheckoutClick }= this.state;
    return(
      <AuthContext.Provider value={{
        token: token,
        user: user,
        setToken: this.setToken,
        setStateDefault: this.setStateDefault,
        setAlertOpen: this.setAlertOpen,
        isAlertOpen: isAlertOpen,
        isCheckoutClick: isCheckoutClick,
        setCheckoutClick: this.setCheckoutClick,
        userLogin: this.userLogin
      }}>
        {this.props.children}      
      </AuthContext.Provider>
    );
  }
}
