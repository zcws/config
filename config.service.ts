import { Injectable } from "@nestjs/common";
import { NacosService } from "./nacos.service";

@Injectable()
export class ConfigService {
  constructor(private readonly nacos: NacosService) {
  }

  async get<T>(key?: string): Promise<T> {
    return this.nacos.get<T>(key);
  }
}
