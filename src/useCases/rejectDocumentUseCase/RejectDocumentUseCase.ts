import { AppError } from '../../errors/AppError';
import { prismaClient } from '../../prisma';

type Document = {
  id: string;
  description: string;
  pdf: string;
  hours: number;
  type: string;
  status: number;
  user_id: string;
  createdAt: Date;
};

export class RejectDocumentUseCase {
  async execute(document_id: string): Promise<Document> {
    let document = await prismaClient.document.findFirst({
      where: { id: document_id }
    });

    if (!document) {
      throw new AppError('Document not found');
    }

    if (document.status !== 0) {
      throw new AppError(
        'Documento já homologado, não é possível realizar alterações.'
      );
    }

    document = await prismaClient.document.update({
      where: { id: document_id },
      data: { status: 2 }
    });

    return document;
  }
}
