import { Hono } from 'hono'

export type Bindings = {
  //
}

export type Variables = {
  //
}

export type HonoEnv = {
  Bindings: Bindings;
  Variables: Variables;
};

const app = new Hono<HonoEnv>()

app.get('/', () => {
  return fetch('https://example.com')
})

export default app
