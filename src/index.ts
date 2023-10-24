import { Hono } from 'hono'

export type Bindings = {
  SELF_SERVICE: ServiceWorkerGlobalScope
}

export type Variables = {
  //
}

export type HonoEnv = {
  Bindings: Bindings;
  Variables: Variables;
};

const app = new Hono<HonoEnv>()

app.get("/receive", () => {
  return fetch("https://example.com")
})

app.get('/', (c) => {
  const url = new URL("/receive", c.req.url)
  const req = new Request(url.href)

  return c.env.SELF_SERVICE.fetch(req)
})

export default app
