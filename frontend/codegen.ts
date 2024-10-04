import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: '../backend/src/schema.gql',
  documents: './src/query/*.graphql',
  generates: {
    'src/gql/components.ts': {
      plugins: ['typescript', 'typescript-operations', 'typescript-graphql-request']
    },
  },
  config: {
    namingConvention: {
      enumValues: 'change-case-all#upperCase',
    },
  },
};

export default config;
