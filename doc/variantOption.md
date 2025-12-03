# VariantOption API Documentation

make sure add {credential: include} when call the api.

## Add VariantOption
**Endpoint : POST /api/variantOption**


Request Body :

```json
{
    "name":"warna",
    "productId":"product-123",
}
```


| Field      | Example Value     | Description     | Fill      |
|------------|---------------------|------------------|-----------|
| name       | `warna`, etc.       | nama opsi        | required  |
| productId  | `product-123`       | id produk        | required  |





Response Body : 

```json
// Success response
{
    "status":200,
    "message":"VariantOption created succesfully!!",
    "data":{
        "name":"warna",
        "productId":"product-123",
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


## Get ALL VariantOption
**Endpoint : GET /api/variantOption?productId=**

Request Query : 

```http
page (required): ini misal seperti halaman berapa?,
limit (required): dihalaman itu ada brp data?,
productId (required): id user,
```

Response Body : 

```json
// Success response
{
    "status":200,
    "data":[
        {
            "name":"warna",
            "productId":"product-123",
        },
        {
            "name":"ukuran",
            "productId":"product-123",
        },
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


**Endpoint : GET /api/variantOption/variantOption:id**


Response Body : 

```json
// Success response
{
    "status":200,
    "data":{
        "name":"warna",
        "productId":"product-123",
    }
}
```
```json
// Error response
{
    "status":400,
    "error":"VariantOptionId is Invalid",
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





## Delete VariantOption
**Endpoint : DELETE /api/variantOption/variantOption:id**



Response Body : 

```json
// Success response
{
    "status":200,
    "message":"VariantOption deleted Successfuly",
}
```
```json
// Error response
{
    "status":4010,
    "error":"VariantOptionId is Invalid",
}
```
```json
// Error response
{
    "status":401,
    "error":"Unathorized",
}
```


