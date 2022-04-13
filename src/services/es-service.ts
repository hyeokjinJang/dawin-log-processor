import { ConfigManager } from "@dawinproperty/dawin-configuration";
import { Client } from "@elastic/elasticsearch";
import { Service, Container } from "typedi";

/**
 * log pre-processor에서 cloud watch에서 들어온 data를 elastic search로 저장
 */
export class ESService {
  private esConfig: any;
  private cm: any;
  private esClient: Client | any;

  constructor() {
    this.cm = Container.get(ConfigManager);
  }

  public async getEsClient() {
    const config = await this.cm.getConfig(
      "PRE-PROCESSOR-SERVICE",
      "TEST",
      "MAIN-DB"
    );

    this.esConfig = config?.contents?.es;

    console.log("[esconfig]", config?.contents);

    const client = new Client({
      node: this.esConfig.endpoint,
      requestTimeout: 60000,
      auth: {
        username: this.esConfig.username,
        password: this.esConfig.password,
      },
    });

    await client.index({
      index: "dawin-log-prod",
      body: {
        test: "test..",
      },
    });

    this.esClient = client;
    return client;
  }

  public async getIndex() {}
}
