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
import type { Knex } from 'knex';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
// eslint-disable-next-line no-restricted-syntax
const __dirname = path.dirname(__filename);

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'pg',
    connection: {
      host: '127.0.0.1',      // Your PostgreSQL host
      port: 5432,             // Default PostgreSQL port
      user: 'postgres',       // Your PostgreSQL username
      password: '123',        // Your PostgreSQL password
      database: 'backstage_plugin_mern', // Same DB for issues + projects
    },
    migrations: {
      // eslint-disable-next-line no-restricted-syntax
      directory: path.resolve(__dirname, 'src/database/migrations'),
      extension: 'ts',
    },
  },
};

export default config;
