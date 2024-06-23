import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllProducts } from '../actions/productAction';
import Product from '../components/product';
import Loading from '../components/Loading';
import Error from '../components/Error';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';

export default function Homescreen() {
  const dispatch = useDispatch();
  const { products, error, loading } = useSelector(state => state.products);

  // Filtre
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategorie, setSelectedCategorie] = useState('');

  // Get products
  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);

  // Filtre
  const filteredProducts = products.filter(product => {
    const matchesName = product.Nom.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategorie = selectedCategorie ? product['Categorie'] === selectedCategorie : true;
    return matchesName && matchesCategorie;
  });

  const handleCategoryChange = (categorie) => {
    setSelectedCategorie(categorie);
  };

  // Add "All" to the list of categories
  const categories = ['All', ...new Set(products.map(product => product.Categorie))];

  const renderCustomButtons = (categories) => {
    const chunkSize = 4; // Number of buttons per slide
    const chunks = [];
    for (let i = 0; i < categories.length; i += chunkSize) {
      chunks.push(categories.slice(i, i + chunkSize));
    }
    return chunks.map((chunk, index) => (
      <div key={index} className="category-slide">
        {chunk.map((categorie) => (
          <button
            key={categorie}
            className={`category-btn ${selectedCategorie === categorie || (categorie === 'All' && selectedCategorie === '') ? 'active' : ''} col-xs-3 col-3 col-md-3`}
            onClick={() => handleCategoryChange(categorie === 'All' ? '' : categorie)}
          >
            {categorie}
          </button>
        ))}
      </div>
    ));
  };

  console.log("Products:", products);
  console.log("Filtered Products:", filteredProducts);

  return (
    <div>
      <div className='search-bar col-11 col-xl-8 col-md-11 text-center mt-5'>
        <h2 className='mb-3'>Search Products</h2>
        <input
          className="form-control text-center"
          id="search-input"
          type='search'
          placeholder='Search by product name ...'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <img src="https://i.postimg.cc/W1cMftDX/Lavazza1.jpg" alt="Lavazza" className='col-11 col-md-11 mt-3' />
      <div className="category-buttons mt-5 col-xs-12 col-12 col-md-12 col-xl-10">
        <Carousel 
          showThumbs={false} 
          infiniteLoop 
          useKeyboardArrows 
          interval={1000} // Time between transitions in milliseconds (5 seconds)
          transitionTime={200} // Duration of the transition animation in milliseconds (1 second)
          showIndicators={false} 
          showStatus={false}
        >
          {renderCustomButtons(categories)}
        </Carousel>
      </div>
      <div className='row justify-content-center col-xl-10 col-md-12 col-12 mx-auto'>
        {loading ? (
          <Loading />
        ) : error ? (
          <Error error='Something went wrong' />
        ) : (
          filteredProducts.map((product) => (
            <div key={product._id} className='col-12 col-md-6'>
              <Product 
                product={product}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
