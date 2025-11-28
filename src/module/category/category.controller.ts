import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Category } from '@prisma/client';
import {
  CategoryApi,
  ChangeCategory,
  GetModelCategory,
} from 'src/model/category.model';
import { WebResponse } from 'src/model/web.model';
import { CategoryService } from './service/category.service';

@Controller('api')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}
  @Post('/admin/category')
  @HttpCode(200)
  async addNewMessage(
    @Body() body: CategoryApi,
  ): Promise<WebResponse<CategoryApi>> {
    const data = await this.categoryService.addNewCategory(body);
    return {
      data: data,
      message: 'Category created succesfully!!',
      status: '200',
    };
  }

  @Get('/admin/category')
  @HttpCode(200)
  async getMessageAdmin(
    @Query() query: GetModelCategory,
  ): Promise<WebResponse<Category[]>> {
    const data = await this.categoryService.getCategory(query);
    return {
      data: data.Category,
      pagination: data.Pagination,
      status: '200',
    };
  }
  @Get('/admin/category/:id')
  @HttpCode(200)
  async getMessagebyid(
    @Param('id') id: string,
  ): Promise<WebResponse<Category>> {
    const data = await this.categoryService.getCategorybyId(id);
    return {
      data: data,
      status: '200',
    };
  }

  @Patch('/admin/category/:id')
  @HttpCode(200)
  async editMessage(
    @Body() body: ChangeCategory,
    @Param('id') id: string,
  ): Promise<WebResponse<CategoryApi>> {
    const data = await this.categoryService.editCategory({ ...body, id: id });
    return {
      data: data,
      message: 'Category updated succesfully!!',
      status: '200',
    };
  }
  @Delete('/admin/category/:id')
  @HttpCode(200)
  async deleteMessage(
    @Param('id') id: string,
  ): Promise<WebResponse<CategoryApi>> {
    await this.categoryService.deleteCategory(id);
    return {
      message: 'Category deleted succesfully!!',
      status: '200',
    };
  }
}
