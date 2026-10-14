import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateDocumentDto } from './dto/create-document.dto.js';
import { UpdateDocumentDto } from './dto/update-document.dto.js';
import { QueryDocumentDto } from './dto/query-document.dto.js';

@Injectable()
export class DocumentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateDocumentDto) {
    const documentType = await this.prisma.documentType.findUnique({
      where: { id: dto.documentTypeId },
    });

    if (!documentType) {
      throw new NotFoundException('ไม่พบประเภทเอกสารที่ระบุในระบบ');
    }

    let initialContent = dto.content ?? [];
    let initialVariables = dto.variables ?? { definitions: [], values: {} };

    if (dto.templateId) {
      const template = await this.prisma.template.findUnique({
        where: { id: dto.templateId },
      });

      if (!template) {
        throw new NotFoundException('ไม่พบเทมเพลตที่ระบุในระบบ');
      }

      if (!dto.content) {
        initialContent = (template.defaultContent as any) ?? [];
      }

      if (!dto.variables) {
        initialVariables = {
          definitions: (template.variableDefinitions as any) ?? [],
          values: {},
        };
      }
    }

    return this.prisma.document.create({
      data: {
        userId, // Enforce ownership to authenticated user
        documentTypeId: dto.documentTypeId,
        templateId: dto.templateId ?? null,
        title: dto.title?.trim() || 'เอกสารไม่มีชื่อ',
        status: 'DRAFT',
        content: initialContent as any,
        variables: initialVariables as any,
        currentVersionNumber: 1,
      },
      include: {
        documentType: true,
        template: {
          select: {
            id: true,
            title: true,
            description: true,
            thumbnailUrl: true,
          },
        },
      },
    });
  }

  async findAll(userId: string, query?: QueryDocumentDto) {
    const where: any = {
      userId,
      deletedAt: null,
    };

    if (query?.status) {
      where.status = query.status;
    }

    if (query?.search) {
      where.title = {
        contains: query.search.trim(),
        mode: 'insensitive',
      };
    }

    return this.prisma.document.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      include: {
        documentType: true,
        template: {
          select: {
            id: true,
            title: true,
            description: true,
            thumbnailUrl: true,
          },
        },
      },
    });
  }

  async findOne(id: string, userId: string) {
    const document = await this.prisma.document.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        documentType: true,
        template: {
          select: {
            id: true,
            title: true,
            description: true,
            thumbnailUrl: true,
          },
        },
      },
    });

    if (!document) {
      throw new NotFoundException('ไม่พบเอกสารที่ระบุ');
    }

    if (document.userId !== userId) {
      throw new ForbiddenException('คุณไม่มีสิทธิ์เข้าถึงเอกสารนี้');
    }

    return document;
  }

  async update(id: string, userId: string, dto: UpdateDocumentDto) {
    await this.findOne(id, userId);

    return this.prisma.document.update({
      where: { id },
      data: {
        ...(dto.title !== undefined && { title: dto.title.trim() }),
        ...(dto.status !== undefined && { status: dto.status }),
        ...(dto.content !== undefined && { content: dto.content as any }),
        ...(dto.variables !== undefined && { variables: dto.variables as any }),
      },
      include: {
        documentType: true,
        template: {
          select: {
            id: true,
            title: true,
            description: true,
            thumbnailUrl: true,
          },
        },
      },
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);

    await this.prisma.document.update({
      where: { id },
      data: {
        status: 'TRASH',
        deletedAt: new Date(),
      },
    });

    return { message: 'ย้ายเอกสารไปถังขยะเรียบร้อยแล้ว' };
  }
}
