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

// src/services/TodoListService/TodoListService.ts
import { Knex } from 'knex';
import { LoggerService } from '@backstage/backend-plugin-api';

export interface TodoListServiceOptions {
  logger: LoggerService;
  database: Knex;
}

class TodoListService {
  private knex: Knex;
  private logger: LoggerService;

  constructor(knex: Knex, logger: LoggerService) {
    this.knex = knex;
    this.logger = logger;
  }

  /** ---------- Projects ---------- */
  async listProjects() {
    return this.knex('projects').select('*');
  }

  async createProject(data: {
    name: string;
    key: string;
    template: 'kanban' | 'scrum';
  }) {
    const [project] = await this.knex('projects').insert(data).returning('*');
    return project;
  }

  async listTemplates() {
    return [
      {
        id: 'kanban',
        name: 'Kanban',
        description:
          'Track work items in a continuous flow, ideal for operations and support teams.',
        workTypes: ['Story', 'Task', 'Bug', 'Epic', 'Feature'],
      },
      {
        id: 'scrum',
        name: 'Scrum',
        description:
          'Plan sprints and track progress in iterative cycles, ideal for development teams.',
        workTypes: ['Story', 'Task', 'Bug', 'Epic'],
      },
    ];
  }

  /** ---------- Boards ---------- */
  async listBoards() {
    return this.knex('boards').select('*');
  }

  async createBoard(data: { name: string; project_id: number }) {
    // Log the incoming data
    this.logger.info(`Inserting board with data: ${JSON.stringify(data)}`);

    const [board] = await this.knex('boards').insert(data).returning('*');

    // Log the board after creation
    this.logger.info(`Created board: ${JSON.stringify(board)}`);

    const defaultColumns = ['TODO', 'IN PROGRESS', 'TESTING', 'DONE'];
    for (let i = 0; i < defaultColumns.length; i++) {
      await this.knex('columns').insert({
        name: defaultColumns[i],
        board_id: board.id,
        position: i,
      });
    }

    return board;
  }

  /** ---------- Columns ---------- */
  async listColumns(board_id: number) {
    return this.knex('columns').where({ board_id }).orderBy('position');
  }

  async createColumn(data: any) {
    const { board_id, name, position } = data;

    const [column] = await this.knex('columns')
      .insert({ board_id, name, position })
      .returning('*');

    return column;
  }

  /** ---------- Sprints ---------- */
  async listSprints(project_id: number) {
    return this.knex('sprints').where({ project_id }).orderBy('start_date');
  }

  async createSprint(data: {
    name: string;
    project_id: number;
    start_date: Date;
    end_date: Date;
  }) {
    const [sprint] = await this.knex('sprints').insert(data).returning('*');
    return sprint;
  }

  /** ---------- Issues / Tasks ---------- */
  async listTasks(board_id: number) {
    return this.knex('issues').where({ board_id }).select('*');
  }

  async createTask(data: {
    board_id: number;
    column_id: number;
    sprint_id?: number;
    title: string;
    description?: string;
    type: 'task' | 'bug' | 'story';
    status: string;
    assignee?: string;
    reporter?: string;
    team?: string;
    labels?: string[];
    priority?: 'low' | 'medium' | 'high';
    start_date?: Date;
    due_date?: Date;
    attachment?: string;
  }) {
    const [task] = await this.knex('issues').insert(data).returning('*');
    return task;
  }

  async updateTask(data: {
    id: number;
    title?: string;
    description?: string;
    type?: 'task' | 'bug' | 'story';
    status?: string;
    assignee?: string;
    reporter?: string;
    team?: string;
    labels?: string[];
    priority?: 'low' | 'medium' | 'high';
    start_date?: Date;
    due_date?: Date;
    attachment?: string;
    column_id?: number;
    sprint_id?: number;
  }) {
    const { id, ...updates } = data;
    const [task] = await this.knex('issues')
      .where({ id })
      .update(updates)
      .returning('*');
    return task;
  }

  async getProjectSummary(projectId: number) {
    // Total issues for project
    const totalIssues = await this.knex('issues')
      .join('boards', 'issues.board_id', 'boards.id')
      .where('boards.project_id', projectId)
      .count<{ count: string }[]>('* as count');

    // Issues grouped by status
    const byStatus = await this.knex('issues')
      .join('boards', 'issues.board_id', 'boards.id')
      .where('boards.project_id', projectId)
      .select('issues.status')
      .count<{ status: string; count: string }[]>('* as count')
      .groupBy('issues.status');

    // Issues grouped by type
    const byType = await this.knex('issues')
      .join('boards', 'issues.board_id', 'boards.id')
      .where('boards.project_id', projectId)
      .select('issues.type')
      .count<{ type: string; count: string }[]>('* as count')
      .groupBy('issues.type');

    // Open vs closed (example: status === 'DONE')
    const completed = await this.knex('issues')
      .join('boards', 'issues.board_id', 'boards.id')
      .where('boards.project_id', projectId)
      .andWhere('issues.status', 'DONE')
      .count<{ count: string }[]>('* as count');

    return {
      projectId,
      total: Number(totalIssues[0]?.count || 0),
      completed: Number(completed[0]?.count || 0),
      byStatus: byStatus.map(r => ({
        status: r.status,
        count: Number(r.count),
      })),
      byType: byType.map(r => ({ type: r.type, count: Number(r.count) })),
    };
  }

  async deleteTask(id: number) {
    await this.knex('issues').where({ id }).del();
    return { success: true };
  }
}

export async function createTodoListService(options: TodoListServiceOptions) {
  const { logger, database } = options;

  try {
    const result = await database.raw('SELECT current_database()');
    logger.info(`Connected to database: ${result.rows[0].current_database}`);
  } catch (err) {
    logger.error(`Database connection failed: ${err}`);
  }

  logger.info('TodoListService initialized with PostgreSQL');
  return new TodoListService(database, logger);
}

export type { TodoListService };
