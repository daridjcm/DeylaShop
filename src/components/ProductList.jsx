import React, { useState, useEffect } from 'react';

const STORAGE_KEY = 'deylaCart';

const getCartFromStorage = () => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveCartToStorage = (cart) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
};

const getCartQuantity = (cart) => {
  return cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
}

export function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [sortOrder, setSortOrder] = useState('');

  useEffect(() => {  
    const fetchProducts = async () => {
      try {
        console.log('Fetching products...');
        const res = await fetch('https://dummyjson.com/products');
        if (!res.ok) {
          throw new Error(`Network response was not ok: ${res.statusText}`);
        }
        const data = await res.json();
        const productData = data.products.map((product) => ({
          srcImg: product.thumbnail,
          altImg: product.title,
          idImg: product.id.toString(),
          name: product.title,
          description: product.description,
          price: product.price,
          reference: product.sku,
          category: product.category,
          weight: product.weight,
          availabilityStatus: product.availabilityStatus,
          warranty: product.warrantyInformation,
          rate: product.rating,
          stock: product.stock,
        }));
        setProducts(productData);
      } catch (error) {
        setError('Error fetching data.');
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);
  

  useEffect(() => {
    let sortedProducts = [...products];
    if (sortOrder === 'price-asc') {
      sortedProducts.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'price-desc') {
      sortedProducts.sort((a, b) => b.price - a.price);
    } else if (sortOrder === 'rating-desc') {
      sortedProducts.sort((a, b) => b.rate - a.rate);
    }
    setProducts(sortedProducts);
  }, [sortOrder]);

  const handleOpenModal = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  const addCart = (product) => {
    console.log('Adding to cart:', product);
    const cart = getCartFromStorage();
    const existing = cart.find((item) => item.id === product.idImg);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        id: product.idImg,
        name: product.name,
        price: product.price,
        srcImg: product.srcImg,
        altImg: product.altImg,
        quantity: 1,
      });
    }

    saveCartToStorage(cart);
    const quantity = getCartQuantity(cart);
    window.dispatchEvent(new CustomEvent('cartUpdated', {
      detail: { quantity },
    }));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (products.length === 0) {
    return <p>No products found</p>;
  }


  return (
    <section id='Products'>
      {/* Filter products */ }
      <div className="flex justify-start m-5 text-purple-700">
        <p className="m-2">Sort by:</p>
        <select className="border border-purple-500 bg-purple-300 rounded-lg px-4 py-2" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="">Default</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating-desc">Rating: High to Low</option>
        </select>
      </div>
      {/* Products */}
      <div className="flex flex-wrap content-center items-center gap-y-20 gap-x-3">
        {products.map((product) => (
          <div
            key={product.idImg}
            className="flex flex-col bg-[#0c0c0c] sm:w-1/2 md:w-1/4 lg:w-1/6 m-auto p-4 rounded-lg max-w-full max-h-[600px] shadow-md cursor-pointer hover:scale-105 transition-transform"
          >
            <div className="flex justify-center" onClick={() => handleOpenModal(product)}>
              <img
                className="w-40 h-40 object-cover"
                src={product.srcImg}
                alt={product.altImg}
                id={product.idImg}
              />
            </div>
            <div className="flex flex-col justify-between h-full">
              <div className="overflow-hidden">
                <p className="text-slate-100 font-light truncate">
                  {product.name}
                </p>
                <p className="text-green-500 font-bold">${product.price}</p>
                <p
                  className="text-slate-200 font-semibold opacity-60 cursor-pointer truncate hover:opacity-100 transition-opacity" onClick={() => handleOpenModal(product)}
                >
                  {product.description}
                </p>
                <p className='bg-slate-50 w-fit rounded-lg px-2 text-purple-400 font-bold'>
                  {product.category}
                </p>
              </div>
              <button
                className="bg-purple-400 text-purple-700 w-fit py-1 px-2 rounded-2xl hover:bg-purple-500 transition-all mt-4"
                type="button"
                onClick={() => addCart(product)}
              >
                <span className="icon-[solar--cart-large-2-broken] text-slate-100 mr-1" role="img" aria-hidden="true" /> Add to cart
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* Details Product */}
      {selectedProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
          <div className="relative bg-[#131313] text-slate-100 p-4 rounded-lg max-w-md w-full h-fit">
            <button
              className="absolute top-2 right-2 text-white text-xl px-2 py-1"
              onClick={handleCloseModal}
            >
              <span className="icon-[mi--close] opacity-[0.5]" role="img" aria-hidden="true" />
            </button>
            <img className='w-4/12' src={selectedProduct.srcImg} alt={selectedProduct.altImg} />
            <h2 className="text-lg font-bold mb-2">
              {selectedProduct.name}
            </h2>
            <p className="mb-4">{selectedProduct.description}</p>
            <div className='list-none' id='otherInfo'>
              <li className="mr-3 text-yellow-300"><span className="icon-[material-symbols--star-half-outline] text-xl" />Rate: {selectedProduct.rate}</li>
              <li className="mr-3 text-blue-300"><span class="icon-[material-symbols-light--barcode] text-xl" /> Reference: {selectedProduct.reference}</li>
              <li className={`mr-3 ${selectedProduct?.availabilityStatus == 'In Stock' ? 'text-gray-500' : 'text-cyan-300'}`}>
              <span class="icon-[material-symbols--check-circle-rounded] text-xl" /> Availability: {selectedProduct.availabilityStatus} ({selectedProduct.stock})
              </li>
              <li className="mr-3 text-gray-300"><span class="icon-[hugeicons--weight-scale-01] text-xl" /> Weight: {selectedProduct.weight}</li>
              <li className="mr-3 text-pink-500"><span class="icon-[material-symbols--google-guarantee] text-xl" /> {selectedProduct.warranty}</li>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
