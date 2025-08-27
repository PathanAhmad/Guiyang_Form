const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;

// Mock Discord service for testing
const mockDiscordService = {
  sendToDiscord: async (formType, submissionData) => ({
    success: true,
    response: { id: 'mock_message_id' }
  }),
  sendStatusUpdate: async (formType, submissionData, oldStatus, newStatus) => ({
    success: true,
    response: { id: 'mock_status_update_id' }
  }),
  sendCustomMessage: async (formType, message) => ({
    success: true,
    response: { id: 'mock_custom_message_id' }
  })
};

// Replace the real Discord service with mock for testing
jest.mock('../services/discordService', () => mockDiscordService);

chai.use(chaiHttp);

describe('Discord Integration Tests', () => {
  let server;
  let testTokens = [];

  before(async () => {
    // Start server for testing
    const app = require('../server');
    server = app.listen(3001);
  });

  after(async () => {
    // Clean up
    if (server) {
      server.close();
    }
  });

  describe('Discord Button Interactions', () => {
    it('should create submission with Discord notification and buttons', async () => {
      const submissionData = {
        name: 'Test User',
        email: 'test@example.com',
        phone: '+1234567890'
      };

      const res = await chai.request(server)
        .post('/api/forms/demo')
        .send(submissionData);

      expect(res).to.have.status(201);
      expect(res.body.success).to.be.true;
      expect(res.body.data.token).to.match(/^D-\d{3}$/);
      expect(res.body.discord.sent).to.be.true;

      testTokens.push(res.body.data.token);
    });

    it('should simulate Discord button interaction: Mark as Contacted', async () => {
      const token = testTokens[0];
      
      const res = await chai.request(server)
        .patch(`/api/forms/submission/${token}/status`)
        .send({ status: 'contacted' });

      expect(res).to.have.status(200);
      expect(res.body.success).to.be.true;
      expect(res.body.data.newStatus).to.equal('contacted');
      expect(res.body.data.oldStatus).to.equal('waiting');
    });

    it('should simulate Discord button interaction: Mark as Completed', async () => {
      const token = testTokens[0];
      
      const res = await chai.request(server)
        .patch(`/api/forms/submission/${token}/status`)
        .send({ status: 'completed' });

      expect(res).to.have.status(200);
      expect(res.body.success).to.be.true;
      expect(res.body.data.newStatus).to.equal('completed');
      expect(res.body.data.oldStatus).to.equal('contacted');
    });

    it('should handle Discord interaction endpoint (mock)', async () => {
      const discordInteraction = {
        type: 3, // Component interaction
        data: {
          component_type: 2, // Button
          custom_id: `contact_${testTokens[0] || 'D-001'}`
        },
        user: {
          username: 'testuser'
        }
      };

      const res = await chai.request(server)
        .post('/api/discord/interactions')
        .send(discordInteraction);

      // In development mode, this should work without signature verification
      expect(res).to.have.status(200);
    });
  });

  describe('Queue Management with Discord Integration', () => {
    it('should get next token in queue', async () => {
      const res = await chai.request(server)
        .get('/api/forms/queue/demo/next');

      expect(res).to.have.status(200);
      expect(res.body.success).to.be.true;
    });

    it('should get queue status for all form types', async () => {
      const res = await chai.request(server)
        .get('/api/forms/queue/status');

      expect(res).to.have.status(200);
      expect(res.body.success).to.be.true;
      expect(res.body.data).to.have.property('demo');
      expect(res.body.data).to.have.property('showcase');
      expect(res.body.data).to.have.property('fasttrack');
    });

    it('should create multiple submissions and test queue order', async () => {
      // Create multiple submissions
      for (let i = 1; i <= 3; i++) {
        const res = await chai.request(server)
          .post('/api/forms/demo')
          .send({
            name: `Queue User ${i}`,
            email: `queue${i}@example.com`
          });
        
        expect(res).to.have.status(201);
        testTokens.push(res.body.data.token);
      }

      // Get next in queue
      const queueRes = await chai.request(server)
        .get('/api/forms/queue/demo/next');

      expect(queueRes).to.have.status(200);
      expect(queueRes.body.data).to.not.be.null;
      expect(queueRes.body.data.token).to.match(/^D-\d{3}$/);
    });

    it('should process queue in FIFO order', async () => {
      // Get initial next token
      const initialRes = await chai.request(server)
        .get('/api/forms/queue/demo/next');
      
      if (initialRes.body.data) {
        const firstToken = initialRes.body.data.token;
        
        // Complete the first token
        await chai.request(server)
          .patch(`/api/forms/submission/${firstToken}/status`)
          .send({ status: 'contacted' });
          
        const completeRes = await chai.request(server)
          .patch(`/api/forms/submission/${firstToken}/status`)
          .send({ status: 'completed' });
          
        expect(completeRes.body.success).to.be.true;
        
        // Check if next token is different
        const newNextRes = await chai.request(server)
          .get('/api/forms/queue/demo/next');
          
        if (newNextRes.body.data) {
          expect(newNextRes.body.data.token).to.not.equal(firstToken);
        }
      }
    });
  });

  describe('Discord Message Formatting', () => {
    it('should format Discord messages with proper buttons', () => {
      const discordService = require('../services/discordService');
      
      const submissionData = {
        name: 'Test User',
        email: 'test@example.com',
        phone: '+1234567890',
        token: 'D-001',
        status: 'waiting'
      };

      const message = discordService.formatMessage('demo', submissionData);
      
      expect(message).to.include('Test User');
      expect(message).to.include('test@example.com');
      expect(message).to.include('D-001');
      expect(message).to.include('⏳ **Status:** Waiting');
    });

    it('should create action buttons with correct structure', () => {
      const discordService = require('../services/discordService');
      
      const buttons = discordService.createActionButtons('D-001', 'waiting');
      
      expect(buttons).to.have.property('type', 1); // Action Row
      expect(buttons.components).to.be.an('array');
      expect(buttons.components.length).to.be.greaterThan(0);
      
      // Should have contact and cancel buttons for waiting status
      const contactButton = buttons.components.find(btn => 
        btn.custom_id === 'contact_D-001'
      );
      expect(contactButton).to.exist;
      expect(contactButton.label).to.include('Mark as Contacted');
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid token in status update', async () => {
      const res = await chai.request(server)
        .patch('/api/forms/submission/INVALID-TOKEN/status')
        .send({ status: 'contacted' });

      expect(res).to.have.status(404);
      expect(res.body.success).to.be.false;
    });

    it('should handle invalid status values', async () => {
      if (testTokens.length > 0) {
        const res = await chai.request(server)
          .patch(`/api/forms/submission/${testTokens[0]}/status`)
          .send({ status: 'invalid_status' });

        expect(res).to.have.status(400);
        expect(res.body.success).to.be.false;
      }
    });

    it('should handle invalid form type in queue requests', async () => {
      const res = await chai.request(server)
        .get('/api/forms/queue/invalid_form_type/next');

      expect(res).to.have.status(400);
      expect(res.body.success).to.be.false;
    });
  });
});

module.exports = {
  mockDiscordService
};
