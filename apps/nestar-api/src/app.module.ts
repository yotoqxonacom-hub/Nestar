import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver } from "@nestjs/apollo";
import { AppResolver } from './app.resolver';
import { ComponentsModule } from './components/components.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [ConfigModule.forRoot(),
  GraphQLModule.forRoot({
    driver: ApolloDriver,
    playground: true,
    uploads: false,
    autoSchemaFile: true,

    formatError: (error: any) => {
      console.log('error:', error);


      const res = error?.extensions?.originalError || error?.extensions?.response;
      const rawMsg = res?.message || error?.message;

      const graphQLFormattedError = {
        message: Array.isArray(rawMsg) ? rawMsg.join('; ') : rawMsg,
        extensions: {
          code: error?.extensions?.code || 'BAD_REQUEST',
        },
      };

      console.log('GRAPHQL GLOBAL ERR:', graphQLFormattedError);
      return graphQLFormattedError;
    },


  }),
    ComponentsModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppResolver],
})
export class AppModule { }
