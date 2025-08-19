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
//   await knex.schema.createTable('projects', table => {
//     table.increments('id').primary();
//     table.string('name').notNullable();
//     table.string('project_key').notNullable().unique();
//     table.text('description').nullable();
//     table.string('template').nullable();
//     table.timestamps(true, true);
//   });

//   await knex.schema.createTable('teammates', table => {
//     table.increments('id').primary();
//     table.integer('project_id').unsigned().references('id').inTable('projects').onDelete('CASCADE');
//     table.string('name_or_email').notNullable();
//     table.string('role').nullable();
//     table.timestamps(true, true);
//   });
// }

// export async function down(knex: Knex): Promise<void> {
//   await knex.schema.dropTableIfExists('teammates');
//   await knex.schema.dropTableIfExists('projects');
// }

import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // ✅ Create projects table if not exists
  const hasProjectsTable = await knex.schema.hasTable('projects');
  if (!hasProjectsTable) {
    await knex.schema.createTable('projects', table => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('project_key').notNullable().unique(); // only project_key now
      table.text('description').nullable();
      table.string('template').nullable();
      table.timestamps(true, true);
    });
  } else {
    // ✅ If old "key" column exists, drop it
    const hasKey = await knex.schema.hasColumn('projects', 'key');
    if (hasKey) {
      await knex.schema.alterTable('projects', table => {
        table.dropColumn('key'); // remove old column
      });
    }

    // ✅ Ensure "project_key" exists
    const hasProjectKey = await knex.schema.hasColumn('projects', 'project_key');
    if (!hasProjectKey) {
      await knex.schema.alterTable('projects', table => {
        table.string('project_key').notNullable().unique();
      });
    }

    // ✅ Ensure "description" exists
    const hasDescription = await knex.schema.hasColumn('projects', 'description');
    if (!hasDescription) {
      await knex.schema.alterTable('projects', table => {
        table.text('description').nullable();
      });
    }

    // ✅ Ensure "template" exists
    const hasTemplate = await knex.schema.hasColumn('projects', 'template');
    if (!hasTemplate) {
      await knex.schema.alterTable('projects', table => {
        table.string('template').nullable();
      });
    }
  }

  // ✅ Create teammates table if not exists
  const hasTeammatesTable = await knex.schema.hasTable('teammates');
  if (!hasTeammatesTable) {
    await knex.schema.createTable('teammates', table => {
      table.increments('id').primary();
      table
        .integer('project_id')
        .unsigned()
        .references('id')
        .inTable('projects')
        .onDelete('CASCADE');
      table.string('name_or_email').notNullable();
      table.string('role').nullable();
      table.timestamps(true, true);
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  const hasTeammatesTable = await knex.schema.hasTable('teammates');
  if (hasTeammatesTable) {
    await knex.schema.dropTable('teammates');
  }

  const hasProjectsTable = await knex.schema.hasTable('projects');
  if (hasProjectsTable) {
    await knex.schema.dropTable('projects');
  }
}
