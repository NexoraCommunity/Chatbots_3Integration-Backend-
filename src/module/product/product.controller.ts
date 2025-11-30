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
import {
  ChangeProduct,
  GetModelProduct,
  PostProduct,
  ProductApi,
} from 'src/model/product.model';
import { WebResponse } from 'src/model/web.model';
import { ProductService } from './service/product.service';
import { Product } from '@prisma/client';

@Controller('api')
export class ProductController {
  constructor(private productService: ProductService) {}
  @Post('product')
  @HttpCode(200)
  async addNewProduct(
    @Body() body: PostProduct,
  ): Promise<WebResponse<ProductApi>> {
    const data = await this.productService.addNewProduct(body);
    return {
      data: data,
      message: 'Product created succesfully!!',
      status: '200',
    };
  }

  @Get('product')
  @HttpCode(200)
  async getProduct(
    @Query() query: GetModelProduct,
  ): Promise<WebResponse<Product[]>> {
    const data = await this.productService.getProductByUserId(query);
    return {
      data: data.Product,
      pagination: data.Pagination,
      status: '200',
    };
  }
  @Get('/admin/product')
  @HttpCode(200)
  async getProductAdmin(
    @Query() query: GetModelProduct,
  ): Promise<WebResponse<Product[]>> {
    const data = await this.productService.getProduct(query);
    return {
      data: data.Product,
      pagination: data.Pagination,
      status: '200',
    };
  }
  @Get('product/:id')
  @HttpCode(200)
  async getProductbyid(@Param('id') id: string): Promise<WebResponse<Product>> {
    const data = await this.productService.getProductbyId(id);
    return {
      data: data,
      status: '200',
    };
  }

  @Patch('product/:id')
  @HttpCode(200)
  async editProduct(
    @Body() body: ChangeProduct,
    @Param('id') id: string,
  ): Promise<WebResponse<ProductApi>> {
    const data = await this.productService.editProduct({ ...body, id: id });
    return {
      data: data,
      message: 'Product updated succesfully!!',
      status: '200',
    };
  }
  @Delete('product:id')
  @HttpCode(200)
  async deleteProduct(
    @Param('id') id: string,
  ): Promise<WebResponse<ProductApi>> {
    await this.productService.deleteProduct(id);
    return {
      message: 'Product deleted succesfully!!',
      status: '200',
    };
  }
}
