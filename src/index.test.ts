import app, { Bindings } from ".";

describe("self service bindings", () => {
  let bindings: Bindings;
  let mockAgent: ReturnType<typeof getMiniflareFetchMock>;
  let ctx: ExecutionContext;

  beforeEach(() => {
    bindings = getMiniflareBindings<Bindings>();
    ctx = new ExecutionContext();

    bindings.SELF_SERVICE = {
      fetch: (...args: ConstructorParameters<typeof Request>) => {
        return app.fetch(new Request(...args), bindings, ctx);
      },
    } as Fetcher;

    mockAgent = getMiniflareFetchMock();
    mockAgent.disableNetConnect();
  });

  it("/", async () => {
    const req = new Request("http://localhost");
    const res = await app.fetch(req, bindings);

    expect(res.status).toBe(200);
    expect(await res.text()).toBe("Hello Hono!");
  });

  it("/external", async () => {
    const example = mockAgent.get("https://example.com");
    example.intercept({ method: "GET", path: "/" }).reply(200, "Hello External Hono!");

    const req = new Request("http://localhost/external");
    const res = await app.fetch(req, bindings);

    expect(res.status).toBe(200);
    await expect(res.text()).resolves.toBe("Hello External Hono!");
  });
});
