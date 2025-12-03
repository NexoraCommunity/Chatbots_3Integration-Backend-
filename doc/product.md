# Product API Documentation

make sure add {credential: include} when call the api.

## Add Product
**Endpoint : POST /api/product**


Request Body :

```json
{
    "name":"nexchabot",
    "description":"loremipsmundolorsiamercontrectur",
    "price":10000,
    "image":"hero.jpg/png/jpeg/webp",
    "stock":100,
    "sku":"SKH029",
    "weight":1,
    "userId":"user-123",
    "categoryId":"category-123",
}
```


| Field       | Example Value                     | Description        | Fill       |
|-------------|------------------------------------|---------------------|------------|
| name        | kentangGoreng                      | nama produk         | required   |
| description | loremipsumdolorsiamet              | deskripsi produk    | required   |
| price       | 10000 (float)                      | harga produk        | required   |
| image       | prod.jpg/png/jpeg/webp             | gambar produk       | required   |
| stock       | 100 (int)                          | jumlah stok         | required   |
| sku         | SKH29                               | kode unik produk    | required   |
| weight      | 2 (float) kg                       | berat produk        | optional   |
| userId      | user-123                           | id pemilik          | required   |
| categoryId  | category-123                       | id kategori         | required   |





Response Body : 

```json
// Success response
{
    "status":200,
    "message":"Product created succesfully!!",
    "data":{
        "name":"nexchabot",
        "description":"loremipsmundolorsiamercontrectur",
        "price":10000,
        "image":"hero.jpg/png/jpeg/webp",
        "stock":100,
        "sku":"SKH029",
        "weight":1,
        "userId":"user-123",
        "categoryId":"category-123",
    },
}
```

```json
// Error response
{
    "status":400,
    "error":"Validation Error",
}
```

```json
// Error response
{
    "status":401,
    "error":"Unathorized",
}
```

---


## Get ALL Product
**Endpoint : GET /api/product?page=&limit=&userId=&botId=**

Request Query : 

```http
page (required): ini misal seperti halaman berapa?,
limit (required): dihalaman itu ada brp data?,
userId (required): id user,
```

Response Body : 

```json
// Success response
{
    "status":200,
    "data":[
        {
            "name":"nexchabot",
            "description":"loremipsmundolorsiamercontrectur",
            "price":10000,
            "image":"hero.jpg/png/jpeg/webp",
            "stock":100,
            "sku":"SKH029",
            "weight":1,
            "userId":"user-123",
            "categoryId":"category-123",
        },
        {
            "name":"nexchabot",
            "description":"loremipsmundolorsiamercontrectur",
            "price":10000,
            "image":"hero.jpg/png/jpeg/webp",
            "stock":100,
            "sku":"SKH029",
            "weight":1,
            "userId":"user-123",
            "categoryId":"category-123",
        },
    ],
    "pagination": {
            "page": 1,
            "pageSize": 2,
            "totalPages": 5,
            "totalItems": 10
    }
}
```
```json
// Error response
{
    "status":401,
    "error":"Unathorized",
}
```


**Endpoint : GET /api/product/product:id**


Response Body : 

```json
// Success response
{
    "status":200,
    "data":{
        "id": "prod-123",
        "name": "Kaos Polos Premium",
        "description": "Kaos dengan bahan katun 100%",
        "price": 75000,
        "stock": 100,
        "image": "product-main.jpg",
        "sku": "KAOS-001",
        "variantOptions": [
                {
                "id": "opt-1",
                "name": "Color",
                "values": [
                    { "id": "val-1", "value": "Red", "image": "red.jpg" },
                    { "id": "val-2", "value": "Blue", "image": "blue.jpg" }
                ]
                },
                {
                "id": "opt-2",
                "name": "Size",
                "values": [
                    { "id": "val-3", "value": "M" },
                    { "id": "val-4", "value": "L" },
                    { "id": "val-5", "value": "XL" }
                ]
                }
        ],

         "productVariants": [
                {
                "id": "pv-1",
                "sku": "KAOS-RED-M",
                "stock": 20,
                "price": 75000,
                "image": "red.jpg",
                "values": [
                    { "option": "Color", "value": "Red" },
                    { "option": "Size",  "value": "M" }
                ]
                },
                {
                "id": "pv-2",
                "sku": "KAOS-RED-L",
                "stock": 15,
                "price": 75000,
                "image": "red.jpg",
                "values": [
                    { "option": "Color", "value": "Red" },
                    { "option": "Size",  "value": "L" }
                ]
                },
                {
                "id": "pv-3",
                "sku": "KAOS-RED-XL",
                "stock": 10,
                "price": 75000,
                "image": "red.jpg",
                "values": [
                    { "option": "Color", "value": "Red" },
                    { "option": "Size",  "value": "XL" }
                ]
                },

                {
                "id": "pv-4",
                "sku": "KAOS-BLUE-M",
                "stock": 18,
                "price": 75000,
                "image": "blue.jpg",
                "values": [
                    { "option": "Color", "value": "Blue" },
                    { "option": "Size",  "value": "M" }
                ]
                },
                {
                "id": "pv-5",
                "sku": "KAOS-BLUE-L",
                "stock": 14,
                "price": 75000,
                "image": "blue.jpg",
                "values": [
                    { "option": "Color", "value": "Blue" },
                    { "option": "Size",  "value": "L" }
                ]
                },
                {
                "id": "pv-6",
                "sku": "KAOS-BLUE-XL",
                "stock": 9,
                "price": 75000,
                "image": "blue.jpg",
                "values": [
                    { "option": "Color", "value": "Blue" },
                    { "option": "Size",  "value": "XL" }
                ]
                }
         ]
}

}
```
```json
// Error response
{
    "status":400,
    "error":"ProductId is Invalid",
}
```
```json
// Error response
{
    "status":401,
    "error":"Unathorized",
}
```


---


## Update Product
**Endpoint : Patch /api/product/product:id**

Request Body :

```json
{
        "name":"nexchabot updated", //Optional
        "description":"loremipsmundolorsiamercontrectur updated", //Optional
        "price":10001,//Optional
        "image":"pp.jpg/png/jpeg/webp",//Optional
        "stock":101,//Optional
        "sku":"SKH030",//Optional
        "weight":20,//Optional
        "categoryId":"category-234",//Optional
}
```


Response Body : 

```json
// Success response
{
    "status":200,
    "message":"Product updated successufully!!",
    "data":{
        "name":"nexchabot updated", 
        "description":"loremipsmundolorsiamercontrectur updated",
        "price":10001,
        "image":"pp.jpg/png/jpeg/webp",
        "stock":101,
        "sku":"SKH030",
        "weight":20,
        "categoryId":"category-234",
    },
}
```
```json
// Error response
{
    "status":401,
    "error":"Unathorized",
}
```
```json
// Error response
{
    "status":400,
    "error":"ProductId is Invalid",
}
```
```json
// Error response
{
    "status":400,
    "error":"Validation Error",
}
```


## Delete Product
**Endpoint : DELETE /api/product/product:id**



Response Body : 

```json
// Success response
{
    "status":200,
    "message":"Product deleted Successfuly",
}
```
```json
// Error response
{
    "status":4010,
    "error":"ProductId is Invalid",
}
```
```json
// Error response
{
    "status":401,
    "error":"Unathorized",
}
```


