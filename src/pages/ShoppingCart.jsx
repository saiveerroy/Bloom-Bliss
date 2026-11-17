
import React from "react";

export default function ShoppingCart({
  cart,
  onClose,
  onRemove,
  onIncrease,
  onDecrease,
  onCheckout,
  cartLoading = false,
}) {
  const cartCount = cart.reduce(
    (total, item) => total + Number(item.quantity),
    0
  );

  const cartTotal = cart.reduce(
    (total, item) =>
      total + Number(item.price) * Number(item.quantity),
    0
  );

  return (
    <div
      className="fixed inset-0 z-[100] flex justify-end bg-black/40"
      onClick={onClose}
    >
      <div
        className="h-full w-full max-w-md overflow-y-auto bg-[#fffaf7] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* CART HEADER */}
        <div className="flex items-center justify-between border-b border-[#eadbd3] pb-5">
          <div>
            <h2 className="font-serif text-2xl text-[#344333]">
              Your Shopping Bag
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              {cartCount} items in your cart
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-3xl text-gray-500 hover:text-black"
            aria-label="Close cart"
          >
            ×
          </button>
        </div>

        {/* EMPTY CART */}
        {cart.length === 0 ? (
          <div className="flex flex-col items-center py-24 text-center">
            <span className="text-6xl">🛍️</span>

            <h3 className="mt-6 font-serif text-2xl text-[#536b50]">
              Your cart is empty
            </h3>

            <p className="mt-3 text-sm text-gray-500">
              Looks like you haven't added any flowers yet.
            </p>

            <button
              type="button"
              onClick={onClose}
              className="mt-7 rounded-lg bg-[#536b50] px-7 py-3 text-sm text-white hover:bg-[#3e543b]"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            {/* CART PRODUCTS */}
            <div className="mt-6 space-y-5">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 border-b border-[#eee5df] pb-5"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-28 w-24 rounded-lg object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <h3 className="font-serif text-lg text-[#344333]">
                      {item.name}
                    </h3>

                    <p className="mt-1 text-sm font-semibold text-[#536b50]">
                      ₹{Number(item.price).toLocaleString("en-IN")}
                    </p>

                    {/* QUANTITY CONTROLS */}
                    <div className="mt-3 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => onDecrease(item.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-md border border-[#536b50] text-lg text-[#536b50] hover:bg-[#536b50] hover:text-white"
                      >
                        −
                      </button>

                      <span className="text-sm font-semibold">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() => onIncrease(item.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-md border border-[#536b50] text-lg text-[#536b50] hover:bg-[#536b50] hover:text-white"
                      >
                        +
                      </button>
                    </div>

                    {/* REMOVE PRODUCT */}
                    <button
                      type="button"
                      onClick={() => onRemove(item.id)}
                      className="mt-3 text-xs text-red-500 underline hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>

                  {/* ITEM TOTAL */}
                  <div className="text-right">
                    <p className="text-sm font-semibold text-[#344333]">
                      ₹{(
                        Number(item.price) *
                        Number(item.quantity)
                      ).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* CART SUMMARY */}
            <div className="mt-8 rounded-xl bg-[#f8eae5] p-5">
              <div className="flex justify-between text-lg font-semibold text-[#344333]">
                <span>Subtotal</span>

                <span>
                  ₹{cartTotal.toLocaleString("en-IN")}
                </span>
              </div>

              <p className="mt-3 text-xs leading-5 text-gray-600">
                Delivery charges will be calculated at checkout.
              </p>

              {cartTotal >= 1499 && (
                <p className="mt-3 text-xs font-semibold text-[#536b50]">
                  🎉 Congratulations! You qualify for free delivery.
                </p>
              )}

              <button
                type="button"
                onClick={onCheckout}
                disabled={cartLoading}
                className="mt-6 w-full rounded-lg bg-[#536b50] py-4 text-sm font-semibold uppercase tracking-wider text-white transition hover:bg-[#3e543b] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Proceed To Checkout →
              </button>

              <button
                type="button"
                onClick={onClose}
                className="mt-4 w-full text-center text-xs text-[#536b50] underline"
              >
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
