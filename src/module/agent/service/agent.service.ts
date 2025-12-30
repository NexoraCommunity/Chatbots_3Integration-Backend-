import { HttpException, Injectable } from '@nestjs/common';
import { Agent } from '@prisma/client';
import { PrismaService } from 'src/module/common/prisma.service';
import { ValidationService } from 'src/module/common/validation.service';
import {
  changeAgent,
  GetModelAgent,
  PaginationResponseAgent,
  postAgent,
  AgentApi,
} from 'src/model/agent.model';
import { AgentValidation } from '../dto/agent.validation';
import { DocumentReaderService } from '../documentReader/documentReader.service';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { XenovaEmbeddings } from 'src/module/aiWrapper/RagService/xenovaEmbbeding.service';
import { moveFile } from 'src/interceptors/multer.interceptors';
import path from 'path';
// import { vectorStoreService } from 'src/module/aiWrapper/RagService/vectoreStore.service';

@Injectable()
export class AgentService {
  constructor(
    private prismaService: PrismaService,
    private validationService: ValidationService,
    private documentReaderService: DocumentReaderService,
    private xenovaEmbbeding: XenovaEmbeddings,
    // private vectoreStore: vectorStoreService,
    // private splitter = new RecursiveCharacterTextSplitter({
    //   chunkSize: 500,
    //   chunkOverlap: 50,
    // }),
  ) {}

  async getAgentByUserId(
    query: GetModelAgent,
  ): Promise<PaginationResponseAgent> {
    const AgentValid: GetModelAgent = this.validationService.validate(
      AgentValidation.Pagination,
      query,
    );
    if (!AgentValid) throw new HttpException('Validation Error', 400);
    const { page, limit, userId } = AgentValid;
    if (query.userId == '' || !query.userId)
      throw new HttpException('Validation Error', 400);

    const data = await this.prismaService.agent.findMany({
      where: {
        userId: query.userId,
      },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      orderBy: { createdAt: 'desc' },
    });

    const totalData = await this.prismaService.agent.count();

    return {
      Agent: data,
      Pagination: {
        page: Number(page),
        pageSize: Number(limit),
        totalItems: totalData,
        totalPages: totalData / Number(limit),
      },
    };
  }
  async getAgent(query: GetModelAgent): Promise<PaginationResponseAgent> {
    const AgentValid: GetModelAgent = this.validationService.validate(
      AgentValidation.Pagination,
      query,
    );
    if (!AgentValid) throw new HttpException('Validation Error', 400);
    const { page, limit } = AgentValid;

    const data = await this.prismaService.agent.findMany({
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      orderBy: { createdAt: 'desc' },
    });
    const totalData = await this.prismaService.agent.count();

    return {
      Agent: data,
      Pagination: {
        page: Number(page),
        pageSize: Number(limit),
        totalItems: totalData,
        totalPages: totalData / Number(limit),
      },
    };
  }

  async getAgentbyId(id: string): Promise<Agent> {
    try {
      if (!id) throw new HttpException('Validation Error', 400);

      const data = await this.prismaService.agent.findFirst({
        where: {
          id: id,
        },
      });

      if (!data) throw new HttpException('Cannot Find Agent', 403);

      return data;
    } catch (error) {
      throw new HttpException('AgentId is Invalid', 400);
    }
  }

  async addNewAgent(req: postAgent, file: string | null): Promise<AgentApi> {
    const AgentValid: postAgent = this.validationService.validate(
      AgentValidation.Agent,
      req,
    );

    if (!AgentValid) throw new HttpException('Validation Error', 400);

    const data = await this.prismaService.agent.create({
      data: AgentValid,
    });

    if (data && file) {
      await moveFile(path.join('uploads', 'temp', file), 'file');
    }

    // const document = await this.documentReaderService.read(
    //   AgentValid.filePath,
    // );

    // const splitedText = await this.splitter.createDocuments([document]);

    // const embeded = await this.xenovaEmbbeding.embedDocuments(
    //   splitedText.map((d) => d.pageContent),
    // );

    // await this.vectoreStore.store(
    //   embeded,
    //   'Users',
    //   AgentValid.userId + data.id,
    //   document,
    // );

    const res: AgentApi = {
      name: data.name,
      llm: data.llm,
      filePath: data.filePath,
      dataTrain: data.dataTrain,
      agent: data.agent,
    };

    return res;
  }

  async editAgent(req: changeAgent, file: string | null) {
    try {
      const filePath = path.join('file', file ? file : '');
      const AgentValid: AgentApi = this.validationService.validate(
        AgentValidation.chageAgent,
        req,
      );

      if (!AgentValid) throw new HttpException('Validation Error', 400);
      const data = await this.prismaService.agent.update({
        where: {
          id: req.id,
        },
        data: { ...AgentValid, filePath: file ? filePath : req.filePath },
      });

      if (data && file) {
        await moveFile(path.join('uploads', 'temp', file), 'file');
        await moveFile(String(req.filePath), 'temp');
      }

      const res: AgentApi = {
        name: data.name,
        agent: data.agent,
        filePath: data.filePath,
        dataTrain: data.dataTrain,
        llm: data.llm,
      };
      return res;
    } catch (error) {
      if (String(error).includes('invalid_type')) throw error;
      throw new HttpException('AgentId is Invalid', 400);
    }
  }
  async deleteAgent(id: string) {
    if (!id) throw new HttpException('Validation Error', 400);

    try {
      const data = await this.prismaService.agent.delete({
        where: {
          id: id,
        },
      });

      if (data) {
        await moveFile(String(data.filePath), 'temp');
      }

      return true;
    } catch (error) {
      throw new HttpException('AgentId is Invalid', 400);
    }
  }
}
