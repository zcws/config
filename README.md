## 简介

  nacos中获取配置文件，并支持动态更新同步。

## 安装

```
yarn add @zcws/config
```

## 使用
```
// user.module.ts
import { Module } from "@nestjs/common";
import { ConfigModule } from "@zssc/config";

@Module({
  imports: [
    ConfigModule.forRoot('dataId','group')
  ],
  controllers: [UserController]
})
export class UserModule {

}


// user.service.ts
import { ConfigService } from "@zcws/config";

@Controller("users")
export class UserController {
  constructor(private readonly config: ConfigService) {
  }

  @Get()
 async getNmae(){
   const name = await this.config.get('name');
   return name;
  }
}
```
