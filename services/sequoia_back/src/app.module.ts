import { join } from 'node:path'

import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core'

import { AuthModule } from './auth/auth.module'
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter'
import { ResponseInterceptor } from './common/interceptors/response.interceptor'
import { CoursesModule } from './courses/courses.module'
import { EnrollmentsModule } from './courses/enrollments/enrollments.module'
import { MongoModule } from './database/mongo.module'
import { PostgresModule } from './database/postgres.module'
import { UploadsModule } from './uploads/uploads.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        join(process.cwd(), '../../.env'),
        join(__dirname, '../../../.env'),
      ],
    }),
    PostgresModule,
    MongoModule,
    AuthModule,
    CoursesModule,
    EnrollmentsModule,
    UploadsModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
