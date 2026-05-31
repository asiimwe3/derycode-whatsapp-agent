# Derycode WhatsApp Agent 🤖

A WhatsApp AI agent that acts as *Derick* — a software engineer from Derycode — to advertise tech services and respond to leads naturally.

## Services Promoted
- Mobile & Web App Development
- Crypto & Blockchain Platforms
- Digital Library Systems
- Management & ERP Software
- Banking & Financial Systems
- Full-Stack Development

## Setup

1. Clone the repo
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file:
   ```
   WABLAS_TOKEN=your_wablas_token_here
   PORT=3000
   ```
4. Start the server:
   ```
   npm start
   ```

## API Endpoints

### GET /
Health check — returns agent status

### POST /outreach
Send intro messages to a list of numbers
```json
{
  "numbers": ["256700000000", "256712345678"]
}
```

### POST /send
Send a custom message to one number
```json
{
  "phone": "256700000000",
  "message": "Hey! 👋 I'm Derick from Derycode..."
}
```

### POST /webhook
Wablas webhook endpoint — receives incoming messages and auto-replies

## Deployment
Deploy to Railway, Render, or any Node.js host.
Set the webhook URL in your Wablas dashboard to:
```
https://your-server.com/webhook
```

## Contact
Derycode — 0762306675
