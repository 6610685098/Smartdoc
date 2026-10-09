import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: any;

  beforeEach(async () => {
    authService = {
      register: vi.fn(),
      login: vi.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should set cookie and return registration response', async () => {
      const mockRes: any = { cookie: vi.fn() };
      authService.register.mockResolvedValue({
        token: 'token123',
        response: {
          message: 'ลงทะเบียนสำเร็จ',
          user: { id: 'u1', email: 'a@b.com' },
        },
      });

      const res = await controller.register(
        { email: 'a@b.com', password: 'password', fullName: 'Tester' },
        mockRes,
      );

      expect(mockRes.cookie).toHaveBeenCalledWith(
        'smartdoc_token',
        'token123',
        expect.objectContaining({ httpOnly: true }),
      );
      expect(res.message).toBe('ลงทะเบียนสำเร็จ');
    });
  });

  describe('login', () => {
    it('should set cookie and return login response', async () => {
      const mockRes: any = { cookie: vi.fn() };
      authService.login.mockResolvedValue({
        token: 'token123',
        response: {
          message: 'เข้าสู่ระบบสำเร็จ',
          user: { id: 'u1', email: 'a@b.com' },
        },
      });

      const res = await controller.login(
        { email: 'a@b.com', password: 'password' },
        mockRes,
      );

      expect(mockRes.cookie).toHaveBeenCalledWith(
        'smartdoc_token',
        'token123',
        expect.objectContaining({ httpOnly: true }),
      );
      expect(res.message).toBe('เข้าสู่ระบบสำเร็จ');
    });
  });

  describe('logout', () => {
    it('should clear cookie and return success message', async () => {
      const mockRes: any = { cookie: vi.fn() };

      const res = await controller.logout(mockRes);

      expect(mockRes.cookie).toHaveBeenCalledWith(
        'smartdoc_token',
        '',
        expect.objectContaining({ maxAge: 0 }),
      );
      expect(res.message).toBe('ออกจากระบบสำเร็จ');
    });
  });

  describe('getProfile', () => {
    it('should return profile of current user', () => {
      const mockUser = { id: 'u1', email: 'test@example.com' };
      const res = controller.getProfile(mockUser);
      expect(res).toEqual({ user: mockUser });
    });
  });
});
