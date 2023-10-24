import { Hono } from "hono";

export type Bindings = {
  SELF_SERVICE: Fetcher;
  GATEWAY: Fetcher;
};

export type Variables = {
  //
};

export type HonoEnv = {
  Bindings: Bindings;
  Variables: Variables;
};

const app = new Hono<HonoEnv>();

app.get("/receive", (c) => {
  return c.text("Hello Hono!");
});

app.get("/", (c) => {
  const url = new URL("/receive", c.req.url);
  const req = new Request(url.href);

  return c.env.SELF_SERVICE.fetch(req);
});

app.get("/external/receive", (c) => {
  return fetch("https://example.com");
});

app.get("/external", (c) => {
  return c.env.SELF_SERVICE.fetch(new URL("/external/receive", c.req.url).href);
});

app.get("/gateway", (c) => {
  return c.env.GATEWAY.fetch(new URL("/", c.req.url).href);
});

export default app;
