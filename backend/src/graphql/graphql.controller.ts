import { All, Controller, Req, Res } from '@nestjs/common';
import { ApolloServer } from '@apollo/server';
import {
  executeHTTPGraphQLRequest,
  Raw,
  Request,
  Response,
} from '@node-libraries/nest-apollo-server';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { loadSchemaSync } from '@graphql-tools/load';

const schema = loadSchemaSync('src/schema.gql', {
  loaders: [new GraphQLFileLoader()],
});

const apolloServer = new ApolloServer({
  schema: schema,
});

apolloServer.start();

@Controller('graphql')
export class GraphqlController {
  @All()
  async graphql(@Req() req: Request, @Res() res: Response) {
    await executeHTTPGraphQLRequest({
      req,
      res,
      apolloServer,
      context: async () => ({ req: Raw(req), res: Raw(res) }),
    });
  }
}
