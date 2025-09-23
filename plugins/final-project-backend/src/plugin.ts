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
// src/plugin.ts
// src/plugin.ts
import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { createRouter } from './router';
import { createTodoListService } from './services/TodoListService/TodoListService';

export const finalProjectPlugin = createBackendPlugin({
  pluginId: 'final-project',
  register(env) {
    env.registerInit({
      deps: {
        logger: coreServices.logger,
        database: coreServices.database, // ✅ proper token
        httpRouter: coreServices.httpRouter,
      },
      async init({ logger, database, httpRouter }) {
        // ✅ await the Knex client!
        const knexClient = await database.getClient();

        const todoListService = await createTodoListService({
          logger,
          database: knexClient, // ✅ now it's a real Knex instance
        });

        httpRouter.use(
          await createRouter({
            logger,
            todoListService,
          }),
        );
      },
    });
  },
});
