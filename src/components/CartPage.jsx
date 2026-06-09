import React, { useEffect, useState } from 'react';

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

const getCartQuantity = (cart) =>
  cart.reduce((sum, item) => sum + (item.quantity || 0), 0);

export function CartPage() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    setCartItems(getCartFromStorage());
  }, []);

  const updateCart = (updatedCart) => {
    setCartItems(updatedCart);
    saveCartToStorage(updatedCart);
    const quantity = getCartQuantity(updatedCart);
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { quantity } }));
  };

  const handleQuantityChange = (id, nextQuantity) => {
    const quantity = Math.max(1, Number(nextQuantity) || 1);
    const updatedCart = cartItems.map((item) =>
      item.id === id ? { ...item, quantity } : item
    );
    updateCart(updatedCart);
  };

  const handleRemove = (id) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    updateCart(updatedCart);
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const checkout = () => {
    alert('Your order has been placed!');
    updateCart([]);
  };

  return (
    <section id="CartPage" className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-semibold mb-6 text-center">Your Cart</h1>

        {cartItems.length === 0 ? (
          <div className="rounded-lg bg-white p-8 text-center shadow-md">
            <p className="text-gray-600">The cart is empty.</p>
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="grid grid-cols-6 gap-4 text-gray-600 font-semibold">
                <div className="col-span-3">Product</div>
                <div className="text-center">Price</div>
                <div className="text-center">Quantity</div>
                <div className="text-right">Total</div>
                <div className="text-right">Remove</div>
              </div>
            </div>

            {cartItems.map((item) => (
              <div key={item.id} className="p-4 border-b border-gray-200">
                <div className="grid grid-cols-6 gap-4 items-center">
                  <div className="col-span-3 flex items-center gap-4">
                    <img
                      src={item.srcImg}
                      alt={item.altImg}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div>
                      <p className="text-gray-800 font-semibold">{item.name}</p>
                      <p className="text-sm text-gray-500">{item.altImg}</p>
                    </div>
                  </div>
                  <div className="text-center text-gray-700">${item.price}</div>
                  <div className="text-center">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      className="w-16 border border-gray-300 rounded-lg text-center"
                      onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                    />
                  </div>
                  <div className="text-right text-gray-700">
                    ${item.price * item.quantity}
                  </div>
                  <div className="text-right">
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleRemove(item.id)}
                      aria-label="Remove product"
                    >
                      &times;
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <div className="p-4 flex flex-col gap-4 md:flex-row md:justify-between md:items-center bg-gray-50">
              <span className="text-lg font-semibold">Total: ${totalPrice.toFixed(2)}</span>
              <button className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700" onClick={checkout}>
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
