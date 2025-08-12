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

// import express from 'express';
// import { LoggerService } from '@backstage/backend-plugin-api';
// import { PluginDatabaseManager } from '@backstage/backend-common';
// import { IssueService } from './services/IssueService';

// interface RouterOptions {
//   logger: LoggerService;
//   database: PluginDatabaseManager;
// }

// export async function createRouter(options: RouterOptions): Promise<express.Router> {
//   const { logger, database } = options;

//   const db = await database.getClient();
//   const issueService = new IssueService(db);

//   const router = express.Router();
//   router.use(express.json());

//   // Create issue
//   router.post('/issues', async (req, res) => {
//   try {
//     if (!req.body.title || !req.body.type || !req.body.reporter) {
//       return res.status(400).json({ error: 'title, type, and reporter are required' });
//     }

//     const issue = await issueService.createIssue(req.body);
//     return res.status(201).json(issue); // <-- added return
//   } catch (error) {
//     logger.error(`Error creating issue: ${error}`);
//     return res.status(500).json({ error: 'Failed to create issue' }); // <-- added return
//   }
// });

//   // Get all issues
//   router.get('/issues', async (_req, res) => {
//     try {
//       const issues = await issueService.getAllIssues();
//       res.json(issues);
//     } catch (error) {
//       logger.error(`Error fetching issues: ${error}`);
//       res.status(500).json({ error: 'Failed to fetch issues' });
//     }
//   });

//   // Get issue by ID
//   router.get('/issues/:id', async (req, res) => {
//     try {
//       const issue = await issueService.getIssueById(req.params.id);
//       if (issue) {
//         res.json(issue);
//       } else {
//         res.status(404).json({ error: 'Issue not found' });
//       }
//     } catch (error) {
//       logger.error(`Error fetching issue: ${error}`);
//       res.status(500).json({ error: 'Failed to fetch issue' });
//     }
//   });

//   // Delete issue
//   router.delete('/issues/:id', async (req, res) => {
//     try {
//       await issueService.deleteIssue(req.params.id);
//       res.status(204).send();
//     } catch (error) {
//       logger.error(`Error deleting issue: ${error}`);
//       res.status(500).json({ error: 'Failed to delete issue' });
//     }
//   });

//   return router;
// }

import express from 'express';
import { LoggerService } from '@backstage/backend-plugin-api';
import { PluginDatabaseManager } from '@backstage/backend-common';
import { IssueService } from './services/IssueService';

interface RouterOptions {
  logger: LoggerService;
  database: PluginDatabaseManager;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger, database } = options;

  const db = await database.getClient();
  const issueService = new IssueService(db, logger);

  const router = express.Router();
  router.use(express.json());

  // Create issue
  router.post('/issues', async (req, res) => {
    try {
      if (
        !req.body.title ||
        !req.body.type ||
        !req.body.reporter ||
        !req.body.status
      ) {
        return res
          .status(400)
          .json({ error: 'title, type, reporter, and status are required' });
      }

      const issue = await issueService.createIssue(req.body);
      return res.status(201).json(issue);
    } catch (error) {
      logger.error(`Error creating issue: ${error}`);
      return res.status(500).json({ error: 'Failed to create issue' });
    }
  });

  // Get all issues
  router.get('/issues', async (_req, res) => {
    try {
      const issues = await issueService.getAllIssues();
      res.json(issues);
    } catch (error) {
      logger.error(`Error fetching issues: ${error}`);
      res.status(500).json({ error: 'Failed to fetch issues' });
    }
  });

  // Get issue by ID
  router.get('/issues/:id', async (req, res) => {
    try {
      const issue = await issueService.getIssueById(req.params.id);
      if (issue) {
        res.json(issue);
      } else {
        res.status(404).json({ error: 'Issue not found' });
      }
    } catch (error) {
      logger.error(`Error fetching issue: ${error}`);
      res.status(500).json({ error: 'Failed to fetch issue' });
    }
  });

  // Update only status
  router.patch('/issues/:id/status', async (req, res) => {
    try {
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ error: 'Status is required' });
      }

      await issueService.updateIssueStatus(req.params.id, status);
      return res.status(200).json({ message: 'Status updated successfully' });
    } catch (error) {
      logger.error(`Error updating issue status: ${error}`);
      return res.status(500).json({ error: 'Failed to update status' });
    }
  });

  router.put('/issues/:id', async (req, res) => {
    try {
      const updated = await issueService.updateIssue(req.params.id, req.body);
      if (!updated || updated.length === 0) {
        return res.status(404).json({ error: 'Issue not found' });
      }
      return res.json(updated[0]); // return added
    } catch (error) {
      logger.error(`Error updating issue: ${error}`);
      return res.status(500).json({ error: 'Failed to update issue' }); // return added
    }
  });

  // Delete issue
  router.delete('/issues/:id', async (req, res) => {
    try {
      await issueService.deleteIssue(req.params.id);
      res.status(204).send();
    } catch (error) {
      logger.error(`Error deleting issue: ${error}`);
      res.status(500).json({ error: 'Failed to delete issue' });
    }
  });

  return router;
}

