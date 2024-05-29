import { Test, TestingModule } from '@nestjs/testing';
import { Auth, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { instance, mock, when, anything, capture } from 'ts-mockito';
import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { SelectQueryBuilder } from 'typeorm';
import { compareSync, hash } from 'bcryptjs';
import { LoggerService } from './../logger/logger.service';

import { AuthService } from './auth.service';
import { Users } from './../database/entities/users.entity';
import { MailService } from './../mail/mail.service';
import { User } from './auth.model';

describe('AuthService', () => {
  let serviceAuth: AuthService;
  let usersRepository: Repository<Users>;
  let mailService: MailService;
  let jwtService: JwtService;
  const repositoryTokenUsers: string | Function = getRepositoryToken(Users);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoggerService,
        {
          provide: MailService,
          useValue: {
            sendMailWithTemplate: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
        AuthService,
        {
          provide: getRepositoryToken(Users),
          useValue: instance(mock(Repository)),
        },
      ],
    }).compile();

    serviceAuth = module.get<AuthService>(AuthService);
    usersRepository = module.get(repositoryTokenUsers);
    mailService = module.get(MailService);
    jwtService = module.get(JwtService);
  });

  it('should create a new user and send confirmation email', async () => {
    // Mock input data
    const body = {
      email: 'test@example.com',
      password: 'hashedPassword',
      name: 'John',
      lastName: 'Doe',
      businessRole: 'Developer',
      businessContact: 'Contact Info',
      businessName: 'Business Name',
      isDeveloper: false,
    };
    const secretKey = '123456';
    const userPayload = { email: 'test@example.com' };
    const token = jwt.sign(userPayload, secretKey, { expiresIn: '1h' });
    const req = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    };
    const password = await hash('hashedPassword', 10);
    const data: Users = {
      id: 1,
      email: 'test@example.com',
      name: 'John',
      lastName: 'Doe',
      password: password,
      businessRole: 'Developer',
      businessContact: 'Contact Info',
      businessName: 'Business Name',
      confirmationToken: 'testToken',
      isDeveloper: false,
      isConfirmed: true,
      resetPassword: false,
      resetPasswordReference: '',
      businessCity: "",
      businessAdress: "",
      businessCountry: "",
      businessDescription: "",
      businessZipCode: "",
      image: Buffer.from("", 'utf-8'),
    };

    // Mock the result of the repository save method
    jest.spyOn(usersRepository, 'save').mockResolvedValueOnce(data);

    // Mock the sendMailWithTemplate method
    jest.spyOn(mailService, 'sendMailWithTemplate').mockResolvedValueOnce();

    // Mock the jwtService sign method
    (jwtService.sign as jest.Mock).mockReturnValueOnce('mockedAccessToken');

    // Execute the function
    const result = await serviceAuth.createUser(body, req);

    // Assertions
    expect(result.status).toBe(201);
    expect(result.content.msg).toBe('User created with success');
    expect(result.content.access_token).toBe('mockedAccessToken');
    expect(jwtService.sign).toHaveBeenCalledWith(
      { email: 'test@example.com' },
      { expiresIn: '1h' },
    );
  });

  // it('should delete user successfully', async () => {

  //   const secretKey = '123456';
  //   const userPayload = { email: 'test@example.com' };
  //   const token = jwt.sign(userPayload, secretKey, { expiresIn: '1h' });
  //   const req = {
  //     headers: {
  //       authorization: `Bearer ${token}`,
  //     },
  //   };
  //   // Mocking jwt.verify
  //   // const jwtVerifyMock = jest.spyOn(serviceAuth, 'jwtVerify');
  //   // jwtVerifyMock.mockImplementation((token, secret, callback) => {
  //   //   callback(null, mockDecodedToken);
  //   // });

  //   // Mocking usersRepository.findOne
  //   const password = await hash('hashedPassword', 10);
  //   const data: Users = {
  //       id: 1,
  //       email: 'test@example.com',
  //       name: 'John',
  //       lastName: 'Doe',
  //       password: password,
  //       businessRole: 'Developer',
  //       businessContact: 'Contact Info',
  //       businessName: 'Business Name',
  //       confirmationToken: 'testToken',
  //       isDeveloper: false,
  //       isConfirmed: true,
  //       resetPassword: false,
  //       resetPasswordReference: "",
  //   }
  //   // when(usersRepository.findOne(anything())).thenResolve(data);

  //   // Mocking usersRepository.delete
  //   // const mockDeleteResult = { affected: 1 };
  //   // when(usersRepository.delete(anything())).thenResolve(undefined);

  //   // Execute the function
  //   const result = await serviceAuth.deleteUserConnected(req);

  //   // Assertions
  //   expect(result.status).toBe(200);
  //   expect(result.content.msg).toBe('User deleted successfully');

  //   // Verify that dependencies were called with the correct parameters
  //   // expect(jwtVerifyMock).toHaveBeenCalledWith('mockToken', '123456', expect.any(Function));
  //   // expect(usersRepository.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
  //   // expect(usersRepository.delete).toHaveBeenCalledWith({ email: 'test@example.com' });
  // });

  it('should handle invalid token', async () => {
    const mockRequest = { headers: { authorization: 'Bearer invalidToken' } };

    // Mocking jwt.verify to simulate an invalid token
    // const jwtVerifyMock = jest.spyOn(serviceAuth, 'jwtVerify');
    // jwtVerifyMock.mockImplementation((token, secret, callback) => {
    //   callback(new Error('Invalid token'), null);
    // });

    // Execute the function
    const result = await serviceAuth.deleteUserConnected(mockRequest);

    // Assertions
    expect(result.status).toBe(400);
    expect(result.content.msg).toBe('Invalid token');

    // Verify that dependencies were called with the correct parameters
    // expect(jwtVerifyMock).toHaveBeenCalledWith('invalidToken', '123456', expect.any(Function));
  });

  it('should handle invalid token', async () => {
    const secretKey = '123456';
    const userPayload = { email: 'test@example.com' };
    const token = jwt.sign(userPayload, secretKey, { expiresIn: '1h' });
    const req = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    };
    // Mocking jwt.verify to simulate an invalid token
    // const jwtVerifyMock = jest.spyOn(serviceAuth, 'jwtVerify');
    // jwtVerifyMock.mockImplementation((token, secret, callback) => {
    //   callback(new Error('Invalid token'), null);
    // });

    // Execute the function
    const result = await serviceAuth.deleteUserConnected(req);

    // Assertions
    expect(result.status).toBe(404);
    expect(result.content.msg).toBe('User not found');

    // Verify that dependencies were called with the correct parameters
    // expect(jwtVerifyMock).toHaveBeenCalledWith('invalidToken', '123456', expect.any(Function));
  });
});
