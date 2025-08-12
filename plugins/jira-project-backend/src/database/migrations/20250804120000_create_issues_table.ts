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

// import { Knex } from 'knex';

// export async function up(knex: Knex): Promise<void> {
//   return knex.schema.createTable('issues', (table) => {
//     table.increments('id').primary();
//     table.string('title').notNullable();
//     table.text('description');
//     table.string('type').notNullable();
//     table.string('assignee');
//     table.string('reporter').notNullable();
//     table.string('team');
//     table.integer('parentId').nullable(); // integer ID for parent
//     table.date('start_date');
//     table.date('due_date');
//     table.timestamps(true, true);

//     // Optional fields
//     table.string('priority').nullable();
//     table.string('status').nullable();
//     table.string('labels').nullable();
//     table.string('attachmentUrl').nullable(); // Added to match service
//   });
// }

// export async function down(knex: Knex): Promise<void> {
//   return knex.schema.dropTableIfExists('issues');
// }

import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('issues', table => {
    table.increments('id').primary();
    table.string('title').notNullable();
    table.text('description');
    table.string('type').notNullable();
    table.string('assignee');
    table.string('reporter').notNullable();
    table.string('team');
    table.integer('parentId').nullable();
    table.date('start_date');
    table.date('due_date');
    table.timestamps(true, true);

    // Optional fields
    table.string('priority').nullable();
    table.string('status').nullable();
    table.string('labels').nullable();
    table.string('attachmentUrl').nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('issues');
}
