import { ConfigService } from './config.service';

export function applyParamsMetadataDecorator(
  paramsMetadata: any[],
  args: any[],
  fn: (key: string, def?: string) => string,
): any[] {
  if (paramsMetadata.length) {
    for (const param of paramsMetadata) {
      if (Object.keys(param).includes('configKey')) {
        const i = param.parameterIndex;
        if (args[i] instanceof ConfigService || args[i] === ConfigService) {
          args[param.parameterIndex] = args[i].get(
            param.configKey,
            param.fallback,
          );
        } else if (args[i] === undefined) {
          args[param.parameterIndex] = fn(param.configKey, param.fallback);
        }
      }
    }
  }
  return args;
}
