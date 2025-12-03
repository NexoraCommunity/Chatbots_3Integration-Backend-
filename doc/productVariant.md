# ProductVariant API Documentation

make sure add {credential: include} when call the api.

## generate ProductVariant
**Endpoint : POST /api/productVariant/generate**

before generate product variant must created variantOption and variantValue first


Request Body :

```json
{
    "productId":"bot-123",
}
```


| Field      | Example Value   | Description   | Fill      |
|------------|------------------|----------------|-----------|
| productId  | `product-123`    | id produk      | required  |





Response Body : 

- variantOption * variantValue

example: 

- warna: hijau, 
- ukuran: s,

```json
// Success response
    {
        "status":200,
        "message":"ProductVariant created succesfully!!",
        "data":[
            {
                "productId":"product-123",
                "sku":"",
                "stock":"", 
                "price":"", 
                "image":"", 
                "productVariantValueId":"pvv-123",
            },
         
        ]
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


## Get ALL ProductVariant
**Endpoint : GET /api/productVariant?productId=**

Request Query : 

```http
productId (optional): id user,
```

Response Body : 

```json
// Success response
{
    "status":200,
    "data":[
       {
        "id": "pv-123",
        "productId": "prod-1",
        "sku": "PROD-HIJAU-XL",
        "stock": 10,
        "price": 75000,

        "values": [
        {
            "id": "pvval-1",
            "variantId": "pv-123",
            "valueId": "val-hijau"
        },
        {
            "id": "pvval-2",
            "variantId": "pv-123",
            "valueId": "val-xl"
        }
        ]
      }
    ],
}
```
```json
// Error response
{
    "status":401,
    "error":"Unathorized",
}
```


**Endpoint : GET /api/productVariant/productVariant:id**


Response Body : 

```json
// Success response
{
    "status":200,
    "data":{
        "id": "pv-123",
        "productId": "prod-1",
        "sku": "PROD-HIJAU-XL",
        "stock": 10,
        "price": 75000,
        "values": [
        {
            "id": "pvval-1",
            "variantId": "pv-123",
            "valueId": "val-hijau"
        },
        {
            "id": "pvval-2",
            "variantId": "pv-123",
            "valueId": "val-xl"
        }
    }
}
```
```json
// Error response
{
    "status":400,
    "error":"ProductVariantId is Invalid",
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


## Update ProductVariant
**Endpoint : Patch /api/productVariant/productVariant:id**

Request Body :

```json
{
    "price":"updated", //Optional
    "stock":100, //Optional
    "sku":"SKH30", //Optional
    "image":"babi.png", //Optional
}
```


Response Body : 

```json
// Success response
{
    "status":200,
    "message":"ProductVariant updated successufully!!",
    "data":{
        "price":"updated", 
        "stock":100, 
        "sku":"SKH30", 
        "image":"babi.png", 
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
    "error":"ProductVariantId is Invalid",
}
```
```json
// Error response
{
    "status":400,
    "error":"Validation Error",
}
```


## Delete ProductVariant
**Endpoint : DELETE /api/productVariant/productVariant:id**



Response Body : 

```json
// Success response
{
    "status":200,
    "message":"ProductVariant deleted Successfuly",
}
```
```json
// Error response
{
    "status":400,
    "error":"ProductVariantId is Invalid",
}
```
```json
// Error response
{
    "status":401,
    "error":"Unathorized",
}
```


