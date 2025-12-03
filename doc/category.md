# Category API Documentation

make sure add {credential: include} when call the api.

## Add Category
**Endpoint : POST /api/admin/category**


Request Body :

```json
{
    "name":"Teknologi  dan Informasi",
}
```


| Field | Example Value              | Description        | Fill       |
|-------|-----------------------------|---------------------|------------|
| name  | `Teknologi dan informasi`   | bidang keahlian     | required   |






Response Body : 

```json
// Success response
{
    "status":200,
    "message":"Category created succesfully!!",
    "data":{
         "name":"Teknologi  dan Informasi",
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


## Get ALL Category
**Endpoint : GET /api/category?page=&limit=**

Request Query : 

```http
page (required): ini misal seperti halaman berapa?,
limit (required): dihalaman itu ada brp data?,
```

Response Body : 

```json
// Success response
{
    "status":200,
    "data":[
        {
            "name":"Teknologi  dan Informasi",
        },
        {
            "name":"Perikanan  dan Informasi",
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


**Endpoint : GET /api/admin/category/category:id**


Response Body : 

```json
// Success response
{
    "status":200,
    "data":{
            "name":"Teknologi  dan Informasi",
    }
}
```
```json
// Error response
{
    "status":400,
    "error":"CategoryId is Invalid",
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


## Update Category
**Endpoint : Patch /api/admin/category/category:id**

Request Body :

```json
{
        "name":"Teknologi  dan Informasi Updated", //Optional
}
```


Response Body : 

```json
// Success response
{
    "status":200,
    "message":"Category updated successufully!!",
    "data":{
            "name":"Teknologi  dan Informasi Updated",
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
    "error":"CategoryId is Invalid",
}
```
```json
// Error response
{
    "status":400,
    "error":"Validation Error",
}
```


## Delete Category
**Endpoint : DELETE /api/admin/category/category:id**



Response Body : 

```json
// Success response
{
    "status":200,
    "message":"Category deleted Successfuly",
}
```
```json
// Error response
{
    "status":4010,
    "error":"CategoryId is Invalid",
}
```
```json
// Error response
{
    "status":401,
    "error":"Unathorized",
}
```


