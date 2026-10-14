import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { DocumentsService } from './documents.service.js';
import { PrismaService } from '../../prisma/prisma.service.js';

describe('DocumentsService (FR-ACC-01)', () => {
  let service: DocumentsService;
  let prisma: any;

  const userA = {
    id: '11111111-1111-1111-1111-111111111111',
    email: 'userA@example.com',
    fullName: 'ผู้ใช้งาน A',
  };

  const userB = {
    id: '22222222-2222-2222-2222-222222222222',
    email: 'userB@example.com',
    fullName: 'ผู้ใช้งาน B',
  };

  const mockDocType = {
    id: '33333333-3333-3333-3333-333333333333',
    code: 'INTERNAL_MEMO',
    nameTh: 'บันทึกข้อความ',
  };

  const mockTemplate = {
    id: '44444444-4444-4444-4444-444444444444',
    title: 'เทมเพลตบันทึกข้อความมาตรฐาน',
    defaultContent: [{ id: 'blk_1', type: 'heading', content: 'บันทึกข้อความ' }],
    variableDefinitions: [{ key: 'doc_number', label: 'ที่', type: 'STRING', required: true }],
  };

  const docA = {
    id: '55555555-5555-5555-5555-555555555555',
    userId: userA.id,
    documentTypeId: mockDocType.id,
    templateId: mockTemplate.id,
    title: 'เอกสารของ A',
    status: 'DRAFT',
    content: [{ id: 'blk_1', type: 'heading', content: 'บันทึกข้อความ' }],
    variables: { definitions: [], values: {} },
    currentVersionNumber: 1,
    deletedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    prisma = {
      documentType: {
        findUnique: vi.fn(),
      },
      template: {
        findUnique: vi.fn(),
      },
      document: {
        create: vi.fn(),
        findMany: vi.fn(),
        findFirst: vi.fn(),
        update: vi.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<DocumentsService>(DocumentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('AC-1: เข้าสู่ระบบเป็น A แล้วสร้างเอกสาร ระบบผูกเจ้าของเป็น A และแสดงในรายการของ A', () => {
    it('should create document strictly bound to User A and populate default template AST and variables', async () => {
      prisma.documentType.findUnique.mockResolvedValue(mockDocType);
      prisma.template.findUnique.mockResolvedValue(mockTemplate);
      prisma.document.create.mockResolvedValue({
        ...docA,
        documentType: mockDocType,
        template: mockTemplate,
      });

      const result = await service.create(userA.id, {
        documentTypeId: mockDocType.id,
        templateId: mockTemplate.id,
        title: 'เอกสารของ A',
      });

      expect(prisma.document.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            userId: userA.id, // Strictly bound to User A
            documentTypeId: mockDocType.id,
            templateId: mockTemplate.id,
            title: 'เอกสารของ A',
            content: mockTemplate.defaultContent,
            variables: expect.objectContaining({
              definitions: mockTemplate.variableDefinitions,
            }),
          }),
        }),
      );
      expect(result.userId).toBe(userA.id);
    });

    it('should return User A documents when User A queries their document list', async () => {
      prisma.document.findMany.mockResolvedValue([docA]);

      const result = await service.findAll(userA.id);

      expect(prisma.document.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            userId: userA.id,
            deletedAt: null,
          }),
        }),
      );
      expect(result).toHaveLength(1);
      expect(result[0].userId).toBe(userA.id);
    });
  });

  describe('AC-2: เข้าสู่ระบบเป็น B แล้วรายการและ API ไม่คืนข้อมูลเอกสารของ A', () => {
    it('should query strictly with User B id and not return User A documents in findAll', async () => {
      prisma.document.findMany.mockResolvedValue([]); // B has no docs

      const result = await service.findAll(userB.id);

      expect(prisma.document.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            userId: userB.id,
            deletedAt: null,
          }),
        }),
      );
      expect(result).toHaveLength(0);
    });

    it('should throw ForbiddenException if User B attempts to access User A document via findOne', async () => {
      prisma.document.findFirst.mockResolvedValue(docA); // Document belongs to User A

      await expect(service.findOne(docA.id, userB.id)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should throw ForbiddenException if User B attempts to update User A document', async () => {
      prisma.document.findFirst.mockResolvedValue(docA); // Belongs to User A

      await expect(
        service.update(docA.id, userB.id, { title: 'B แอบเปลี่ยนชื่อ' }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException if User B attempts to delete User A document', async () => {
      prisma.document.findFirst.mockResolvedValue(docA); // Belongs to User A

      await expect(service.remove(docA.id, userB.id)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('AC-4: สร้างเอกสารผ่าน API โดยส่ง OwnerID ของคนอื่น ระบบไม่สร้างเอกสารในนามคนอื่น', () => {
    it('should strictly use authenticated userId and ignore spoofed payload values', async () => {
      prisma.documentType.findUnique.mockResolvedValue(mockDocType);
      prisma.document.create.mockImplementation((args: any) => ({
        ...docA,
        ...args.data,
      }));

      // Attacker sends request authenticated as userB but tries to pass spoofed ownerId/userId
      const spoofedPayload = {
        documentTypeId: mockDocType.id,
        title: 'พยายามปลอมแปลงเอกสารในนาม A',
        userId: userA.id,
        ownerId: userA.id,
      } as any;

      const result = await service.create(userB.id, spoofedPayload);

      // Must be created with userB.id (the authenticated caller), NOT userA.id
      expect(prisma.document.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            userId: userB.id,
          }),
        }),
      );
      expect(result.userId).toBe(userB.id);
    });
  });

  describe('Document Not Found Handling', () => {
    it('should throw NotFoundException if document does not exist', async () => {
      prisma.document.findFirst.mockResolvedValue(null);

      await expect(
        service.findOne('non-existent-id', userA.id),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if documentType does not exist during creation', async () => {
      prisma.documentType.findUnique.mockResolvedValue(null);

      await expect(
        service.create(userA.id, { documentTypeId: 'invalid-type-id' }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
