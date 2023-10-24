import app, { Bindings } from ".";
import gateway from "../gateway/src";

describe("gateway service bindings", () => {
  let bindings: Bindings;
  let mockAgent: ReturnType<typeof getMiniflareFetchMock>;
  let ctx: ExecutionContext;

  beforeEach(() => {
    bindings = getMiniflareBindings<Bindings>();
    ctx = new ExecutionContext();

    bindings.GATEWAY = {
      fetch: (...args: ConstructorParameters<typeof Request>) => {
        return gateway.fetch(new Request(...args), bindings, ctx);
      },
    } as Fetcher; // fetch しか使ってないという前提

    mockAgent = getMiniflareFetchMock();
    mockAgent.disableNetConnect();
  });

  it("/gateway", async () => {
    const req = new Request("http://localhost/gateway");
    const res = await app.fetch(req, bindings);

    expect(res.status).toBe(200);
    await expect(res.text()).resolves.toBe("Hello External Hono!");
  });
});
