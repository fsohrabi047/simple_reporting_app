import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Authentication (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  })
  it('signup a new user', () => {
    const userEmail = 'tesftcd@test.com';

    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({email: userEmail, password: 'ASDF'})
      .expect(201)
      .then(res => {
        const { id, email } = res.body;
        expect(id).toBeDefined();
        expect(email).toEqual(userEmail)
      });
  });

  it("sign up", async () => {
    const email = 'asdfg@as.com';

    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({email, password: 'asdf'})
      .expect(201);

    const cookie = res.get('Set-Cookie');

    const { body } = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie)
      .expect(200);

    expect(body.email).toEqual(email);
  });
});
