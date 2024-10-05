import { Injectable } from '@nestjs/common';


@Injectable()
export class AppService {
  
  async appInfo() {
    return {
      name: process.env.npm_package_name,
      version: process.env.npm_package_version,
    };
  }

}
