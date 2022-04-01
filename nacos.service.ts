import { Injectable } from "@nestjs/common";
import { NacosConfigClient } from "nacos";
import { getLogger } from "log4js";
import { parse } from "yaml";
import * as Events from "events";


@Injectable()
export class NacosService extends Events.EventEmitter {
  #config;
  #env = process.env;
  #isReady = false;
  #client: NacosConfigClient;
  #logger = getLogger("Nacos");

  constructor(private readonly dataId: string, private readonly group: string) {
    super();
    const config = {
      accessKey: this.#env.accessKey,
      secretKey: this.#env.secretKey,
      namespace: this.#env.namespace,
      serverAddr: this.#env.serverAddr
    };

    this.#client = new NacosConfigClient(config);
    // 加载配置文件
    this.loadConfig().catch(err => this.#logger.error(err));
  }

  async get<T>(key: string): Promise<T> {
    if (this.#isReady) {
      return this.getConfig<T>(key);
    } else {
      return new Promise((resolve, reject) => {
        this.once("ready", () => {
          try {
            const conf = this.getConfig<T>(key);
            resolve(conf);
          } catch (e) {
            reject(e);
          }
        });
      });
    }
  }

  private getConfig<T>(key: string): T {
    if (this.#config && this.#config[key]) {
      return this.#config[key];
    }

    throw new Error("获取参数失败");
  }

  /**
   * 加载配置文件
   * */
  private async loadConfig() {
    const { dataId, group } = this;
    const content = await this.#client.getConfig(dataId, group);
    this.setConfig(content);
    this.#client.subscribe({ dataId, group }, content => this.setConfig(content));
    this.#isReady = true;
    this.emit("ready");
  }

  private setConfig(content: string) {
    this.#config = parse(content);
    this.#logger.debug("加载配置", content);
  }
}
