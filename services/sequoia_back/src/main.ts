import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import type { NestExpressApplication } from '@nestjs/platform-express'
import cookieParser from 'cookie-parser'

import { AppModule } from './app.module'
import { validationExceptionFactory } from './common/validation/validation-exception.factory'
import { getUploadsDir } from './uploads/uploads.config'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  const config = app.get(ConfigService)

  app.setGlobalPrefix('api')
  app.use(cookieParser())
  app.useStaticAssets(getUploadsDir(config), { prefix: '/uploads/' })
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
      exceptionFactory: validationExceptionFactory,
    }),
  )

  const corsOrigins = config.get<string>('CORS_ORIGINS')

  if (!corsOrigins && config.get<string>('NODE_ENV') === 'production') {
    throw new Error('CORS_ORIGINS must be set in production')
  }

  app.enableCors({
    origin: corsOrigins
      ? corsOrigins
          .split(',')
          .map((origin) => origin.trim())
          .filter(Boolean)
      : true,
    credentials: true,
  })

  if (config.get<string>('TRUST_PROXY', 'false') === 'true') {
    app.getHttpAdapter().getInstance().set('trust proxy', 1)
  }

  app.enableShutdownHooks()

  const port = Number(config.get<string>('PORT', '3000'))
  await app.listen(port)
  console.log(`Sequoia API listening on :${port}`)
}

void bootstrap()
