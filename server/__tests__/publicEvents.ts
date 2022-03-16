import { app } from '../src/server';
import request from 'supertest';
import prisma from '../src/client';

beforeAll(async () => {
  await prisma.tumiEvent.createMany({
    data: [],
  });
});
describe('Public event list', () => {
  it('Shows one event', async () => {
    const result = await request(app)
      .post('/graphql')
      .send({
        query: `
        query {
          events {
          id
          title
          }
        }
      `,
      });
    expect(result.body.data.events.length).toEqual(1);
    expect(result.statusCode).toEqual(200);
  });
});
