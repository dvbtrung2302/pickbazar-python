import React from 'react';
import axios from 'axios';
import queryString from 'query-string';

export const ProductsContext = React.createContext();

const CancelToken = axios.CancelToken;
const source = CancelToken.source();

export class ProductsProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      relatedItems: null,
      product: {},
      isLoading: true,
      isLoadMore: true,
      keyword: '',
      filters: {
        category: null,
        categoryName: "",
        _limit: 8,
        _keyword: ''
      }
    }
    this.setCategory = this.setCategory.bind(this);
    this.setStateDefault = this.setStateDefault.bind(this);
    this.setKeyword = this.setKeyword.bind(this);
    // this.filterProducts = this.filterProducts.bind(this);
    this.onLoadMoreBtnClick = this.onLoadMoreBtnClick.bind(this);
    this.getProducts = this.getProducts.bind(this);
    this.setProduct = this.setProduct.bind(this);
  }

  getProducts() {
    const { filters } = this.state;
    axios.get(`http://127.0.0.1:8000/api/products/`)
          .then(res => {
            this.setState({
              products: res.data,
              isLoading: false,
            })
          })
          .catch(err => {
            console.log(err);
          })
  }

  componentDidMount() {
    this.getProducts();
  }

  componentDidUpdate(preProps, preState) {
    if(preState.filters !== this.state.filters) {
      this.getProducts();
    }
  }


  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.products === nextState.products 
      && this.state.displayCategory === nextState.displayCategory
      && this.state.keyword === nextState.keyword
      && this.state.filters === nextState.filters
      && this.state.product === nextState.product
    ) {
      return false;
    }
    return true;
  }

  componentWillUnmount() {
    source.cancel();
  }

  setCategory(category = '') {
    const { filters } = this.state;
    window.scrollTo({
      top: window.innerHeight - 90,
      behavior: "smooth"
    });
    this.setState(prevState => ({
      ...prevState,
      filters: {
        ...prevState.filters,
        category: category.id,
        categoryName: category.name
      }
    }))
  }

  setKeyword(keyword = '') {
    this.setState({
      filters: {
        ...this.state.filters,
        _keyword: keyword
      },
      isLoading: true
    })
  }

  setStateDefault() {
    this.setState({
      products: [],
      isLoading: true,
      isLoadMore: true,
      keyword: '',
      filters: {
        _category: null,
        _limit: 8
      },
      product: {}
    })
  }

  onLoadMoreBtnClick() {
    const { filters } = this.state;
    this.setState({
      filters: {
        ...filters,
        _limit: filters._limit + 8
      },
      isLoadMore: true
    })
  }

  setProduct(id = '') {
    axios.get(`http://127.0.0.1:8000/api/products/${id}`, { cancelToken: source.token })
          .then(res => {
            this.setState({
              product: res.data,
              relatedItems: res.data.category
            })
          })
          .catch(err => {
            console.log(err);
          });
  }

  // filterProducts(category = '', keyword = '') {
  //   const { products } = this.state;
  //   if (category) {
  //     const filteredProducts = products.filter(function(product) {
  //       return product.category.indexOf(category) !== -1;
  //     });
  //     return filteredProducts;
  //   }
  //   if (keyword) {
  //     const filteredProducts = products.filter(function(product) {
  //       return product.title.toLisLoadingowerCase().indexOf(keyword.toLowerCase()) !== -1;
  //     });
  //     return filteredProducts;
  //   }
  //   return products;
  // }

  render() {
    const { displayCategory, keyword, filters, isLoading, products, product, relatedItems, isLoadMore } = this.state;
    // const products = this.filterProducts(displayCategory, keyword);
    return(
      <ProductsContext.Provider value={{
        products: products,
        setCategory: this.setCategory,
        setStateDefault: this.setStateDefault,
        setKeyword: this.setKeyword,
        categoryName: displayCategory,
        keyword: keyword,
        filters: filters,
        onLoadMoreBtnClick: this.onLoadMoreBtnClick,
        isLoading: isLoading,
        product: product,
        setProduct: this.setProduct,
        setRelatedItems: this.setRelatedItems,
        relatedItems: relatedItems,
        isLoadMore: isLoadMore
      }}>
        {this.props.children}
      </ProductsContext.Provider>
    );
  }
}