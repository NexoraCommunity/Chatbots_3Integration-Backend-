# VariantValue API Documentation

make sure add {credential: include} when call the api.

## Add VariantValue
**Endpoint : POST /api/variantValue**


Request Body :

```json
{
    "name":"hijau",
    "optionId":"option-123",
}
```


| Field    | Example Value   | Description    | Fill      |
|----------|------------------|----------------|-----------|
| name     | `hijau`, etc.    | nilai opsi     | required  |
| optionId | `option-123`     | id opsi        | required  |





Response Body : 

```json
// Success response
{
    "status":200,
    "message":"VariantValue created succesfully!!",
    "data":{
        "name":"hijau",
        "optionId":"option-123",
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


## Get ALL VariantValue
**Endpoint : GET /api/variantValue?optionId=**

Request Query : 

```http
page (required): ini misal seperti halaman berapa?,
limit (required): dihalaman itu ada brp data?,
optionId (required): id user,
```

Response Body : 

```json
// Success response
{
    "status":200,
    "data":[
        {
            "name":"hijau",
            "optionId":"option-123",
        },
        {
            "name":"xl",
            "optionId":"option-123",
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


**Endpoint : GET /api/variantValue/variantValue:id**


Response Body : 

```json
// Success response
{
    "status":200,
    "data":{
        "name":"hijau",
        "optionId":"option-123",
    }
}
```
```json
// Error response
{
    "status":400,
    "error":"VariantValueId is Invalid",
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





## Delete VariantValue
**Endpoint : DELETE /api/variantValue/variantValue:id**



Response Body : 

```json
// Success response
{
    "status":200,
    "message":"VariantValue deleted Successfuly",
}
```
```json
// Error response
{
    "status":4010,
    "error":"VariantValueId is Invalid",
}
```
```json
// Error response
{
    "status":401,
    "error":"Unathorized",
}
```


