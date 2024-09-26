import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { DirectiveLocation, GraphQLDirective } from 'graphql';
import { upperDirectiveTransformer } from 'src/common/directives/upper-case.directive';

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
  buildSchemaOptions: {
    directives: [
      new GraphQLDirective({
        name: 'upper',
        locations: [DirectiveLocation.FIELD_DEFINITION],
      }),
    ],
  },
};
