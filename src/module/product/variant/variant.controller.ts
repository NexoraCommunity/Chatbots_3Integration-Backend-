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
  ChangeProductVariant,
  ProductVariantApi,
  VariantOptionApi,
  VariantValueApi,
} from 'src/model/variant.model';
import { WebResponse } from 'src/model/web.model';
import { VariantOptionService } from './service/variantOption.service';
import { ProductVariant, VariantOption, VariantValue } from '@prisma/client';
import { VariantValueService } from './service/variantValue.service';
import { ProductVariantService } from './service/productVariant.service';

@Controller('api')
export class VariantController {
  constructor(
    private variantOptionService: VariantOptionService,
    private variantValueService: VariantValueService,
    private productVariantService: ProductVariantService,
  ) {}
  //  --- ProductVariant ---

  @Get('productVariant')
  @HttpCode(200)
  async getProductVariant(
    @Query() query,
  ): Promise<WebResponse<ProductVariant[]>> {
    const data =
      await this.productVariantService.getProductVariantByProductId(query);
    return {
      data: data,
      status: '200',
    };
  }
  @Post('productVariant/generate')
  @HttpCode(200)
  async generateProductVariant(
    @Body() body,
  ): Promise<WebResponse<ProductVariant[]>> {
    const data = await this.productVariantService.generateProductVariant(body);
    return {
      data: data,
      message: 'ProductVariant generated succesfully!!',
      status: '200',
    };
  }

  @Patch('productVariant/:id')
  @HttpCode(200)
  async editProduct(
    @Body() body: ChangeProductVariant,
    @Param('id') id: string,
  ): Promise<WebResponse<ProductVariant>> {
    const data = await this.productVariantService.editProductVariant({
      ...body,
      id: id,
    });
    return {
      data: data,
      message: 'ProductVariant updated succesfully!!',
      status: '200',
    };
  }
  @Delete('productVariant/:id')
  @HttpCode(200)
  async deleteProduct(
    @Param('id') id: string,
  ): Promise<WebResponse<ProductVariantApi>> {
    await this.productVariantService.deleteProductVariant(id);
    return {
      message: 'ProductVariant deleted succesfully!!',
      status: '200',
    };
  }

  //  --- End ProductVariant ---
  //  --- Variant Option ---
  @Post('variantOption')
  @HttpCode(200)
  async addNewVariantOption(
    @Body() body: VariantOptionApi,
  ): Promise<WebResponse<VariantOptionApi>> {
    const data = await this.variantOptionService.addNewVariantOption(body);
    return {
      data: data,
      message: 'VariantOption created succesfully!!',
      status: '200',
    };
  }

  @Get('variantOption')
  @HttpCode(200)
  async getVariantOption(
    @Query() query,
  ): Promise<WebResponse<VariantOption[]>> {
    const data =
      await this.variantOptionService.getVariantOptionByProductId(query);
    return {
      data: data,
      status: '200',
    };
  }
  @Get('variantOption/:id')
  @HttpCode(200)
  async getVariantOptionbyid(
    @Param('id') id: string,
  ): Promise<WebResponse<VariantOption>> {
    const data = await this.variantOptionService.getVariantOptionbyId(id);
    return {
      data: data,
      status: '200',
    };
  }

  @Delete('variantOption/:id')
  @HttpCode(200)
  async deleteVariantOption(
    @Param('id') id: string,
  ): Promise<WebResponse<VariantOptionApi>> {
    await this.variantOptionService.deleteVariantOption(id);
    return {
      message: 'VariantOption deleted succesfully!!',
      status: '200',
    };
  }
  //  --- End Variant Option ---
  //  ---  Variant Value ---
  @Post('variantValue')
  @HttpCode(200)
  async addNewVariantValue(
    @Body() body: VariantValueApi,
  ): Promise<WebResponse<VariantValueApi>> {
    const data = await this.variantValueService.addNewVariantValue(body);
    return {
      data: data,
      message: 'VariantValue created succesfully!!',
      status: '200',
    };
  }

  @Get('variantValue')
  @HttpCode(200)
  async getVariantValue(@Query() query): Promise<WebResponse<VariantValue[]>> {
    const data =
      await this.variantValueService.getVariantValueByVariantOptionId(query);
    return {
      data: data,
      status: '200',
    };
  }
  @Get('variantValue/:id')
  @HttpCode(200)
  async getVariantValuebyid(
    @Param('id') id: string,
  ): Promise<WebResponse<VariantValue>> {
    const data = await this.variantValueService.getVariantValuebyId(id);
    return {
      data: data,
      status: '200',
    };
  }

  @Delete('variantValue/:id')
  @HttpCode(200)
  async deleteVariantValue(
    @Param('id') id: string,
  ): Promise<WebResponse<VariantValueApi>> {
    await this.variantValueService.deleteVariantValue(id);
    return {
      message: 'VariantValue deleted succesfully!!',
      status: '200',
    };
  }
  // End VariantValue
}
