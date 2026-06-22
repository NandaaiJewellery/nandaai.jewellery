import { ConfigService } from '@nestjs/config';
import { Sequelize } from 'sequelize-typescript';
import { Like } from '../modules/likes/likes.model';
import { Comment } from '../modules/comments/comments.model';
import { Share } from '../modules/shares/shares.model';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
      const sequelize = new Sequelize({
        dialect: 'postgres',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.name'),
        logging: configService.get<string>('nodeEnv') !== 'production' ? console.log : false,
        pool: {
          max: 10,
          min: 1,
          acquire: 30000,
          idle: 10000,
        },
      });

      sequelize.addModels([Like, Comment, Share]);
      await sequelize.sync({ alter: true });

      return sequelize;
    },
  },
];
