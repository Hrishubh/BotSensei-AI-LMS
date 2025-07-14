import { Inngest } from "inngest";

// Log environment variable availability for debugging
const eventKey = process.env.INNGEST_EVENT_KEY;
console.log("Inngest event key available:", eventKey ? "YES" : "NO");

// Create a client to send and receive events
export const inngest = new Inngest({ 
  id: "ai-lms",
  // Use environment variable with a fallback for development
  eventKey: eventKey
});
