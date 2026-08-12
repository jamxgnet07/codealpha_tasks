const chatbotRules = [
  {
    patterns: ["hi", "hello", "hey", "good morning", "good evening"],
    response:
      "Hello! Welcome to our website. How can I help you today?"
  },
  {
    patterns: ["price", "pricing", "cost", "plan", "subscription"],
    response:
      "Our pricing depends on the selected service plan. We offer Basic, Standard, and Premium packages. Please tell me which service you are interested in."
  },
  {
    patterns: ["contact", "phone", "email", "support", "customer care"],
    response:
      "You can contact our support team at support@example.com or call +91 98765 43210."
  },
  {
    patterns: ["delivery", "shipping", "order status", "track order"],
    response:
      "Delivery usually takes 3 to 7 business days. If you share your order ID, our support team can help you track it."
  },
  {
    patterns: ["refund", "return", "cancel order", "money back"],
    response:
      "We offer refunds and returns based on our policy. Orders can usually be cancelled before dispatch. Please contact support with your order details."
  },
  {
    patterns: ["working hours", "business hours", "open", "timing", "available"],
    response:
      "Our business hours are Monday to Saturday, 9:00 AM to 6:00 PM."
  },
  {
    patterns: ["services", "products", "what do you offer", "offerings"],
    response:
      "We offer multiple products and services tailored for customer needs. Tell me what kind of product or service you are looking for, and I will guide you."
  },
  {
    patterns: ["location", "address", "where are you located"],
    response:
      "Our main office is located in Chennai, Tamil Nadu, India."
  },
  {
    patterns: ["thank you", "thanks"],
    response:
      "You’re welcome! Let me know if you need any more help."
  }
];

function normalizeText(text) {
  return text.toLowerCase().trim();
}

function findBestResponse(userMessage) {
  const input = normalizeText(userMessage);

  for (const rule of chatbotRules) {
    for (const pattern of rule.patterns) {
      if (input.includes(pattern)) {
        return rule.response;
      }
    }
  }

  return generateFallbackResponse(input);
}

function generateFallbackResponse(input) {
  if (input.includes("website")) {
    return "Yes, I can help with website-related questions. Please describe your issue or requirement clearly.";
  }

  if (input.includes("buy") || input.includes("purchase")) {
    return "Sure! I can help you with purchasing information. Please tell me which product you want to buy.";
  }

  if (input.includes("help")) {
    return "Of course. I can assist with pricing, orders, services, contact details, delivery, and refunds.";
  }

  return "I’m sorry, I didn’t fully understand that. Could you please rephrase your question? I can help with pricing, services, orders, contact, delivery, and refunds.";
}

module.exports = {
  findBestResponse
};