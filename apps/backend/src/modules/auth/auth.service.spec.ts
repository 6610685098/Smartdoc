import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { AuthService } from './auth.service.js';
import { PrismaService } from '../../prisma/prisma.service.js';

describe('AuthService', () => {
  let authService: AuthService;
  let prismaService: any;
  let jwtService: any;

  const mockUser = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'test@example.com',
    fullName: 'ทดสอบ ผู้ใช้งาน',
    role: 'USER',
    passwordHash: '',
    createdAt: new Date(),
  };

  beforeEach(async () => {
    mockUser.passwordHash = await bcrypt.hash('secret123', 10);

    prismaService = {
      user: {
        findUnique: vi.fn(),
        create: vi.fn(),
      },
    };

    jwtService = {
      sign: vi.fn().mockReturnValue('mock_jwt_token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prismaService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should successfully register a new user', async () => {
      prismaService.user.findUnique.mockResolvedValue(null);
      prismaService.user.create.mockResolvedValue({
        id: mockUser.id,
        email: mockUser.email,
        fullName: mockUser.fullName,
        role: mockUser.role,
        createdAt: mockUser.createdAt,
      });

      const result = await authService.register({
        email: 'test@example.com',
        password: 'password123',
        fullName: 'ทดสอบ ผู้ใช้งาน',
      });

      expect(result.token).toBe('mock_jwt_token');
      expect(result.response.message).toBe('ลงทะเบียนสำเร็จ');
      expect(result.response.user.email).toBe('test@example.com');
      expect(prismaService.user.create).toHaveBeenCalled();
    });

    it('should throw ConflictException if email is already taken', async () => {
      prismaService.user.findUnique.mockResolvedValue(mockUser);

      await expect(
        authService.register({
          email: 'test@example.com',
          password: 'password123',
          fullName: 'ทดสอบ ผู้ใช้งาน',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should successfully login with valid credentials', async () => {
      prismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await authService.login({
        email: 'test@example.com',
        password: 'secret123',
      });

      expect(result.token).toBe('mock_jwt_token');
      expect(result.response.message).toBe('เข้าสู่ระบบสำเร็จ');
      expect(result.response.user.id).toBe(mockUser.id);
    });

    it('should throw UnauthorizedException if user does not exist', async () => {
      prismaService.user.findUnique.mockResolvedValue(null);

      await expect(
        authService.login({
          email: 'notfound@example.com',
          password: 'password123',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password does not match', async () => {
      prismaService.user.findUnique.mockResolvedValue(mockUser);

      await expect(
        authService.login({
          email: 'test@example.com',
          password: 'wrongpassword',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
