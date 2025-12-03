# UserIntegration API Documentation

make sure add {credential: include} when call the api.

## Add UserIntegration
**Endpoint : POST /api/userIntegration**


Request Body :

```json
{
    "isconnected":false,
    "userId":"user-123",
    "integrationId":"integration-123",
}
```

| Field         | Example Value         | Description       | Fill      |
|---------------|-------------------------|--------------------|-----------|
| isconnected   | false                   | status koneksi     | required  |
| userId        | `user-123`              | id pengguna        | required  |
| integrationId | `integration-123`       | id integrasi       | required  |





Response Body : 

```json
// Success response
{
    "status":200,
    "message":"UserIntegration created succesfully!!",
    "data":{
        "isconnected":false,
        "userId":"user-123",
        "integrationId":"integration-123",
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


## Get ALL UserIntegration
**Endpoint : GET /api/userIntegration?userId=**

Request Query : 

```http
page (required): ini misal seperti halaman berapa?,
limit (required): dihalaman itu ada brp data?,
userId (optional): id user,
```

Response Body : 

```json
// Success response
{
    "status":200,
    "data":[
        {
            "isconnected":false,
            "userId":"user-123",
            "integrationId":"integration-123",
        },
        {
            "isconnected":false,
            "userId":"user-123",
            "integrationId":"integration-123",
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


**Endpoint : GET /api/userIntegration/userIntegration:id**


Response Body : 

```json
// Success response
{
    "status":200,
    "data":{
            "isconnected":false,
            "userId":"user-123",
            "integrationId":"integration-123",
    }
}
```
```json
// Error response
{
    "status":400,
    "error":"UserIntegrationId is Invalid",
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


## Update UserIntegration
**Endpoint : Patch /api/admin/userIntegration/userIntegration:id**

Request Body :

```json
{
     "isconnected":true, //Optional
}
```


Response Body : 

```json
// Success response
{
    "status":200,
    "message":"UserIntegration updated successufully!!",
    "data":{
            "isconnected":true,
            "userId":"user-123",
            "integrationId":"integration-123",
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
    "error":"UserIntegrationId is Invalid",
}
```
```json
// Error response
{
    "status":400,
    "error":"Validation Error",
}
```


## Delete UserIntegration
**Endpoint : DELETE /api/admin/userIntegration/userIntegration:id**



Response Body : 

```json
// Success response
{
    "status":200,
    "message":"UserIntegration deleted Successfuly",
}
```
```json
// Error response
{
    "status":4010,
    "error":"UserIntegrationId is Invalid",
}
```
```json
// Error response
{
    "status":401,
    "error":"Unathorized",
}
```


