
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");

const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

const { GoogleGenAI } = require("@google/genai");

initializeApp();

const db = getFirestore();

const geminiApiKey = defineSecret("GEMINI_API_KEY");

exports.chatWithBloomAI = onCall(
  {
    region: "us-central1",
    secrets: [geminiApiKey],
    timeoutSeconds: 60,
    memory: "256MiB",
  },
  async (request) => {
    try {
      const message = request.data?.message;
      const history = request.data?.history || [];

      if (
        typeof message !== "string" ||
        !message.trim() ||
        message.length > 1000
      ) {
        throw new HttpsError(
          "invalid-argument",
          "Please enter a valid message."
        );
      }

      if (!Array.isArray(history) || history.length > 10) {
        throw new HttpsError(
          "invalid-argument",
          "Invalid conversation history."
        );
      }

      // Fetch real products from Firestore.
      const productsSnapshot = await db
        .collection("products")
        .limit(100)
        .get();

      const products = productsSnapshot.docs.map((item) => {
        const data = item.data();

        return {
          id: item.id,
          name: data.name || "",
          category: data.category || "",
          price: Number(data.price || 0),
          stock: Number(data.stock || 0),
          tag: data.tag || "",
          image: data.image || "",
        };
      });

      // Only recommend products that are in stock.
      const availableProducts = products.filter(
        (product) =>
          product.stock > 0 &&
          product.price > 0
      );

      const ai = new GoogleGenAI({
        apiKey: geminiApiKey.value(),
      });

      const systemInstruction = `
You are Bloom AI, the friendly and knowledgeable
flower and gift shopping assistant for Bloom & Bliss.

Your job is to help customers select beautiful gifts.

IMPORTANT RULES:

1. Recommend products ONLY from the supplied product catalogue.
2. Never invent product names, IDs, prices or stock.
3. Respect the customer's budget.
4. Understand occasions such as birthdays, engagements,
   marriages, anniversaries and Valentine's Day.
5. Ask friendly follow-up questions when necessary.
6. Explain briefly why each recommended gift is suitable.
7. If no suitable product exists, say so honestly.
8. Never recommend an out-of-stock product.
9. Never claim that an order has been placed.
10. Keep responses friendly, warm and concise.
11. You may discuss general gift ideas, but product
    recommendations must come from the catalogue.

Return your answer in the required JSON format.

AVAILABLE PRODUCT CATALOGUE:

${JSON.stringify(availableProducts)}
`;

      // Validate and limit conversation history.
      const safeHistory = history
        .slice(-10)
        .filter(
          (item) =>
            item &&
            ["user", "model"].includes(item.role) &&
            typeof item.text === "string" &&
            item.text.length <= 1000
        )
        .map((item) => ({
          role: item.role,
          parts: [{ text: item.text }],
        }));

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          ...safeHistory,
          {
            role: "user",
            parts: [{ text: message.trim() }],
          },
        ],
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              reply: {
                type: "STRING",
              },
              recommendedProductIds: {
                type: "ARRAY",
                items: {
                  type: "STRING",
                },
              },
            },
            required: [
              "reply",
              "recommendedProductIds",
            ],
          },
        },
      });

      const result = JSON.parse(response.text);

      // Verify every recommendation against the real catalogue.
      const availableIds = new Set(
        availableProducts.map((product) => product.id)
      );

      const recommendedProductIds = [
        ...new Set(
          (result.recommendedProductIds || []).filter(
            (id) => availableIds.has(id)
          )
        ),
      ].slice(0, 4);

      return {
        reply: result.reply || "How can I help you choose a gift?",
        recommendedProductIds,
      };

    } catch (error) {
      console.error("Bloom AI error:", error);

      if (error instanceof HttpsError) {
        throw error;
      }

      throw new HttpsError(
        "internal",
        "Bloom AI is temporarily unavailable. Please try again."
      );
    }
  }
);