// import { Router, Request, Response } from 'express';
// import { Logger } from 'winston';
// import { Knex } from 'knex';
// import { IssueService } from './services/IssueService';

// interface RouterDeps {
//   logger: Logger;
//   database: Knex;
// }

// export default async function createRouter({ logger, database }: RouterDeps) {
//   const issueService = new IssueService(database, logger);
//   const router = Router();

//   // Get all issues
//   router.get('/issues', async (_req: Request, res: Response) => {
//     try {
//       const issues = await issueService.getAllIssues();
//       return res.status(200).json(issues);
//     } catch (error) {
//       logger.error(`Failed to fetch issues: ${error}`);
//       return res.status(500).json({ message: 'Failed to fetch issues' });
//     }
//   });

//   // Get single issue
//   router.get('/issues/:id', async (req: Request, res: Response) => {
//     try {
//       const issue = await issueService.getIssueById(req.params.id);
//       if (!issue) {
//         return res.status(404).json({ message: 'Issue not found' });
//       }
//       return res.status(200).json(issue);
//     } catch (error) {
//       logger.error(`Failed to fetch issue: ${error}`);
//       return res.status(500).json({ message: 'Failed to fetch issue' });
//     }
//   });

//   // Create new issue
//   router.post('/issues', async (req: Request, res: Response) => {
//     try {
//       const { title, type, reporter, status, dueDate, startDate, assignee, parentId } = req.body;
//       if (!title || !type || !reporter || !status) {
//         return res.status(400).json({ message: 'Missing required fields' });
//       }
//       const newIssue = await issueService.createIssue({
//         title,
//         type,
//         reporter,
//         status,
//         dueDate,
//         startDate,
//         assignee,
//         parentId,
//       });
//       return res.status(201).json(newIssue);
//     } catch (error) {
//       logger.error(`Failed to create issue: ${error}`);
//       return res.status(500).json({ message: 'Failed to create issue' });
//     }
//   });

//   // Update issue (full update)
//   router.put('/issues/:id', async (req: Request, res: Response) => {
//     try {
//       const updated = await issueService.updateIssue(req.params.id, req.body);
//       if (!updated.length) {
//         return res.status(404).json({ message: 'Issue not found' });
//       }
//       return res.status(200).json(updated[0]);
//     } catch (error) {
//       logger.error(`Failed to update issue: ${error}`);
//       return res.status(500).json({ message: 'Failed to update issue' });
//     }
//   });

//   // Delete issue
//   router.delete('/issues/:id', async (req: Request, res: Response) => {
//     try {
//       const deleted = await issueService.deleteIssue(req.params.id);
//       if (!deleted) {
//         return res.status(404).json({ message: 'Issue not found' });
//       }
//       return res.status(204).send();
//     } catch (error) {
//       logger.error(`Failed to delete issue: ${error}`);
//       return res.status(500).json({ message: 'Failed to delete issue' });
//     }
//   });

//   // Update only status
//   router.patch('/issues/:id/status', async (req: Request, res: Response) => {
//     try {
//       const updated = await issueService.updateIssue(req.params.id, { status: req.body.status });
//       if (!updated.length) {
//         return res.status(404).json({ message: 'Issue not found' });
//       }
//       return res.status(200).json(updated[0]);
//     } catch (error) {
//       logger.error(`Failed to update issue status: ${error}`);
//       return res.status(500).json({ message: 'Failed to update issue status' });
//     }
//   });

//   return router;
// }
