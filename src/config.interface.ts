import { DotenvConfigOptions } from 'dotenv';

export interface ModuleConfig {
  [key: string]: any;
}

export interface Config {
  [key: string]: ModuleConfig;
}

export type CustomHelper = {
  [key: string]: (...args: any[]) => any;
};

export interface ConfigOptions extends Partial<DotenvConfigOptions> {
  modifyConfigName?: (name: string) => string;
  path?: string;
}
