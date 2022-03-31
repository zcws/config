import { assert } from "chai";
import { Test } from "@nestjs/testing";
import { ConfigModule, ConfigService } from "../index";


describe("config", () => {
  let service: ConfigService;
  before(async () => {
    const module = await Test.createTestingModule({
      imports: [ConfigModule.forRoot("node-admin", "NODE")]
    }).compile();

    service = module.get<ConfigService>(ConfigService);
  });
  it("getPort", async () => {
    const port = await service.get("port");
    assert.isNumber(port);
  });
});
