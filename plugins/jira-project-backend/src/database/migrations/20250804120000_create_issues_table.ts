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

// 20250804120000_create_issues_table.ts

// import { Knex } from 'knex';

// export async function up(knex: Knex): Promise<void> {
//   await knex.schema.createTable('issues', table => {
//     table.increments('id').primary();
//     table.string('title').notNullable();
//     table.text('description');
//     table.jsonb('assignee');   // changed
//     table.string('type').notNullable();
//     table.string('priority');
//     table
//       .integer('parentId')
//       .references('id')
//       .inTable('issues')
//       .onDelete('SET NULL');
//     table.jsonb('team');       // changed
//     table.timestamp('start_date', { useTz: true });
//     table.timestamp('due_date', { useTz: true });
//     table.jsonb('reporter').notNullable();  // changed
//     table.string('status');
//     table.string('attachmentUrl');
//     table.timestamp('created_at').defaultTo(knex.fn.now());
//     table.timestamp('updated_at').defaultTo(knex.fn.now());
//   });
// }

// export async function down(knex: Knex): Promise<void> {
//   await knex.schema.dropTableIfExists('issues');
// }

// 20250804120000_create_issues_table.ts

// 20250804120000_create_issues_table.ts

import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('issues', table => {
    table.increments('id').primary();
    table.string('title').notNullable();
    table.text('description');
    table.jsonb('assignee'); // changed
    table.string('type').notNullable();
    table.string('priority');
    table
      .integer('parentId')
      .references('id')
      .inTable('issues')
      .onDelete('SET NULL');
    table.jsonb('team'); // changed
    table.timestamp('start_date', { useTz: true });
    table.timestamp('due_date', { useTz: true });
    table.jsonb('reporter').notNullable(); // changed
    table.string('status');
    table.string('attachmentUrl');
    table.boolean('starred').notNullable().defaultTo(false); // 👈 added
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('issues');
}
