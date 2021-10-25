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

type DeleteDocumentRequest = {
  document_id: string;
  user_id: string;
};

export class DeleteDocumentUseCase {
  async execute({
    document_id,
    user_id
  }: DeleteDocumentRequest): Promise<Document> {
    const document = await prismaClient.document.findFirst({
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

    if (user_id !== document.user_id) {
      throw new AppError('You are not authorized to delete this document', 403);
    }

    await prismaClient.document.delete({
      where: { id: document_id }
    });

    return document;
  }
}
