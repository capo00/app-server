const Config = require("../config/config");
const Identity = require("./identity");

// inspired by https://permify.co/post/oauth-20-implementation-nodejs-expressjs/
const Authentication = {
  API: {
    "login": {
      method: "get",
      fn: async ({ res, req }) => {
        const state = "state"; // INFO: some state https://permify.co/post/oauth-20-implementation-nodejs-expressjs/
        const scopes = Config.google.oAuthScopes.join(" ");
        const callbackUri = req.protocol + "%3A//" + req.headers.host + "/" + Config.google.callbackUc;
        const GOOGLE_OAUTH_CONSENT_SCREEN_URL = `${Config.google.oAuthUri}?client_id=${Config.google.clientId}&redirect_uri=${callbackUri}&access_type=offline&response_type=code&state=${state}&scope=${scopes}`;
        res.redirect(GOOGLE_OAUTH_CONSENT_SCREEN_URL);
        return false;
      },
    },
    [Config.google.callbackUc]: {
      method: "get",
      fn: async ({ dtoIn, req }) => {
        const { code } = dtoIn;
        const callbackUri = req.protocol + "://" + req.headers.host + "/" + Config.google.callbackUc;

        const tokenDtoIn = {
          code,
          client_id: Config.google.clientId,
          client_secret: Config.google.clientSecret,
          redirect_uri: callbackUri,
          grant_type: "authorization_code",
        };

        // exchange authorization code for access token & id_token
        const tokenRes = await fetch(Config.google.accessTokenUri, {
          method: "POST",
          body: JSON.stringify(tokenDtoIn),
        });

        const tokenDtoOut = await tokenRes.json();

        const { id_token } = tokenDtoOut;

        // verify and extract the information in the id token
        const tokenInfoRes = await fetch(
          `${Config.google.tokenInfoUri}?id_token=${id_token}`
        );

        const tokenInfoDtoOut = await tokenInfoRes.json();

        const { email, name } = tokenInfoDtoOut;
        let identity = await Identity.findOne({ email });
        if (!identity) {
          const cts = new Date().toISOString();

          identity = await Identity.create({
            id: Identity.generateId(email, cts),
            email,
            name,
            registrationType: "google",
            sys: { cts },
          });
        }
        const token = identity.generateToken();

        return { identity, token };
      },
    },
  },
};

module.exports = Authentication;