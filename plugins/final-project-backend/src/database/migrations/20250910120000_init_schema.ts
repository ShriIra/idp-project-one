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

// 20250910120000_init_schema.ts

import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Projects
  await knex.schema.createTable('projects', table => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('key').notNullable().unique();
    table.enu('template', ['kanban', 'scrum']).notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  // Boards
  await knex.schema.createTable('boards', table => {
    table.increments('id').primary();
    table
      .integer('project_id')
      .references('id')
      .inTable('projects')
      .onDelete('CASCADE');
    table.string('name').notNullable();
  });

  // Columns
  await knex.schema.createTable('columns', table => {
    table.increments('id').primary();
    table
      .integer('board_id')
      .references('id')
      .inTable('boards')
      .onDelete('CASCADE');
    table.string('name').notNullable();
    table.integer('position').notNullable();
  });

  // Sprints (Scrum only)
  await knex.schema.createTable('sprints', table => {
    table.increments('id').primary();
    table
      .integer('project_id')
      .references('id')
      .inTable('projects')
      .onDelete('CASCADE');
    table.string('name').notNullable();
    table.date('start_date');
    table.date('end_date');
    table.string('status').defaultTo('planned');
  });

  // Issues
  await knex.schema.createTable('issues', table => {
    table.increments('id').primary();
    table
      .integer('project_id')
      .references('id')
      .inTable('projects')
      .onDelete('CASCADE');
    table
      .integer('board_id')
      .references('id')
      .inTable('boards')
      .onDelete('CASCADE');
    table
      .integer('column_id')
      .references('id')
      .inTable('columns')
      .onDelete('CASCADE');
    table
      .integer('sprint_id')
      .references('id')
      .inTable('sprints')
      .nullable()
      .onDelete('SET NULL');
    table.string('title').notNullable();
    table.text('description');
    table
      .enu('type', ['story', 'task', 'bug', 'epic', 'feature'])
      .notNullable();
    table
      .enu('status', ['to do', 'in progress', 'testing', 'done'])
      .notNullable();
    table.string('assignee');
    table.string('reporter');
    table.specificType('team', 'TEXT[]');
    table.specificType('labels', 'TEXT[]');
    table.enu('priority', ['low', 'medium', 'high']).defaultTo('medium');
    table.date('start_date');
    table.date('due_date');
    table.string('sprint');
    table.jsonb('attachments');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('issues');
  await knex.schema.dropTableIfExists('sprints');
  await knex.schema.dropTableIfExists('columns');
  await knex.schema.dropTableIfExists('boards');
  await knex.schema.dropTableIfExists('projects');
}
