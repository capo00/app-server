# App Server

- based on `express`

## API

### App

#### init({ api = {}, publicPath = "../../../../public" })

| Param        | Desc                                                                                                                                     |
|--------------|------------------------------------------------------------------------------------------------------------------------------------------|
| `api`        | Each api is defined as `useCase` with an object with `method` as String and `fn` as function, which returns object as dtoOut of the api. |    
| `publicPath` | Path is used for static files like assets and for index.html.                                                                            |  

| fn params | Desc                           |
|-----------|--------------------------------|
| `useCase` | Code of the use case.          |
| `method`  | HTTP method - `get` or `post`. |
| `dtoIn`   | Input data to command.         |
| `req`     | Whole object of request.       |
| `res`     | Whole object of response.      |

```
const app = App.init({
    publicPath: path.resolve(__dirname, "public"),
    api: {
        "team/list": {
            method: "get",
            
            // pattern: https://.../<useCase>?<key>=<value>
            // example: https://.../team/list?league=I
            // => useCase = "team/list", method = "get", dtoIn = { league: "I" }
            fn: async ({ useCase, method, dtoIn, req, res }) => {
                // TODO some business logic e.g. loading from db
                return { name: "..." }; // object with some data is returned as dtoOut
            }
        }
    }
});
```

## ENV

- add .env file next to package.json and configure your App:

| Param                   | Desc                                                                                                                           |
|-------------------------|--------------------------------------------------------------------------------------------------------------------------------|
| PORT                    | Port on which the server will run.<br/>Default: 8080                                                                           |
| MONGODB_URI             | Uri of the mongo database. Required for authentication and creating identity.                                                  |
| MONGODB_NAME            | Name of the mongo database. Required for authentication and creating identity.                                                 |
| GOOGLE_CLIENT_ID        | Google client id which is generated in Google Console -> APIs & Services -> Credentials -> OAuth. Required for authentication. |
| GOOGLE_CLIENT_SECRET    | Google secret key is generated with client id. Required for authentication.                                                                                |
| GOOGLE_OAUTH_URL        | Uri for log in the user.<br/>Default: https://accounts.google.com/o/oauth2/v2/auth                                             |
| GOOGLE_ACCESS_TOKEN_URL | Uri for getting access token.<br/>Default: https://oauth2.googleapis.com/token                                                 |
| GOOGLE_TOKEN_INFO_URL   | Uri for getting info about the user.<br/>Default: https://oauth2.googleapis.com/tokeninfo                                      |
| GOOGLE_CALLBACK_UC      | Use case for callback for Google.<br/>Default: google/callback                                                                 |
| JWT_SECRET              | Secret key for App token.<br/>Default: GOOGLE_CLIENT_SECRET                                                                    |
| JWT_LIFETIME            | Time to live for the token.<br/>Default: 1d                                                                                    |