import type { CodegenConfig } from '@graphql-codegen/cli';

const graphQLUrl = 'http://localhost:3000/';

const config: CodegenConfig = {
  // 1. Point to your Backend API as usual
  schema: graphQLUrl + 'graphql',

  // 2. Discover all local .graphql files next to their services!
  documents: 'src/app/**/*.graphql',

  generates: {
    // 3. Generate one core file for shared Types & Enums (schema level)
    'src/app/core/graphql/schema.generated.ts': {
      plugins: ['typescript'],
    },

    // 4. Generate decentralized .generated.ts files NEAR their .graphql files!
    'src/': {
      preset: 'near-operation-file',
      presetConfig: {
        extension: '.generated.ts',
        baseTypesPath: 'app/core/graphql/schema.generated.ts',
      },
      plugins: ['typescript-operations', 'typescript-apollo-angular'],
      config: {
        // We preserve your strict Apollo GQL service suffixes
        addExplicitOverride: true,
        querySuffix: 'GQL',
        mutationSuffix: 'GQL',
        subscriptionSuffix: 'GQL',
      },
    },
  },
};

export default config;
