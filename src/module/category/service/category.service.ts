import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/module/common/prisma.service';

import { ValidationService } from 'src/module/common/validation.service';
import {
  CategoryApi,
  ChangeCategory,
  GetModelCategory,
  PaginationResponseCategory,
} from 'src/model/category.model';
import { CategoryValidation } from '../dto/category.validation';
import { Category } from '@prisma/client';

@Injectable()
export class CategoryService {
  constructor(
    private prismaService: PrismaService,
    private validationService: ValidationService,
  ) {}

  async getCategory(
    query: GetModelCategory,
  ): Promise<PaginationResponseCategory> {
    const CategoryValid: GetModelCategory = this.validationService.validate(
      CategoryValidation.Pagination,
      query,
    );
    if (!CategoryValid) throw new HttpException('Validation Error', 400);
    const { page, limit } = CategoryValid;

    const data = await this.prismaService.category.findMany({
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      orderBy: { createdAt: 'desc' },
    });
    const totalData = await this.prismaService.category.count();

    return {
      Category: data,
      Pagination: {
        page: Number(page),
        pageSize: Number(limit),
        totalItems: totalData,
        totalPages: totalData / Number(limit),
      },
    };
  }

  async getCategorybyId(id: string): Promise<Category> {
    try {
      if (!id) throw new HttpException('Validation Error', 400);

      const data = await this.prismaService.category.findFirst({
        where: {
          id: id,
        },
      });

      if (!data) throw new HttpException('Cannot Find Category', 403);

      return data;
    } catch (error) {
      throw new HttpException('CategoryId is Invalid', 400);
    }
  }

  async addNewCategory(req: CategoryApi): Promise<CategoryApi> {
    const CategoryValid: CategoryApi = this.validationService.validate(
      CategoryValidation.Category,
      req,
    );

    if (!CategoryValid) throw new HttpException('Validation Error', 400);

    const data = await this.prismaService.category.create({
      data: CategoryValid,
    });

    const res: CategoryApi = data;

    return res;
  }

  async editCategory(req: ChangeCategory) {
    try {
      const CategoryValid: ChangeCategory = this.validationService.validate(
        CategoryValidation.ChangeCategory,
        req,
      );

      if (!CategoryValid) throw new HttpException('Validation Error', 400);
      const data = await this.prismaService.category.update({
        where: {
          id: req.id,
        },
        data: CategoryValid,
      });

      const res: CategoryApi = data;
      return res;
    } catch (error) {
      if (String(error).includes('invalid_type')) throw error;
      throw new HttpException('CategoryId is Invalid', 400);
    }
  }
  async deleteCategory(id: string) {
    if (!id) throw new HttpException('Validation Error', 400);

    try {
      const data = await this.prismaService.category.delete({
        where: {
          id: id,
        },
      });
      return true;
    } catch (error) {
      throw new HttpException('CategoryId is Invalid', 400);
    }
  }
}
