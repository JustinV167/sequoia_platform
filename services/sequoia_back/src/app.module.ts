import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST', 'localhost'),
        port: Number(config.get('DB_PORT', 5432)),
        username: config.get('DB_USER', 'sequoia'),
        password: config.get('DB_PASSWORD', 'sequoia_pass'),
        database: config.get('DB_NAME', 'sequoia'),
        autoLoadEntities: true,
        synchronize: true, // TODO: replace with migrations before production.
      }),
    }),
  ],
})
export class AppModule {}
