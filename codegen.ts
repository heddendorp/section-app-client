import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: '../server/schema.graphql',
  documents: ['./src/**/*.graphql', '!*schema.graphql'],
  generates: {
    './src/app/generated/generated.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-apollo-angular',
      ],
      config: {
        addExplicitOverride: true,
      },
    },
  },
};
export default config;
