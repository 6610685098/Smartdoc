import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsController } from './documents.controller.js';
import { DocumentsService } from './documents.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

describe('DocumentsController (FR-ACC-01)', () => {
  let controller: DocumentsController;
  let service: any;

  const mockUser: any = {
    id: 'user-uuid-1234',
    email: 'officer@ncsa.or.th',
    fullName: 'เจ้าหน้าที่ สารบรรณ',
    role: 'USER',
  };

  beforeEach(async () => {
    service = {
      create: vi.fn(),
      findAll: vi.fn(),
      findOne: vi.fn(),
      update: vi.fn(),
      remove: vi.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentsController],
      providers: [{ provide: DocumentsService, useValue: service }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<DocumentsController>(DocumentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should route create() using authenticated user.id', async () => {
    const dto = {
      documentTypeId: 'type-123',
      title: 'บันทึกข้อความภายใน',
    };
    service.create.mockResolvedValue({ id: 'doc-1', userId: mockUser.id, ...dto });

    const result = await controller.create(mockUser, dto);

    expect(service.create).toHaveBeenCalledWith(mockUser.id, dto);
    expect(result.userId).toBe(mockUser.id);
  });

  it('should route findAll() using authenticated user.id', async () => {
    service.findAll.mockResolvedValue([{ id: 'doc-1', userId: mockUser.id }]);

    const result = await controller.findAll(mockUser, {});

    expect(service.findAll).toHaveBeenCalledWith(mockUser.id, {});
    expect(result).toHaveLength(1);
  });

  it('should route findOne() using authenticated user.id', async () => {
    service.findOne.mockResolvedValue({ id: 'doc-1', userId: mockUser.id });

    const result = await controller.findOne(mockUser, 'doc-1');

    expect(service.findOne).toHaveBeenCalledWith('doc-1', mockUser.id);
    expect(result.id).toBe('doc-1');
  });

  it('should route update() using authenticated user.id', async () => {
    const updateDto = { title: 'ชื่อเอกสารใหม่' };
    service.update.mockResolvedValue({ id: 'doc-1', userId: mockUser.id, ...updateDto });

    const result = await controller.update(mockUser, 'doc-1', updateDto);

    expect(service.update).toHaveBeenCalledWith('doc-1', mockUser.id, updateDto);
    expect(result.title).toBe('ชื่อเอกสารใหม่');
  });

  it('should route remove() using authenticated user.id', async () => {
    service.remove.mockResolvedValue({ message: 'ย้ายเอกสารไปถังขยะเรียบร้อยแล้ว' });

    const result = await controller.remove(mockUser, 'doc-1');

    expect(service.remove).toHaveBeenCalledWith('doc-1', mockUser.id);
    expect(result.message).toBe('ย้ายเอกสารไปถังขยะเรียบร้อยแล้ว');
  });
});
