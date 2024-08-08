import React, { useState, useEffect } from 'react';
import type { Product } from '../types/Products';

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('Fetching products...');
        const res = await fetch('https://dummyjson.com/products');
        if (!res.ok) {
          throw new Error(`Network response was not ok: ${res.statusText}`);
        }
        const data = await res.json();
        console.log('API Data:', data);
        const productData: Product[] = data.products.map((product: any) => ({
          srcImg: product.thumbnail,
          altImg: product.title,
          idImg: product.id.toString(),
          name: product.title,
          description: product.description,
        }));
        setProducts(productData);
      } catch (error) {
        setError("Error fetching data.");
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  console.log('Products:', products);

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
    <div>
      {products.map((product) => (
        <div key={product.idImg} className="flex flex-row bg-[#0c0c0c] w-80 h-80">
          <div>
            <img src={product.srcImg} alt={product.altImg} id={product.idImg} />
          </div>
          <div>
            <p id="nameProduct">{product.name}</p>
            <p id="descriptionProduct">{product.description}</p>
          </div>
          <button type="button">Add to cart</button>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
