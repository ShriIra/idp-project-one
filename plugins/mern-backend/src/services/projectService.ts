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
import { Knex } from 'knex';
import { LoggerService } from '@backstage/backend-plugin-api';

export class ProjectService {
  private knex: Knex;
  private logger: LoggerService;

  constructor(knex: Knex, logger: LoggerService) {
    this.knex = knex;
    this.logger = logger;
  }

  async createProject(projectData: any) {
    this.logger.info(`Creating new project: ${projectData.name}`);

    const [project] = await this.knex('projects')
      .insert({
        name: projectData.name,
        project_key: projectData.project_key,
        description: projectData.description || null,
        template: projectData.template || null,
      })
      .returning('*');

    return project;
  }

  async getAllProjects() {
    return await this.knex('projects').select('*').orderBy('id', 'desc');
  }

  async getProjectById(id: string) {
    return await this.knex('projects').where({ id }).first();
  }

  async updateProject(id: string, updateData: any) {
    const updated = await this.knex('projects')
      .where({ id })
      .update(updateData)
      .returning('*');
    return updated;
  }

  async deleteProject(id: string) {
    return await this.knex('projects').where({ id }).del();
  }

  async inviteTeammates(projectId: string, teammates: any[]) {
    const rows = teammates.map(t => ({
      project_id: projectId,
      name_or_email: t.name_or_email,
      role: t.role || null,
    }));

    await this.knex('teammates').insert(rows);
    return { message: 'Teammates invited successfully' };
  }

  async getTeammates(projectId: string) {
    return await this.knex('teammates').where({ project_id: projectId });
  }
}
