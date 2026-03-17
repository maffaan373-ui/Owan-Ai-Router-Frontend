// src/services/api.js
const API_ENDPOINT = 'https://literate-computing-machine-pjv64xrxwj7gfr6q4-8000.app.github.dev/chat';
const USER_ID = 'ali_pro_99';

/**
 * Send a message to the AI chat API
 * @param {string} message - User message
 * @returns {Promise<{response: string, error?: string}>}
 */
export async function sendMessage(message) {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message,
        user_id: USER_ID,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      response: data.response || data.message || 'No response from AI',
      error: null,
    };
  } catch (error) {
    console.error('API Error:', error);
    return {
      response: null,
      error: error.message || 'Failed to connect to AI service',
    };
  }
}

/**
 * Generate a unique session ID
 * @returns {string}
 */
export function generateSessionId() {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Format timestamp for chat messages
 * @param {Date} date
 * @returns {string}
 */
export function formatTimestamp(date) {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}
