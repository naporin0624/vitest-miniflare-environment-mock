import app, { Bindings } from "."

describe("test", () => {
  let bindings: Bindings
  let mockAgent: ReturnType<typeof getMiniflareFetchMock>

  beforeEach(() => {
    bindings = getMiniflareBindings<Bindings>()
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