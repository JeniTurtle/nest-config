import { DynamicModule, Module, Global } from '@nestjs/common';
import { ConfigService } from './config.service';
import { ConfigOptions } from './config.interface';

@Global()
@Module({})
export class ConfigCoreModule {
  /**
   * @param startPath
   * @deprecated
   */
  static resolveSrcPath(startPath: string): typeof ConfigCoreModule {
    ConfigService.resolveSrcPath(startPath);
    return this;
  }

  /**
   * @param path
   */
  public static resolveRootPath(path: string): typeof ConfigCoreModule {
    ConfigService.resolveRootPath(path);
    return this;
  }

  /**
   * From Glob
   * @param glob
   * @param {ConfigOptions} options
   * @returns {DynamicModule}
   */
  static load(
    glob: string,
    options?: ConfigOptions,
    initHandle?: (configService: ConfigService) => any,
  ): DynamicModule {
    const configProvider = {
      provide: ConfigService,
      useFactory: async (): Promise<ConfigService> => {
        const provider = await ConfigService.load(glob, options);
        if (initHandle) {
          await initHandle(provider);
        }
        return provider;
      },
    };
    return {
      module: ConfigCoreModule,
      providers: [configProvider],
      exports: [configProvider],
    };
  }
}
