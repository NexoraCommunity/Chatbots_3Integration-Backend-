# Integration API Documentation

make sure add {credential: include} when call the api.

## Add Integration
**Endpoint : POST /api/admin/integration**


Request Body :

```json
{
    "name":"Telegram",
    "type":"Chat",
}
```


| Field | Example Value      | Description     | Fill      |
|-------|----------------------|------------------|-----------|
| name  | `Telegram`           | nama platform    | required  |
| type  | `Chat`, `LLM`        | jenis layanan    | required  |





Response Body : 

```json
// Success response
{
    "status":200,
    "message":"Integration created succesfully!!",
    "data":{
        "name":"Telegram",
        "type":"Chat",
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


## Get ALL Integration
**Endpoint : GET /api/integration**

Response Body : 

```json
// Success response
{
    "status":200,
    "data":[
        {
            "name":"Gemini",
            "type":"LLM",
        },
        {
            "name":"Telegram",
            "type":"Chat",
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


**Endpoint : GET /api/integration/integration:id**


Response Body : 

```json
// Success response
{
    "status":200,
    "data":{
        "name":"Telegram",
        "type":"Chat",
    }
}
```
```json
// Error response
{
    "status":400,
    "error":"IntegrationId is Invalid",
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


## Update Integration
**Endpoint : Patch /api/admin/integration/integration:id**

Request Body :

```json
{
        "name":"Telegram Updated", //Optional
        "type":"Chat Updated", //Optional
}
```


Response Body : 

```json
// Success response
{
    "status":200,
    "message":"Integration updated successufully!!",
    "data":{
        "name":"Telegram Updated", 
        "type":"Chat Updated", 
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
    "error":"IntegrationId is Invalid",
}
```
```json
// Error response
{
    "status":400,
    "error":"Validation Error",
}
```


## Delete Integration
**Endpoint : DELETE /api/admin/integration/integration:id**



Response Body : 

```json
// Success response
{
    "status":200,
    "message":"Integration deleted Successfuly",
}
```
```json
// Error response
{
    "status":4010,
    "error":"IntegrationId is Invalid",
}
```
```json
// Error response
{
    "status":401,
    "error":"Unathorized",
}
```


