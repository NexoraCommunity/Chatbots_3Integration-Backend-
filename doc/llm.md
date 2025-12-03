# Prompt API Documentation

make sure add {credential: include} when call the api.

## Get ALL LLM
**Endpoint : GET /api/llm**

Response Body : 

```json
// Success response
{
    "status":200,
    "data":{
      "openAi":[
          "gpt 3",
          "gpt 3",
          "gpt 3",
          "gpt 3",
          "gpt 3",
          "gpt 3",
          "gpt 3",
       ],
       "groq":[
          "llama 3",
          "llama 3",
          "llama 3",
          "llama 3",
          "llama 3",
          "llama 3",
          "llama 3",
       ],
       "gemini":[
          "gemini 3",
          "gemini 3",
          "gemini 3",
          "gemini 3",
          "gemini 3",
          "gemini 3",
          "gemini 3",
       ],
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
