import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { DirectiveLocation, GraphQLDirective } from 'graphql';
import { upperDirectiveTransformer } from '../common/directives/upper-case.directive';

export const GraphQLConfig: ApolloDriverConfig = {
  driver: ApolloDriver,
  autoSchemaFile: 'src/schema.gql',
  transformSchema: (schema) => upperDirectiveTransformer(schema, 'upper'),
  installSubscriptionHandlers: true,
  playground: {
    settings: {
      'editor.theme': 'light',
      'request.credentials': 'include',
    },
  },
  context: ({ req, res }) => ({ req, res }),
  buildSchemaOptions: {
    directives: [
      new GraphQLDirective({
        name: 'upper',
        locations: [DirectiveLocation.FIELD_DEFINITION],
      }),
    ],
  },
};
