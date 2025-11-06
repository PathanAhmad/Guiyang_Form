# World of Internet Expo Form Backend

A Node.js backend service for handling form submissions with Discord webhook integration and MongoDB storage, rebranded for World of Internet Expo.

## Features

- ✅ Three form types: Demo, Showcase, Fast-Track
- ✅ Automatic token generation (D-001, S-001, F-001)
- ✅ **Queue Processing System** with automatic next-token notifications
- ✅ Discord webhook integration with queue status updates
- ✅ MongoDB data persistence
- ✅ Input validation with Joi
- ✅ Comprehensive error handling
- ✅ RESTful API endpoints
- ✅ Automated testing suite

## Queue Processing System

The system now includes **automatic queue management** that processes tokens in First-In-First-Out (FIFO) order:

### How It Works:
1. **Token Creation**: New submissions are assigned sequential tokens and start with status `'waiting'`
2. **Status Updates**: Tokens can be updated to: `'contacted'`, `'completed'`, or `'cancelled'`
3. **Automatic Next Token**: When a token is marked as `'completed'` or `'cancelled'`, the system:
   - Automatically finds the next `'waiting'` token in the queue
   - Sends a Discord notification about the next token ready for contact
   - Returns the next token information in the API response

### Queue Status Tracking:
- View waiting count for each form type
- See who's next in line with waiting time
- Get detailed information about the next token to process

### Discord Integration:
- **Form Submissions**: Send rich messages with interactive buttons
- **Interactive Buttons**: Click to update status directly from Discord
  - 📞 "Mark as Contacted" - Updates waiting → contacted
  - ✅ "Mark as Completed" - Updates contacted → completed  
  - ❌ "Cancel" - Updates any status → cancelled
  - 📊 "Check Status" - Shows current token information
- **Status Updates**: Automatic notifications when status changes
- **Next in Queue**: Automatic notifications when tokens are completed
- **Queue Management**: Real-time Discord integration with queue processing

### Frontend Dashboard:
- **Queue Dashboard**: `/queue` - Real-time queue management interface
- **Status Updates**: Click buttons to update token status
- **Next Token**: See and manage next-in-queue automatically
- **Multi-Form Support**: Separate queues for Demo, Showcase, Fast-Track

## Form Types

### 1. Public Sparkie Demo (`/api/forms/demo`)
- Fields: Name, Email, Phone (optional)
- Token format: `D-001`, `D-002`, etc.
- Discord channel: `#sparkie-demo`

### 2. SparkOS System Showcase (`/api/forms/showcase`)
- Fields: Name, Email, Phone (optional)
- Token format: `S-001`, `S-002`, etc.
- Discord channel: `#system-showcase`

### 3. Fast-Track Interest Form (`/api/forms/fasttrack`)
- Fields: Name, Email, Phone (optional), Company, Role, Message (optional)
- Token format: `F-001`, `F-002`, etc.
- Discord channel: `#fast-track`

## Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Environment Configuration
Create a `.env` file in the `backend` directory:

```env
# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017/world_internet_expo_forms

# Server Configuration
PORT=3000
NODE_ENV=development

# Discord Webhook URLs (Get these from Discord)
DISCORD_WEBHOOK_DEMO=https://discord.com/api/webhooks/YOUR_DEMO_WEBHOOK_URL
DISCORD_WEBHOOK_SHOWCASE=https://discord.com/api/webhooks/YOUR_SHOWCASE_WEBHOOK_URL
DISCORD_WEBHOOK_FASTTRACK=https://discord.com/api/webhooks/YOUR_FASTTRACK_WEBHOOK_URL
```

### 3. Set Up Discord Webhooks

1. Go to your Discord server
2. Navigate to Server Settings → Integrations → Webhooks
3. Create webhooks for each channel:
   - `#sparkie-demo` → Copy webhook URL to `DISCORD_WEBHOOK_DEMO`
   - `#system-showcase` → Copy webhook URL to `DISCORD_WEBHOOK_SHOWCASE`
   - `#fast-track` → Copy webhook URL to `DISCORD_WEBHOOK_FASTTRACK`

### 4. Start MongoDB
Ensure MongoDB is running on your system or use MongoDB Atlas.

### 5. Run the Server
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

### 6. Test the API
```bash
npm test
```

## API Endpoints

### Form Submissions
- `POST /api/forms/demo` - Submit Sparkie Demo form
- `POST /api/forms/showcase` - Submit System Showcase form
- `POST /api/forms/fasttrack` - Submit Fast-Track form

### Data Retrieval
- `GET /api/forms/submission/:token` - Get submission by token
- `GET /api/forms/submissions/:formType` - Get all submissions for a form type
- `GET /api/forms/counters` - Get token counter status
- `GET /api/forms/health` - Health check

