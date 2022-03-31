import { DynamicModule, Module } from "@nestjs/common";
import { ConfigService } from "./config.service";
import { NacosService } from "./nacos.service";

@Module({})
export class ConfigModule {
  static forRoot(dataId: string, group = "DEFAULT_GROUP", global = true): DynamicModule {
    return {
      global,
      module: ConfigModule,
      providers: [
        {
          provide: NacosService,
          useFactory() {
            return new NacosService(dataId, group);
          }
        },
        ConfigService
      ],
      exports: [ConfigService]
    };
  }
}
