/*
 * Copyright 2025 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// knexfile.ts
// import type { Knex } from 'knex';
// import path from 'path';
// import { fileURLToPath } from 'url';

// // Define __dirname manually (ES module workaround)
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const config: { [key: string]: Knex.Config } = {
//   development: {
//     client: 'pg',
//     connection: {
//       host: 'localhost',
//       user: 'postgres',
//       password: 'sruthi',
//       database: 'backstage_plugin_jira-project',
//     },
//     migrations: {
//       directory: path.resolve(__dirname, 'plugins/jira-project-backend/src/database/migrations'),
//       extension: 'ts',
//     },
//   },
// };

// export default config;

import type { Knex } from 'knex';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'pg',
    connection: {
      host: 'localhost',
      user: 'postgres',
      password: 'sruthi',
      database: 'backstage_plugin_jira-project', // underscore version
    },
    migrations: {
      directory: path.resolve(__dirname, 'src/database/migrations'),
      extension: 'ts',
    },
  },
};

export default config;
