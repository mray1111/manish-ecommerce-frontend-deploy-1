import React, { Fragment, useEffect, useState } from 'react';
import './Products.css';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearErrors, getProduct } from '../../actions/productActions';
import Loader from '../layout/loader/Loader';
import ProductCard from '../Home/ProductCard';
import Pagination from 'react-js-pagination';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import { useAlert } from 'react-alert';
import Metadata from '../layout/Metadata';

const categories = [
  'Laptop',
  'Footwear',
  'Bottom Wear',
  'Tops',
  'Tshirts',
  'Books',
  'SmartPhone',
  'Camera',
  'Perfume',
  'Kurta',
  'Bags',
];

const Products = ({ match }) => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const [currentPage, setCurrentPage] = useState(1);
  const [price, setPrice] = useState([0, 250000]);
  const [category, setCategory] = useState('');
  const [ratings, setRatings] = useState(0);
  const [filtersActive, setFiltersActive] = useState(false); // Price filters
  const [categoryFiltersActive, setCategoryFiltersActive] = useState(false); // Category filters

  const {
    products,
    loading,
    error,
    productsCount,
    resultPerPage,
    filteredProductsCount,
  } = useSelector((state) => state.products);

  const { keyword } = useParams();

  const setCurrentPageNo = (e) => {
    setCurrentPage(e);
  };

  const priceHandler = (event, newPrice) => {
    setPrice(newPrice);
    setFiltersActive(true); // Price filters are active when the price changes
  };

  const categoryHandler = (selectedCategory) => {
    setCategory(selectedCategory);
    setCategoryFiltersActive(true); // Category filters are active when a category is selected
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    dispatch(getProduct(keyword, currentPage, price, category, ratings));
  }, [dispatch, keyword, currentPage, price, category, ratings, alert, error]);

  const clearFilters = () => {
    setPrice([0, 250000]);
    setCategory('');
    setRatings(0);
    setFiltersActive(false);
    setCategoryFiltersActive(false);
  };

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <Metadata title="PRODUCTS--- ECOMMERCE India ka own AMAZON" />
          <h2 className="productsHeading">Products</h2>
          <div className="container">
            <div className="products">
              {products &&
                products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
            </div>

            <div className="filterBox">
              <Typography>Price</Typography>
              <Slider
                value={price}
                onChange={priceHandler}
                valueLabelDisplay="auto"
                aria-labelledby="range-slider"
                min={0}
                max={250000}
              />

              <Typography>Categories</Typography>
              <ul className="categoryBox">
                {categories.map((category) => (
                  <li
                    className="category-link"
                    key={category}
                    onClick={() => categoryHandler(category)}
                  >
                    {category}
                  </li>
                ))}
              </ul>
              <fieldset>
                <Typography component="legend" id="rating-legend" className='ratings-above'>
                  Ratings Above
                </Typography>
                <Slider
                  value={ratings}
                  onChange={(e, newRating) => {
                    setRatings(newRating);
                  }}
                  aria-labelledby="rating-legend"
                  valueLabelDisplay="auto"
                  min={0}
                  max={5}
                />
              </fieldset>
            </div>

            {(filtersActive || categoryFiltersActive) && (
              <button onClick={clearFilters} className="clearFiltersButton">
                Filter Off
              </button>
            )}

            {resultPerPage < productsCount && (
              <div className="paginationBox">
                <Pagination
                  activePage={currentPage}
                  itemsCountPerPage={resultPerPage}
                  totalItemsCount={productsCount}
                  onChange={setCurrentPageNo}
                  nextPageText="Next"
                  prevPageText="Prev"
                  firstPageText="1st"
                  lastPageText="Last"
                  itemClass="page-item"
                  linkClass="page-link"
                  activeClass="pageItemActive"
                  activeLinkClass="pageLinkActive"
                />
              </div>
            )}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Products;
