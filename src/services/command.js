const express = require("express");
const OcAuth = require("oc_app-auth");

const Command = {
  createCommands(app, api) {
    const apis = {
      "health": {
        method: "get",
        fn: async () => {
          return {
            version: process.env.npm_package_version,
          };
        }
      },
      ...api,
    }

    app.use(express.json());

    for (let uc in apis) {
      const { method, fn, auth } = apis[uc];
      // const reqId = Tools.generateId();

      const call = async (req, res, next) => {
        let dtoIn = req.query;
        if (req.body && req.is("application/json")) dtoIn = { ...dtoIn, ...req.body };

        try {
          // console.info(`{${reqId}}[${new Date().toISOString()}](${method}) /${uc} start`, dtoIn);
          const dtoOut = await fn({ dtoIn, req, res, method, useCase: uc, next });
          // console.info(`{${reqId}}[${new Date().toISOString()}](${method}) /${uc} end`, dtoOut);

          if (dtoOut !== false) res.json(dtoOut == null ? {} : dtoOut);
        } catch (e) {
          console.error(`[${new Date().toISOString()}](${method}) /${uc} Unexpected exception. dtoIn = `, dtoIn, e);
          res.status(500).send({ message: "Unexpected exception", error: e });
        }
      };

      const calls = [call];
      if (auth) calls.unshift(OcAuth.authentication);

      app[method]("/" + uc, ...calls);
    }
  }
}

module.exports = Command;