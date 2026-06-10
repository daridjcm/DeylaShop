import React, { useState, useEffect } from 'react';

const STORAGE_KEY = 'deylaCart';

const getCartQuantity = () => {
  if (typeof window === 'undefined') return 0;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return 0;
    const cart = JSON.parse(stored);
    return cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
  } catch {
    return 0;
  }
};

export function Navbar({ href1, href2, href3, href4, hrefImg, altImg, title1, title2, title3 }) {
  const [quantityProducts, setQuantityProducts] = useState(0);

  useEffect(() => {
    const handleCartUpdate = (e) => {
      setQuantityProducts(e.detail.quantity ?? getCartQuantity());
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    
    setQuantityProducts(getCartQuantity());

    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  return (
    <nav className="flex flex-col md:flex-row md:justify-between bg-[#080808] text-slate-50 pt-5 pb-5">
      <div className="hidden md:flex md:items-center">
        <img className="lg:w-[100px] ml-5 pr-2" src={hrefImg} alt={altImg} />
      </div>
      <div className="flex flex-row items-center justify-center font-sans text-[20px] font-semibold mr-5 ml-5">
        <ul className="flex flex-row gap-4 content-between">
          <li>
            <a href={href1} className="text-white hover:text-[#ce83ec]">{title1}</a>
          </li>
          <li>
            <a href={href2} className="text-white hover:text-[#ce83ec]">{title2}</a>
          </li>
          <li>
            <a href={href3} className="text-white hover:text-[#ce83ec]">{title3}</a>
          </li>
          <li className="w-fit rounded-xl relative">
            <a href={href4}>
              <span className="icon-[solar--cart-large-2-broken] hover:text-purple-300 text-4xl cursor-pointer" role="img" aria-hidden="true" id="cart"/>
            </a>
            {quantityProducts > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {quantityProducts}
              </span>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
}
