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

// IssueService.ts

// import { Knex } from 'knex';

// export class IssueService {
//   constructor(private readonly db: Knex, private readonly logger: any) {}

//   async createIssue(issue: {
//     title: string;
//     description?: string;
//     assignee?: string;
//     type: string;
//     priority?: string;
//     parentId?: number;
//     team?: string;
//     due_date?: string;
//     start_date?: string;
//     reporter: string;
//     status?: string;
//     attachmentUrl?: string;
//   }) {
//     this.logger.info(`Creating issue: ${issue.title}`);
//     const mappedIssue = {
//       title: issue.title,
//       description: issue.description,
//       assignee: issue.assignee,
//       type: issue.type,
//       priority: issue.priority,
//       parentId: issue.parentId,
//       team: issue.team,
//       due_date: issue.due_date,
//       start_date: issue.start_date,
//       reporter: issue.reporter,
//       status: issue.status,
//       attachmentUrl: issue.attachmentUrl,
//     };

//     const [createdIssue] = await this.db('issues')
//       .insert(mappedIssue)
//       .returning('*');

//     this.logger.debug(`Created issue:`, createdIssue);
//     return createdIssue;
//   }

//   async getAllIssues() {
//     this.logger.info(`Fetching all issues`);
//     return await this.db('issues').select('*');
//   }

//   async getIssueById(id: string) {
//     this.logger.info(`Fetching issue with id: ${id}`);
//     return await this.db('issues').where({ id }).first();
//   }

//   async updateIssueStatus(id: string, status: string) {
//     this.logger.info(`Updating status of issue ${id} to ${status}`);
//     const [updated] = await this.db('issues')
//       .where({ id })
//       .update({ status, updated_at: this.db.fn.now() })
//       .returning('*');

//     return updated;
//   }

//   async updateIssue(
//     id: string,
//     updatedFields: Partial<{
//       title: string;
//       description?: string;
//       assignee?: string;
//       type: string;
//       priority?: string;
//       parentId?: number;
//       team?: string;
//       due_date?: string;
//       start_date?: string;
//       reporter?: string;
//       status?: string;
//       attachmentUrl?: string;
//     }>,
//   ) {
//     this.logger.info(`Updating issue ${id}`);
//     const mappedFields: any = { ...updatedFields };

//     const [updated] = await this.db('issues')
//       .where({ id })
//       .update({ ...mappedFields, updated_at: this.db.fn.now() })
//       .returning('*');

//     this.logger.debug(`Updated issue ${id}:`, updated);
//     return updated;
//   }

//   async deleteIssue(id: string) {
//     this.logger.info(`Deleting issue ${id}`);
//     return await this.db('issues').where({ id }).delete();
//   }

//   // method for calendar
//   async getIssuesByDateRange(start: string, end: string) {
//     this.logger.info(`Fetching issues between ${start} and ${end}`);
//     return await this.db('issues')
//       .whereBetween('start_date', [start, end])
//       .orWhereBetween('due_date', [start, end])
//       .select('*');
//   }
// }

import { Knex } from 'knex';

export class IssueService {
  constructor(private readonly db: Knex, private readonly logger: any) {}

  async createIssue(issue: {
    title: string;
    description?: string;
    assignee?: string;
    type: string;
    priority?: string;
    parentId?: number;
    team?: string;
    due_date?: string; // now supports date + time
    start_date?: string; // now supports date + time
    reporter: string;
    status?: string;
    attachmentUrl?: string;
  }) {
    this.logger.info(`Creating issue: ${issue.title}`);
    const mappedIssue = {
      title: issue.title,
      description: issue.description,
      assignee: issue.assignee,
      type: issue.type,
      priority: issue.priority,
      parentId: issue.parentId,
      team: issue.team,
      due_date: issue.due_date, // should be ISO string with datetime
      start_date: issue.start_date, // should be ISO string with datetime
      reporter: issue.reporter,
      status: issue.status,
      attachmentUrl: issue.attachmentUrl,
    };

    const [createdIssue] = await this.db('issues')
      .insert(mappedIssue)
      .returning('*');

    this.logger.debug(`Created issue:`, createdIssue);
    return createdIssue;
  }

  async getAllIssues() {
    this.logger.info(`Fetching all issues`);
    return await this.db('issues').select('*');
  }

  async getIssueById(id: string) {
    this.logger.info(`Fetching issue with id: ${id}`);
    return await this.db('issues').where({ id }).first();
  }

  async updateIssueStatus(id: string, status: string) {
    this.logger.info(`Updating status of issue ${id} to ${status}`);
    const [updated] = await this.db('issues')
      .where({ id })
      .update({ status, updated_at: this.db.fn.now() })
      .returning('*');

    return updated;
  }

  async updateIssue(
    id: string,
    updatedFields: Partial<{
      title: string;
      description?: string;
      assignee?: string;
      type: string;
      priority?: string;
      parentId?: number;
      team?: string;
      due_date?: string; // datetime
      start_date?: string; // datetime
      reporter?: string;
      status?: string;
      attachmentUrl?: string;
    }>,
  ) {
    this.logger.info(`Updating issue ${id}`);
    const mappedFields: any = { ...updatedFields };

    const [updated] = await this.db('issues')
      .where({ id })
      .update({ ...mappedFields, updated_at: this.db.fn.now() })
      .returning('*');

    this.logger.debug(`Updated issue ${id}:`, updated);
    return updated;
  }

  async deleteIssue(id: string) {
    this.logger.info(`Deleting issue ${id}`);
    return await this.db('issues').where({ id }).delete();
  }

  // method for calendar
  async getIssuesByDateRange(start: string, end: string) {
    this.logger.info(`Fetching issues between ${start} and ${end}`);
    return await this.db('issues')
      .whereBetween('start_date', [start, end])
      .orWhereBetween('due_date', [start, end])
      .select('*');
  }

  // Summary data for dashboard cards
  async getIssueSummary() {
    const totalIssues = await this.db('issues').count('id as count').first();

    const openIssues = await this.db('issues')
      .whereNot('status', 'DONE')
      .count('id as count')
      .first();

    const closedIssues = await this.db('issues')
      .where('status', 'DONE')
      .count('id as count')
      .first();

    const highPriority = await this.db('issues')
      .where('priority', 'HIGH')
      .count('id as count')
      .first();

    return {
      total: totalIssues?.count ?? 0,
      open: openIssues?.count ?? 0,
      closed: closedIssues?.count ?? 0,
      highPriority: highPriority?.count ?? 0,
    };
  }
}
