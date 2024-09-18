import { readFileSync } from 'fs';
import gql from 'graphql-tag';
import {
  All,
  Controller,
  Req,
  Res,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { ApolloServer } from '@apollo/server';
import { buildSubgraphSchema } from '@apollo/subgraph';
import {
  executeHTTPGraphQLRequest,
  Raw,
  Request,
  Response,
} from '@node-libraries/nest-apollo-server';

export const typeDefs = gql(
  readFileSync('src/schema.gql', {
    encoding: 'utf-8',
  }),
);

@Controller('/graphql')
export class GraphqlController implements OnModuleInit, OnModuleDestroy {
  apolloServer: ApolloServer;
  onModuleInit() {
    console.log('init');
    this.apolloServer = new ApolloServer({
      schema: buildSubgraphSchema({
        typeDefs,
      }),
    });
    return this.apolloServer.start();
  }
  onModuleDestroy() {
    this.apolloServer.stop();
  }
  @All()
  async graphql(@Req() req: Request, @Res() res: Response) {
    await executeHTTPGraphQLRequest({
      req,
      res,
      apolloServer: this.apolloServer,
      context: async () => ({ req: Raw(req), res: Raw(res) }),
      options: {
        //Maximum upload file size set at 10 MB
        maxFileSize: 10 * 1024 * 1024,
      },
    });
  }
}
