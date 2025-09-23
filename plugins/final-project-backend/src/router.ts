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

// import { HttpAuthService } from '@backstage/backend-plugin-api';
// import { InputError } from '@backstage/errors';
// import { z } from 'zod';
// import express from 'express';
// import Router from 'express-promise-router';
// import { TodoListService } from './services/TodoListService/types';

// export async function createRouter({
//   httpAuth,
//   todoListService,
// }: {
//   httpAuth: HttpAuthService;
//   todoListService: TodoListService;
// }): Promise<express.Router> {
//   const router = Router();
//   router.use(express.json());

//   // TEMPLATE NOTE:
//   // Zod is a powerful library for data validation and recommended in particular
//   // for user-defined schemas. In this case we use it for input validation too.
//   //
//   // If you want to define a schema for your API we recommend using Backstage's
//   // OpenAPI tooling: https://backstage.io/docs/next/openapi/01-getting-started
//   const todoSchema = z.object({
//     title: z.string(),
//     entityRef: z.string().optional(),
//   });

//   router.post('/todos', async (req, res) => {
//     const parsed = todoSchema.safeParse(req.body);
//     if (!parsed.success) {
//       throw new InputError(parsed.error.toString());
//     }

//     const result = await todoListService.createTodo(parsed.data, {
//       credentials: await httpAuth.credentials(req, { allow: ['user'] }),
//     });

//     res.status(201).json(result);
//   });

//   router.get('/todos', async (_req, res) => {
//     res.json(await todoListService.listTodos());
//   });

//   router.get('/todos/:id', async (req, res) => {
//     res.json(await todoListService.getTodo({ id: req.params.id }));
//   });

//   return router;
// }

// src/router.ts
// src/router.ts
import express from 'express';
import { LoggerService } from '@backstage/backend-plugin-api';
import { TodoListService } from './services/TodoListService/TodoListService';

interface RouterOptions {
  logger: LoggerService;
  todoListService: TodoListService;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger, todoListService } = options;
  const router = express.Router();

  router.use(express.json());

  /** ---------- Projects ---------- */
  router.get('/projects', async (_, res) => {
    try {
      const projects = await todoListService.listProjects();
      res.status(200).json(projects);
    } catch (e) {
      logger.error(`Error fetching projects: ${e}`);
      res.status(500).json({ error: 'Failed to fetch projects' });
    }
  });

  router.post('/projects', async (req, res) => {
    try {
      const project = await todoListService.createProject(req.body);
      res.status(201).json(project);
    } catch (e) {
      logger.error(`Error creating project: ${e}`);
      res.status(500).json({ error: 'Failed to create project' });
    }
  });

  /** ---------- Templates ---------- */
  router.get('/templates', async (_, res) => {
    try {
      const templates = await todoListService.listTemplates();
      res.status(200).json(templates);
    } catch (e) {
      logger.error(`Error fetching templates: ${e}`);
      res.status(500).json({ error: 'Failed to fetch templates' });
    }
  });

  /** ---------- Reports ---------- */
  router.get('/reports/projects/:id/summary', async (req, res) => {
    try {
      const projectId = Number(req.params.id);
      const summary = await todoListService.getProjectSummary(projectId);
      res.status(200).json(summary);
    } catch (e) {
      logger.error(`Error fetching project summary: ${e}`);
      res.status(500).json({ error: 'Failed to fetch project summary' });
    }
  });

  /** ---------- Boards ---------- */
  router.get('/boards', async (_, res) => {
    try {
      const boards = await todoListService.listBoards();
      res.status(200).json(boards);
    } catch (e) {
      logger.error(`Error fetching boards: ${e}`);
      res.status(500).json({ error: 'Failed to fetch boards' });
    }
  });

  router.post('/boards', async (req, res) => {
    try {
      const board = await todoListService.createBoard(req.body);
      res.status(201).json(board);
    } catch (e) {
      logger.error(`Error creating board: ${e}`);
      res.status(500).json({ error: 'Failed to create board' });
    }
  });

  /** ---------- Columns ---------- */
  router.post('/columns', async (req, res) => {
    try {
      const column = await todoListService.createColumn(req.body);
      res.status(201).json(column);
    } catch (e) {
      logger.error(`Error creating column: ${e}`);
      res.status(500).json({ error: 'Failed to create column' });
    }
  });

  // eslint-disable-next-line consistent-return
  router.get('/boards/:boardId/columns', async (req, res) => {
    try {
      const boardId = Number(req.params.boardId);
      const columns = await todoListService.listColumns(boardId);
      if (!columns.length) {
        return res.status(404).json({ error: 'No columns found' });
      }
      res.status(200).json(columns);
    } catch (e) {
      logger.error(`Error fetching columns: ${e}`);
      res.status(500).json({ error: 'Failed to fetch columns' });
    }
  });

  /** ---------- Sprints ---------- */
  router.get('/projects/:projectId/sprints', async (req, res) => {
    try {
      const projectId = Number(req.params.projectId);
      const rows = await todoListService.listSprints(projectId);
      res.json(rows);
    } catch (error) {
      logger.error(`Error fetching sprints: ${error}`);
      res.status(500).json({ error: 'Failed to fetch sprints' });
    }
  });

  router.post('/sprints', async (req, res) => {
    try {
      const sprint = await todoListService.createSprint(req.body);
      res.status(201).json(sprint);
    } catch (e) {
      logger.error(`Error creating sprint: ${e}`);
      res.status(500).json({ error: 'Failed to create sprint' });
    }
  });

  /** ---------- Issues ---------- */
  router.get('/boards/:boardId/issues', async (req, res) => {
    try {
      const boardId = Number(req.params.boardId);
      const issues = await todoListService.listTasks(boardId);
      res.status(200).json(issues);
    } catch (e) {
      logger.error(`Error fetching issues: ${e}`);
      res.status(500).json({ error: 'Failed to fetch issues' });
    }
  });

  router.post('/issues', async (req, res) => {
    try {
      const issue = await todoListService.createTask(req.body);
      res.status(201).json(issue);
    } catch (e) {
      logger.error(`Error creating issue: ${e}`);
      res.status(500).json({ error: 'Failed to create issue' });
    }
  });

  // eslint-disable-next-line consistent-return
  router.put('/issues/:id', async (req, res) => {
    try {
      const issue = await todoListService.updateTask({
        id: Number(req.params.id),
        ...req.body,
      });
      if (!issue) {
        return res.status(404).json({ error: 'Issue not found' });
      }
      res.status(200).json(issue);
    } catch (e) {
      logger.error(`Error updating issue: ${e}`);
      res.status(500).json({ error: 'Failed to update issue' });
    }
  });

  router.delete('/issues/:id', async (req, res) => {
    try {
      const id = Number(req.params.id);
      await todoListService.deleteTask(id);
      res.status(200).json({ success: true });
    } catch (e) {
      logger.error(`Error deleting issue: ${e}`);
      res.status(500).json({ error: 'Failed to delete issue' });
    }
  });

  router.use((req, _res, next) => {
    logger.info(`[${req.method}] ${req.url} Body: ${JSON.stringify(req.body)}`);
    next();
  });

  return router;
}
