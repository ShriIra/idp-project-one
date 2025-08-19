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

import express from 'express';
import { LoggerService } from '@backstage/backend-plugin-api';
import { PluginDatabaseManager } from '@backstage/backend-common';
import { ProjectService } from './services/projectService';

interface RouterOptions {
  logger: LoggerService;
  database: PluginDatabaseManager;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger, database } = options;
  const db = await database.getClient();
  const projectService = new ProjectService(db, logger);

  const router = express.Router();
  router.use(express.json());

  // Create project
  router.post('/projects', async (req, res) => {
    try {
      const { name, project_key } = req.body;
      if (!name || !project_key) {
        return res.status(400).json({ error: 'name and project_key are required' });
      }
      const project = await projectService.createProject(req.body);
      return res.status(201).json(project);
    } catch (error) {
      logger.error(`Error creating project: ${error}`);
      return res.status(500).json({ error: 'Failed to create project' });
    }
  });

  // Get all projects
  router.get('/projects', async (_req, res) => {
    try {
      const projects = await projectService.getAllProjects();
      res.json(projects);
    } catch (error) {
      logger.error(`Error fetching projects: ${error}`);
      res.status(500).json({ error: 'Failed to fetch projects' });
    }
  });

  // Get project by ID
  router.get('/projects/:id', async (req, res) => {
    try {
      const project = await projectService.getProjectById(req.params.id);
      if (project) {
        res.json(project);
      } else {
        res.status(404).json({ error: 'Project not found' });
      }
    } catch (error) {
      logger.error(`Error fetching project: ${error}`);
      res.status(500).json({ error: 'Failed to fetch project' });
    }
  });

  // Update project
  router.put('/projects/:id', async (req, res) => {
    try {
      const updated = await projectService.updateProject(req.params.id, req.body);
      if (!updated || updated.length === 0) {
        return res.status(404).json({ error: 'Project not found' });
      }
      return res.json(updated[0]);
    } catch (error) {
      logger.error(`Error updating project: ${error}`);
      return res.status(500).json({ error: 'Failed to update project' });
    }
  });

  // Delete project
  router.delete('/projects/:id', async (req, res) => {
    try {
      await projectService.deleteProject(req.params.id);
      res.status(204).send();
    } catch (error) {
      logger.error(`Error deleting project: ${error}`);
      res.status(500).json({ error: 'Failed to delete project' });
    }
  });

  // Invite teammates
  router.post('/projects/:id/invite', async (req, res) => {
    try {
      const { teammates } = req.body;
      if (!Array.isArray(teammates) || teammates.length === 0) {
        return res.status(400).json({ error: 'Teammates array is required' });
      }
      const result = await projectService.inviteTeammates(req.params.id, teammates);
      return res.status(200).json(result);
    } catch (error) {
      logger.error(`Error inviting teammates: ${error}`);
      return res.status(500).json({ error: 'Failed to invite teammates' });
    }
  });

  return router;
}
