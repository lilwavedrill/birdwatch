import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { BirdsModule } from './birds/birds.module';
import { SpeciesModule } from './species/species.module';
import { HabitatsModule } from './habitats/habitats.module';
import { ObservationsModule } from './observations/observations.module';
import { LogsModule } from './logs/logs.module';
import { FavoritesModule } from './favorites/favorites.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS || 'postgres',
      database: process.env.DB_NAME || 'bird_app',
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    BirdsModule,
    SpeciesModule,
    HabitatsModule,
    ObservationsModule,
    LogsModule,
    FavoritesModule,
  ],
})
export class AppModule {}
