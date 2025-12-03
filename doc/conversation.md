# Conversation API Documentation

make sure add {credential: include} when call the api.

## Add Conversation
**Endpoint : POST /api/conversation**


Request Body :

```json
{
    "room":"client1-123 + client2-123",
    "integrationType":"whatsapp",
    "botId":"bot-123",
}
```


| Field           | Example Value                          | Description        | Fill       |
|-----------------|------------------------------------------|---------------------|------------|
| room            | `client1-123 + client2-123`              | ruang sesi          | required   |
| integrationType | `whatsapp`, `telegram`, `website`, etc.  | jenis integrasi     | required   |
| userId          | `aidj983j93jd0ojdnvjk8`                  | identitas user      | required   |




Response Body : 

```json
// Success response
{
    "status":200,
    "message":"Conversation created succesfully!!",
    "data":{
        "room":"client1-123 + client2-123",
        "integrationType":"whatsapp",
        "botId":"bot-123",
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


## Get ALL Conversation
**Endpoint : GET /api/conversation?page=&limit=&userId=&botId=**

Request Query : 

```http
page (required): ini misal seperti halaman berapa?,
limit (required): dihalaman itu ada brp data?,
botId (optional): id bot,
userId (optional): id user,
```

Response Body : 

```json
// Success response
{
    "status":200,
    "data":[
        {
            "room":"client1-123 + client2-123",
            "integrationType":"whatsapp",
            "botId":"bot-123",
        },
        {
            "room":"client3-123 + client4-123",
            "integrationType":"whatsapp",
            "botId":"bot-123",
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


**Endpoint : GET /api/conversation/conversation:id**


Response Body : 

```json
// Success response
{
    "status":200,
    "data":{
            "room":"client3-123 + client4-123",
            "integrationType":"whatsapp",
            "botId":"bot-123",
    }
}
```
```json
// Error response
{
    "status":400,
    "error":"ConversationId is Invalid",
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


## Update Conversation
**Endpoint : Patch /api/conversation/conversation:id**

Request Body :

```json
{
    "room":"client3-123 + client4-123 updated", //Optional
    "integrationType":"whatsapp updated", //Optional
    "botId":"bot-123 updated", //Optional
}
```


Response Body : 

```json
// Success response
{
    "status":200,
    "message":"Conversation updated successufully!!",
    "data":{
            "room":"client3-123 + client4-123 updated",
            "integrationType":"whatsapp updated",
            "botId":"bot-123 updated",
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
    "error":"ConversationId is Invalid",
}
```
```json
// Error response
{
    "status":400,
    "error":"Validation Error",
}
```


## Delete Conversation
**Endpoint : DELETE /api/conversation/conversation:id**



Response Body : 

```json
// Success response
{
    "status":200,
    "message":"Conversation deleted Successfuly",
}
```
```json
// Error response
{
    "status":4010,
    "error":"ConversationId is Invalid",
}
```
```json
// Error response
{
    "status":401,
    "error":"Unathorized",
}
```


