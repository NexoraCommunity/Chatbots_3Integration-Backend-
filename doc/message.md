# Message API Documentation

make sure add {credential: include} when call the api.

## Add Message
**Endpoint : POST /api/message**


Request Body :

```json
{
    "message":"hii!!",
    "type":"text",
    "role":"bot",
    "conversationId":"conversation-123",
}
```


| Field          | Example Value                 | Description       | Fill      |
|----------------|--------------------------------|--------------------|-----------|
| message        | `hi!!`                         | isi pesan         | required  |
| type           | `text`, `image`, `voice`       | jenis pesan       | required  |
| role           | `bot`, `client`                | peran pengirim    | required  |
| conversationId | `aidj983j93jd0ojdnvjk8`        | id percakapan     | required  |




Response Body : 

```json
// Success response
{
    "status":200,
    "message":"Message created succesfully!!",
    "data":{
        "message":"hii!!",
        "type":"text",
        "role":"bot",
        "conversationId":"conversation-123",
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


## Get ALL Message
**Endpoint : GET /api/message?page=&limit=&conversationId=**

Request Query : 

```http
page (required): ini misal seperti halaman berapa?,
limit (required): dihalaman itu ada brp data?,
conversationId (optional): id conversation,
```

Response Body : 

```json
// Success response
{
    "status":200,
    "data":[
        {
            "message":"hii!!",
            "type":"text",
            "role":"bot",
            "conversationId":"conversation-123",
        },
        {
            "message":"hii!!",
            "type":"text",
            "role":"bot",
            "conversationId":"conversation-123",
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


**Endpoint : GET /api/message/message:id**


Response Body : 

```json
// Success response
{
    "status":200,
    "data":{
            "message":"hii!!",
            "type":"text",
            "role":"bot",
            "conversationId":"bot-123",
    }
}
```
```json
// Error response
{
    "status":400,
    "error":"MessageId is Invalid",
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


## Update Message
**Endpoint : Patch /api/message/message:id**

Request Body :

```json
{
        "message":"hii!! updated", //Optional
        "type":"text updated", //Optional
        "role":"bot updated", //Optional
}
```




Response Body : 

```json
// Success response
{
    "status":200,
    "message":"Message updated successufully!!",
    "data":{
            "message":"hii!! updated",
            "type":"text updated",
            "role":"bot updated",
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
    "error":"MessageId is Invalid",
}
```
```json
// Error response
{
    "status":400,
    "error":"Validation Error",
}
```


## Delete Message
**Endpoint : DELETE /api/message/message:id**



Response Body : 

```json
// Success response
{
    "status":200,
    "message":"Message deleted Successfuly",
}
```
```json
// Error response
{
    "status":4010,
    "error":"MessageId is Invalid",
}
```
```json
// Error response
{
    "status":401,
    "error":"Unathorized",
}
```


