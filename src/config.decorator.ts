import { Inject } from '@nestjs/common';
import { ConfigService } from './config.service';
import { CONFIG_CONFIGURABLE, CONFIG_PARAMS } from './config.constants';
import { applyParamsMetadataDecorator } from './config.helper';

export const InjectConfig = () => Inject(ConfigService);

export const Configurable = (): MethodDecorator => {
  return (
    target: Record<string, any>,
    key: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    const originalMethod = descriptor.value;
    descriptor.value = function(...args: any[]) {
      const paramsMetadata = (
        Reflect.getMetadata(CONFIG_PARAMS, target, key) || []
      ).filter(p => {
        return p.propertyKey === key;
      });
      return originalMethod.apply(
        this,
        applyParamsMetadataDecorator(paramsMetadata, args, ConfigService.get),
      );
    };

    Reflect.defineMetadata(
      CONFIG_CONFIGURABLE,
      Reflect.getMetadata(CONFIG_PARAMS, target, key) || [],
      descriptor.value,
    );
    return descriptor;
  };
};

export const ConfigParam = (
  configKey: string,
  fallback: any | undefined = undefined,
): ParameterDecorator => (target, propertyKey, parameterIndex) => {
  const existingParameters: any[] =
    Reflect.getMetadata(CONFIG_PARAMS, target, propertyKey) || [];
  existingParameters.push({ parameterIndex, propertyKey, configKey, fallback });
  Reflect.defineMetadata(
    CONFIG_PARAMS,
    existingParameters,
    target,
    propertyKey,
  );
  return target;
};

export const ProxyProperty = (propertyName: string) =>
  function classDecorator<T extends { new (...args: any[]): {} }>(
    constructor: T,
  ) {
    const decorated = class A extends constructor {
      constructor(...args: any[]) {
        super(...args);

        return new Proxy(this, {
          get: (target, prop): any => {
            if (target[prop] !== undefined) {
              return target[prop];
            } else if (target[propertyName].hasOwnProperty(prop)) {
              return target[propertyName][prop];
            }
          },
        });
      }
    };

    Object.defineProperty(decorated, 'name', { value: constructor.name });
    return decorated;
  };
