import * as path from 'path';
import * as lodash from 'lodash';
import { Module } from '@nestjs/common';
import { ConfigCoreModule } from './config.core.module';
import { ConfigService } from './config.service';

const ENV = process.env.NODE_ENV;
const rootPath = path.join(__dirname, '../../');
const defaultPath = 'config/**/!(*.d).{ts,js}';
const configOptions = {
  path: path.resolve(process.cwd(), 'env', !ENV ? '.env' : `.env.${ENV}`),
  modifyConfigName: name => name.replace('.config', ''),
};
const ConfigureModule = ConfigCoreModule.resolveRootPath(rootPath).load(
  defaultPath,
  configOptions,
  (configService: ConfigService) => {
    const globalConfig = configService.get('global') || {};
    for (const key in globalConfig) {
      const item = globalConfig[key];
      if (lodash.isFunction(item)) {
        configService.registerHelper(key, item);
      } else {
        configService.set(key, item);
      }
    }
    configService.set('env', ENV || 'local');
    configService.registerHelper('isProd', () =>
      ['prod', 'production'].includes(ENV),
    );
  },
);

@Module({
  imports: [ConfigureModule],
})
export class ConfigModule {}
