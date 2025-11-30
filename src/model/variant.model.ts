export class VariantOptionApi {
  productId: string;
  name: string;
}

export class VariantValueApi {
  optionId: string;
  value: string;
}
export class ProductVariantValueApi {
  variantId: string;
  valueId: string;
}

export class ProductVariantApi {
  productId: string;
  sku: string;
  stock: number;
  price: number;
  image: string;
}

export class ChangeProductVariant {
  id: string;
  sku: string;
  stock: number;
  price: number;
  image: string;
}
