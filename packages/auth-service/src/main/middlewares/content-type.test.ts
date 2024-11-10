import request from 'supertest';
import app from '../config/app';

describe('Content Type Middleware', () => {
  test('Should return default content type as json', async () => {
    app.get('/test_content_type', (req, res) => {
      res.send('');
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    await request(app)
      .get('/test_content_type')
      .expect('content-type', /json/)
  });

  test('Should return xml when forced', async () => {
    app.get('/test_content_type_xml', (req, res) => {
      res.type('xml')
      res.send('');
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    await request(app)
      .get('/test_content_type_xml')
      .expect('content-type', /xml/)
  });
});
