
const API_URL = import.meta.env.DEV
  ? "http://localhost:5000"
  : "";

export async function sendMessageToBloomAI(
  message,
  history = [],
  preferences = {}
) {
  const response = await fetch(`${API_URL}/api/ai/chat`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      message,
      history,
      preferences,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Bloom AI could not process your request."
    );
  }

  return data;
}