### Queue Management
- `PATCH /api/forms/submission/:token/status` - Update submission status
- `GET /api/forms/queue/:formType/next` - Get next waiting token for a form type
- `GET /api/forms/queue/status` - Get queue status for all form types

### Discord Testing
- `GET /api/discord/status` - Check webhook configuration
- `POST /api/discord/test/:formType` - Test specific webhook
- `POST /api/discord/test-all` - Test all webhooks
- `POST /api/discord/custom-test` - Send custom test message

## Example API Usage

### Submit Demo Form
```bash
curl -X POST http://localhost:3000/api/forms/demo \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890"
  }'
```

### Submit Fast-Track Form
```bash
curl -X POST http://localhost:3000/api/forms/fasttrack \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@company.com",
    "phone": "+0987654321",
    "company": "Tech Corp",
    "role": "CTO",
    "message": "Interested in collaboration"
  }'
```

### Test Discord Webhook
```bash
curl -X POST http://localhost:3000/api/discord/test/demo
```

### Update Token Status
```bash
# Mark token as contacted
curl -X PATCH http://localhost:3000/api/forms/submission/D-001/status \
  -H "Content-Type: application/json" \
  -d '{"status": "contacted"}'

# Mark token as completed (triggers next-in-queue notification)
curl -X PATCH http://localhost:3000/api/forms/submission/D-001/status \
  -H "Content-Type: application/json" \
  -d '{"status": "completed"}'
```

### Check Queue Status
```bash
# Get next token in demo queue
curl -X GET http://localhost:3000/api/forms/queue/demo/next

# Get overall queue status
curl -X GET http://localhost:3000/api/forms/queue/status
```

### Test the Complete System
```bash
# Test Discord buttons and queue processing
node test-discord-buttons.js

# Test comprehensive integration
npm test -- test-discord-integration.js
```

## Project Structure

```
backend/
├── config/
│   └── environment.js          # Environment configuration
├── middleware/
│   └── validation.js           # Input validation middleware
├── models/
│   ├── FormSubmission.js       # Form submission schema
│   └── TokenCounter.js         # Token counter schema
├── routes/
│   ├── forms.js                # Form submission routes
│   └── discord.js              # Discord webhook routes
├── services/
│   └── discordService.js       # Discord webhook service
├── test/
│   └── test-endpoints.js       # Automated test suite
├── package.json
├── server.js                   # Main server file
└── README.md
```

## Response Formats

### Successful Form Submission
```json
{
  "success": true,
  "message": "Form submitted successfully",
  "data": {
    "token": "D-001",
    "formType": "demo",
    "submittedAt": "2024-01-01T12:00:00Z",
    "status": "waiting"
  },
  "discord": {
    "sent": true,
    "error": null
  }
}
```

### Validation Error
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "Please provide a valid email address"
    }
  ]
}
```

## Discord Message Format

```
🎯 **New Sparkie Demo Submission**
👤 **Name:** John Doe
📧 **Email:** john@example.com
📱 **Phone:** +1234567890
🔢 **Token:** D-001
📌 **Status:** Waiting in Line
⏰ **Submitted:** 1/1/2024, 12:00:00 PM
```

## Monitoring & Logs

The server provides detailed logging for:
- Form submissions
- Discord webhook status
- Database operations
- Error tracking

Check console output for real-time monitoring.

## Security Features

- Helmet.js for security headers
- CORS protection
- Input sanitization
- Request size limits
- Environment variable protection

## Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Ensure MongoDB is running
   - Check MONGO_URI in .env file
   - Verify network connectivity

2. **Discord Webhook Not Working**
   - Verify webhook URLs are correct
   - Test webhooks individually: `npm run test`
   - Check Discord server permissions

3. **Port Already in Use**
   - Change PORT in .env file
   - Kill existing processes on port 3000

### Getting Help

1. Check server logs in console
2. Run the test suite: `npm test`
3. Verify webhook status: `GET /api/discord/status`
4. Test database connection: `GET /api/forms/health`

## Development

### Adding New Form Types

1. Add validation schema in `middleware/validation.js`
2. Update Discord service message formatting
3. Add new routes in `routes/forms.js`
4. Update token counter prefixes
5. Add tests for new form type

### Environment Variables Reference

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/world_internet_expo_forms` |
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment mode | `development` |
| `DISCORD_WEBHOOK_DEMO` | Demo form webhook URL | - |
| `DISCORD_WEBHOOK_SHOWCASE` | Showcase form webhook URL | - |
| `DISCORD_WEBHOOK_FASTTRACK` | Fast-track form webhook URL | - |

---

🚀 **Ready to handle form submissions with style!**
