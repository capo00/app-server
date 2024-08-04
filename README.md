# App Server

- based on `express`

## API

### App

#### init({ api = {}, publicPath = "../../../../public" })

| Param        | Desc                                                                                                                                     |
|--------------|------------------------------------------------------------------------------------------------------------------------------------------|
| `api`        | Each api is defined as `useCase` with an object with `method` as String and `fn` as function, which returns object as dtoOut of the api. |    
| `publicPath` | Path is used for static files like assets and for index.html.                                                                            |  

| fn params  | Desc                           |
|------------|--------------------------------|
| `useCase`  | Code of the use case.          |
| `method`   | HTTP method - `get` or `post`. |
| `dtoIn`    | Input data to command.         |
| `request`  | Whole object of request.       |
| `response` | Whole object of response.      |

```
const app = App.init({
    publicPath: path.resolve(__dirname, "public"),
    api: {
        "team/list": {
            method: "get",
            
            // pattern: https://.../<useCase>?<key>=<value>
            // example: https://.../team/list?league=I
            // => useCase = "team/list", method = "get", dtoIn = { league: "I" }
            fn: async ({ useCase, method, dtoIn, request, response }) => {
                // TODO some business logic e.g. loading from db
                return { name: "..." }; // object with some data is returned as dtoOut
            }
        }
    }
});
```