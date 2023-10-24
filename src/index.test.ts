import app, { Bindings } from "."

describe("test", () => {
  let bindings: Bindings
  let mockAgent: ReturnType<typeof getMiniflareFetchMock>
  let ctx: ExecutionContext;

  beforeEach(() => {
    bindings = getMiniflareBindings<Bindings>()
    ctx = new ExecutionContext();

    bindings.SELF_SERVICE = {
      fetch: (...args: ConstructorParameters<typeof Request>) => app.fetch(new Request(...args), bindings, ctx),
    } as ServiceWorkerGlobalScope // fetch しか使ってないという前提

    mockAgent = getMiniflareFetchMock()
    mockAgent.disableNetConnect()
  })

  it("should return Hello Hono!", async () => {
    const origin = mockAgent.get("https://example.com")
    origin.intercept({ path: "/" }).reply(200, "Hello Hono!")

    const req = new Request("http://localhost")
    const res = await app.fetch(req, bindings)

    expect(res.status).toBe(200)
    expect(await res.text()).toBe("Hello Hono!")
  })
})