# Bot API Documentation

make sure add {credential: include} when call the api.


## Add BOT
**Endpoint : POST /api/bot**



Request Body :

```json
{
    "bot_name":"CS Toko Online",
    "llm":"openAi",
    "model":"Gpt4.0",
    "promptId":"prompt-123",
    "type":"whatsapp", 
}
```

| Field    | Example Value                        | Description                                  | Fill      |
|----------|----------------------------------------|----------------------------------------------|-----------|
| type     | `whatsapp`, `telegram`, `website`      | The channel/platform type                    | required  |
| name     | `Any`                                  | Custom name (free text)                      | required  |
| promptId | `prompt-123`                           | Data from model Prompt                       | required  |
| model    | `llama 3`, `gpt 4.0`, etc.             | You can get model list at /api/llm           | required  |
| llm      | `openAi`, `groq`, `Gemini`, etc.       | Large Language Model option                  | required  |





Request Header : 

```http
api-key: SecretKey,
authorization: AccessToken,

```



Response Body : 

```json
// Success response
data:{
    "status":200,
    "message":"Bot created succesfully!!",
    "bot":{
        "bot_name":"CS Toko Online",
        "llm":"openAi",
        "model":"Gpt4.0",
        "promptId":"prompt-123",
        "type":"whatsapp", 
    },
}
```

```json
// Error response
data:{
    "status":400,
    "message":"Validation Error",
}
```

```json
// Error response
data:{
    "status":401,
    "error":"Unathorized",
}
```

---


## Get ALL BOT
**Endpoint : GET /api/bot**


Response Body : 

```json
// Success response
data:{
    "status":200,
    "bot":[
        {
            "bot_name":"CS Toko Online",
            "llm":"openAi",
            "model":"Gpt4.0",
            "promptId":"prompt-123",
            "type":"whatsapp", 
        },
        {
            "bot_name":"CS Toko Online",
            "llm":"openAi",
            "model":"Gpt4.0",
            "promptId":"prompt-123",
            "type":"whatsapp", 
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
data:{
    "status":401,
    "error":"Unauthorized",
}
```

**Endpoint : GET /api/bot/bot:id**


Response Body : 

```json
// Success response
data:{
    "status":200,
    "bot":{
            "bot_name":"CS Toko Online",
            "llm":"openAi",
            "model":"Gpt4.0",
            "promptId":"prompt-123",
            "type":"whatsapp", 
    }
}
```

```json
// Error response (Not Found)
data:{
    "status":404,
    "error":"Room Bot is Not found",
}
```


---


## Update BOT
**Endpoint : Patch /api/bot/bot:id**

Request Body :

```json
{
    "name":"CS Toko Online", //Optional
    "llm":"openAi",  //Optional
    "model":"chatgpt 4.0",  //Optional
    "promptId":"prompt-123",  //Optional
}
```



Response Body : 

```json
// Success response
data:{
    "status":200,
    "message":"Bot updated successufully!!",
    "bot":{
        "name":"CS Toko Online",
        "llm":"openAi",
        "promptId":"prompt-123",
        "type":"whatsapp", 
    },
}
```
```json
// Error response
data:{
    "status":401,
    "error":"Unathorized",
}
```
```json
// Error response
data:{
    "status":400,
    "message":"Validation Error",
}
```


## Delete BOT
**Endpoint : DELETE /api/bot/bot:id**


Response Body : 

```json
// Success response
data:{
    "status":200,
    "message":true,
}
```
```json
// Error response
data:{
    "status":401,
    "error":"Unathorized",
}
```

