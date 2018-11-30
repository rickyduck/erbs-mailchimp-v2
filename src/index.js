import http from "http";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import initializeDb from "./db";
import middleware from "./middleware";
import api from "./api";
import config from "./config.json";
import request from "request";
let app = express();
app.server = http.createServer(app);

// logger
app.use(morgan("dev"));

// 3rd party middleware
app.use(
  cors({
    exposedHeaders: config.corsHeaders
  })
);

app.use(
  bodyParser.json({
    limit: config.bodyLimit
  })
);

const getResponse = url => {
  return new Promise((resolve, reject) => {
    request.get(
      {
        uri: url,
        headers: {
          Accept: "application/json",
          Authorization: `Basic c7ba19913abe52e33f2a9c4c993d8e2c-us19`
        },
        json: true
      },
      (err, response, body) => {
        if (err) {
          reject(err);
        } else {
          //console.log(response);
          resolve(body);
        }
      }
    );
  });
};

// connect to db
initializeDb(db => {
  // internal middleware
  app.use(middleware({ config, db }));
  const listId = "3df5ec3a79";
  const url = `https://us19.api.mailchimp.com/3.0/lists/${listId}`;
  app.get("/api/v1/public/list", async function(req, res) {
    try {
      const { total_items } = await getResponse(`${url}/members`);
      //const fullUrl = `${url}?count=${total_items}`;
      const fullUrl = `${url}/members?count=10`;
      const list = await getResponse(fullUrl);
      res.json(list);
      console.log(`Length: ${list.length}`);
    } catch (err) {
      res.json({ error: err.message || err.toString() });
    }
  });
  app.get("/api/v1/public/list/merge-fields", async function(req, res) {
    try {
      //const fullUrl = `${url}?getResponsecount=${total_items}`;
      const fullUrl = `${url}/merge-fields?count=100`;
      const list = await getResponse(fullUrl);
      res.json(list);
      console.log(`Length: ${list.length}`);
    } catch (err) {
      res.json({ error: err.message || err.toString() });
    }
  });
  // api router
  app.use("/api", api({ config, db }));

  app.server.listen(process.env.PORT || config.port, () => {
    console.log(`Started on port ${app.server.address().port}`);
  });
});

export default app;
