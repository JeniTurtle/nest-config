<h1 align="center">Nestjs Config</h1>

<p align="center">Configuration component for NestJs.</p>

## Features

- Automatically load all configuration files of src/config directory.
- Automatically read all environment variables of env/ directory.
- Change and Load configuration at runtime

### Installation

**Yarn**
```bash
yarn add @jiaxinjiang/nest-config
```

**NPM**
```bash
npm install @jiaxinjiang/nest-config --save
```

### Getting Started

Let's imagine that we have a folder called src/config in our project that contains several configuration files.

```bash
/src
├── app.module.ts
├── env
│   ├── env
│   ├── env.dev
│   ├── env.prod
│   ├── env.test
├── config
│   ├── logger.config.ts
│   ├── database.config.ts
│   ├── global.config.ts
│   ├── rabbitmq.ts
│   └── redis.config.ts
```

Some file examples.

```bash
// env.dev

NEST_APPLICATION_PORT=3000

NEST_DATABASE_HOST=192.168.0.123

NEST_DATABASE_PORT=5432
```

```ts
// database.config.ts

const { NEST_DATABASE_HOST, NEST_DATABASE_PORT } = process.env;

export default {
  database1: {
    name: 'database1',
    type: 'postgres',
    host: NEST_DATABASE_HOST,
    port: NEST_DATABASE_PORT,
    username: 'postgres',
    password: '123456',
    database: 'database_name',
    migrationsRun: false,
    synchronize: false,
    logging: 'all',
    maxQueryExecutionTime: 1500, // 慢查询记录
    entityPrefix: '',
    extra: {
      connectionLimit: 10,
    },
  },
};
```

Let's register the config module in app.module.ts


```ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@jiaxinjiang/nest-config';

@Module({
    imports: [
        ConfigModule,
    ],
})
export class AppModule {}
```

Now we are ready to inject our ConfigService anywhere we'd like.

```ts
import { ConfigService } from '@jiaxinjiang/nest-config';

@Injectable()
class SomeService {
    private databaseConfig;
    private rabbitmqConfig;
    constructor(private readonly config: ConfigService) {
        this.databaseConfig = config.get('database'); // src/config/database.config.ts
        this.rabbitmqConfig = config.get('rabbitmq'); // src/config/rabbitmq.ts
    }
    
    get databaseHost() {
        return this.databaseConfig.host;
    }
}
```

You may also use the `@InjectConfig` decorator as following:

```ts
import { InjectConfig, ConfigService } from '@jiaxinjiang/nest-config';

@Injectable()
class SomeService {
    constructor(@InjectConfig() private readonly config: ConfigService) {}
}
```

### Environment Configuration