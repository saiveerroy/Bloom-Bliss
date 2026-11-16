
import React, { useState, useRef, useEffect } from "react";

import { useInventory } from "../context/InventoryContext";
import { useCart } from "../context/CartContext";

import { sendMessageToBloomAI } from "../services/aiService";

import { useLocation, useNavigate } from "react-router-dom";

export default function AIChatbot() {
  const [preferences, setPreferences] = useState({
    occasion: "",
    budget: 0,
    minPrice: 0,
    recipient: "",
    category: "",
  });
  const { products = [] } = useInventory();
  const { addToCart } = useCart();

  const location = useLocation();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [cartMessage, setCartMessage] = useState("");

  // Customer preferences and conversation memory.
  const [memory, setMemory] = useState({
    occasion: "",
    budget: 0,
  });

  const [messages, setMessages] = useState([
    {
      role: "model",
      text:
        "Hello! 🌸 Welcome to Bloom & Bliss! I'm Bloom AI, your personal gift assistant. Tell me what occasion you're shopping for, and I'll help you find something beautiful!",
      recommendations: [],
    },
  ]);

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  // Hide chatbot on admin pages.
  if (
    location.pathname.startsWith("/admin") ||
    location.pathname === "/admin-login"
  ) {
    return null;
  }

  async function handleSend(text = input) {
    const message = text.trim();

    if (!message || loading) return;

    const previousMessages = messages;

    setInput("");
    setLoading(true);
    setCartMessage("");

    setMessages((previous) => [
      ...previous,
      {
        role: "user",
        text: message,
        recommendations: [],
      },
    ]);

    try {
      // Send previous conversation to backend.
      const history = previousMessages
        .slice(-10)
        .map((item) => ({
          role:
            item.role === "model" ? "assistant" : "user",
          content: item.text,
        }));

      const response = await sendMessageToBloomAI(
        message,
        history,
        preferences
      );
      if (response.preferences) {
        setPreferences(response.preferences);
      }

      // Update customer preferences.
      setMemory((previous) => ({
        occasion: response.occasion || previous.occasion,
        budget:
          Number(response.budget) > 0
            ? Number(response.budget)
            : previous.budget,
      }));

      // Verify recommendations against current website inventory.
      const recommendedProducts = (
        response.recommendations || []
      )
        .map((recommended) => {
          const actualProduct = products.find(
            (product) =>
              String(product.id) === String(recommended.id)
          );

          if (!actualProduct) return null;

          if (Number(actualProduct.stock) <= 0) {
            return null;
          }

          // Use actual website product details.
          return {
            ...actualProduct,
            reason: recommended.reason || "",
          };
        })
        .filter(Boolean);

      setMessages((previous) => [
        ...previous,
        {
          role: "model",
          text: response.reply,
          recommendations: recommendedProducts,
        },
      ]);
    } catch (error) {
      console.error("Bloom AI error:", error);

      setMessages((previous) => [
        ...previous,
        {
          role: "model",
          text:
            "I'm sorry! 🌷 I'm having trouble connecting right now. Please try again in a moment.",
          recommendations: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddToCart(product) {
    try {
      if (Number(product.stock) <= 0) {
        setCartMessage("Sorry, this product is out of stock.");
        return;
      }

      await addToCart(product, products);

      setCartMessage(
        `${product.name} added to your cart successfully! 🌸`
      );
    } catch (error) {
      console.error("Add to cart error:", error);

      setCartMessage(
        "Unable to add this product to your cart. Please try again."
      );
    }
  }

  return (
    <>
      {/* FLOATING CHAT BUTTON */}

      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-[100]
            flex h-16 w-16 items-center justify-center
            rounded-full bg-[#382b2b] text-3xl text-white
            shadow-xl transition hover:scale-110"
          aria-label="Open Bloom AI"
        >
          🌸
        </button>
      )}

      {/* CHAT WINDOW */}

      {isOpen && (
        <div
          className="fixed bottom-5 right-4 z-[100]
            flex h-[min(700px,85vh)]
            w-[min(420px,calc(100vw-32px))]
            flex-col overflow-hidden rounded-2xl
            border border-pink-100 bg-white shadow-2xl
            sm:right-6"
        >
          {/* HEADER */}

          <div className="flex items-center justify-between
            bg-[#382b2b] p-4 text-white">

            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center
                justify-center rounded-full bg-pink-200 text-2xl">
                🌷
              </div>

              <div>
                <h2 className="font-bold">Bloom AI</h2>
                <p className="text-xs text-pink-200">
                  Your personal gift assistant
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="rounded-lg px-3 py-2 text-xl hover:bg-white/10"
              aria-label="Close chat"
            >
              ×
            </button>
          </div>

          {/* CUSTOMER MEMORY */}

          {(memory.occasion || memory.budget > 0) && (
            <div className="border-b bg-pink-50 px-3 py-2">
              <p className="text-xs font-semibold text-[#7c435c]">
                YOUR GIFT PREFERENCES
              </p>

              <div className="mt-1 flex flex-wrap gap-2 text-xs">
                {memory.occasion && (
                  <span className="rounded-full bg-white px-3 py-1">
                    🎉 {memory.occasion}
                  </span>
                )}

                {memory.budget > 0 && (
                  <span className="rounded-full bg-white px-3 py-1">
                    💰 Up to ₹{memory.budget.toLocaleString("en-IN")}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* QUICK SUGGESTIONS */}

          <div className="border-b bg-[#fffaf7] p-3">
            <p className="mb-2 text-xs font-semibold text-gray-500">
              QUICK GIFT IDEAS
            </p>

            <div className="flex flex-wrap gap-2">
              {[
                "Birthday gift",
                "Anniversary gift",
                "Engagement gift",
                "Gift under ₹1000",
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleSend(suggestion)}
                  disabled={loading}
                  className="rounded-full border border-pink-200
                    bg-white px-3 py-2 text-xs text-[#7c435c]
                    hover:bg-pink-50 disabled:opacity-50"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* CHAT MESSAGES */}

          <div className="flex-1 space-y-4 overflow-y-auto
            bg-white p-4">

            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[95%] ${
                    message.role === "user"
                      ? "rounded-2xl rounded-br-sm bg-[#382b2b] text-white"
                      : "rounded-2xl rounded-bl-sm bg-[#fff4f7] text-[#382b2b]"
                  } p-3`}
                >
                  <p className="whitespace-pre-wrap text-sm leading-6">
                    {message.text}
                  </p>

                  {/* PRODUCT CARDS */}

                  {message.recommendations?.length > 0 && (
                    <div className="mt-3 space-y-3">
                      {message.recommendations.map((product) => (
                        <div
                          key={product.id}
                          className="overflow-hidden rounded-xl
                            border border-pink-100 bg-white text-[#382b2b]"
                        >
                          {product.image && (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="h-36 w-full object-cover"
                            />
                          )}

                          <div className="p-3">
                            <h3 className="font-bold">
                              {product.name}
                            </h3>

                            <p className="mt-1 text-xs text-gray-500">
                              {product.category}
                            </p>

                            {product.reason && (
                              <p className="mt-2 text-xs leading-5 text-gray-600">
                                🌸 {product.reason}
                              </p>
                            )}

                            <p className="mt-2 font-bold text-[#536b50]">
                              ₹{Number(product.price).toLocaleString("en-IN")}
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                              {Number(product.stock)} available
                            </p>

                            <div className="mt-3 flex gap-2">
                              <button
                                onClick={() =>
                                  navigate(`/product/${product.id}`)
                                }
                                className="flex-1 rounded-lg border
                                  border-[#536b50] py-2 text-xs
                                  text-[#536b50]"
                              >
                                View Product
                              </button>

                              <button
                                onClick={() => handleAddToCart(product)}
                                disabled={Number(product.stock) <= 0}
                                className="flex-1 rounded-lg bg-[#536b50]
                                  py-2 text-xs text-white
                                  disabled:opacity-40"
                              >
                                Add to Cart
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="rounded-xl bg-pink-50 p-3 text-sm text-gray-500">
                  Bloom AI is finding beautiful gifts... 🌸
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* CART FEEDBACK */}

          {cartMessage && (
            <div className="border-t bg-green-50 px-3 py-2 text-center text-xs text-green-800">
              {cartMessage}
            </div>
          )}

          {/* MESSAGE INPUT */}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2 border-t bg-white p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me about a gift..."
              disabled={loading}
              className="min-w-0 flex-1 rounded-xl
                border border-gray-200 px-4 py-3
                text-sm outline-none focus:border-pink-400"
            />

            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="rounded-xl bg-[#382b2b]
                px-4 py-3 text-white disabled:opacity-40"
            >
              ➤
            </button>
          </form>

          <div className="bg-white pb-2 text-center">
            <p className="text-[10px] text-gray-400">
              Bloom & Bliss • AI Gift Assistant 🌷
            </p>
          </div>
        </div>
      )}
    </>
  );
}
