# Prompt API Documentation

make sure add {credential: include} when call the api.

## Add Prompt
**Endpoint : POST /api/prompt**


Request Body :

```json
{
    "name":"CS Toko prompt",
    "prompt":"Ai assitent expresivve",
    "llm":"chatgpt 4.0",
    "userId":"awkokwokw",
}
```


| Field  | Example Value                        | Description                                  | Fill |
|--------|--------------------------------------|----------------------------------------------|------|
| name   | `Any`                                | Custom name (free text)                       | required|
| prompt | `Any`                                | Custom Prompt (free text)               | required |
| llm    | `openAi`,  `gemini`, `groq`, etc. | Large Language Model option                  | required | 
| userId    | `aidj983j93jd0ojdnvjk8` | UserId  |  required |




Response Body : 

```json
// Success response
{
    "status":200,
    "message":"Prompt created succesfully!!",
    "data":{
        "name":"CS Toko Online",
        "llm":"openAi",
        "prompt":"Answer customer with expresive",
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


## Get ALL Prompt
**Endpoint : GET /api/prompt?page=&limit=&userId**

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
            "name":"CS Toko prompt",
            "llm":"openAi",
            "prompt":"Answer customer with expresive",
        },
        {
            "name":"CS sekolahan prompt",
            "llm":"openAi",
            "prompt":"Answer customer with expresive",
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


**Endpoint : GET /api/prompt/prompt:id**


Response Body : 

```json
// Success response
{
    "status":200,
    "data":{
        "name":"CS Toko prompt",
        "llm":"openAi",
        "prompt":"Answer customer with expresive",
    }
}
```
```json
// Error response
{
    "status":400,
    "error":"PromptId is Invalid",
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


## Update Prompt
**Endpoint : Patch /api/prompt/prompt:id**

Request Body :

```json
{
    "name":"CS Toko Online", //Optional
    "llm":"openAi",  //Optional
    "prompt":"Answer customer with expresive",  //Optional
}
```


Response Body : 

```json
// Success response
{
    "status":200,
    "message":"Prompt updated successufully!!",
    "data":{
        "name":"CS Toko Prompt",
        "llm":"openAi",
        "prompt":"Answer customer with expresive",
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
    "error":"PromptId is Invalid",
}
```
```json
// Error response
{
    "status":400,
    "error":"Validation Error",
}
```


## Delete Prompt
**Endpoint : DELETE /api/prompt/prompt:id**



Response Body : 

```json
// Success response
{
    "status":200,
    "message":"Prompt deleted Successfuly",
}
```
```json
// Error response
{
    "status":4010,
    "error":"PromptId is Invalid",
}
```
```json
// Error response
{
    "status":401,
    "error":"Unathorized",
}
```


