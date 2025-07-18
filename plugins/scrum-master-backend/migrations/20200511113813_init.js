/*
 * Copyright 2020 The Backstage Authors
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

// @ts-check

/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function up(knex) {
  return (
    knex.schema
      //
      // locations
      //
      .createTable('todos', table => {
        table.comment(
          'Registered locations that shall be continuously scanned for catalog item updates',
        );
        table
          .uuid('id')
          .primary()
          .notNullable()
          .comment('Auto-generated ID of the location');
        table.string('type').notNullable().comment('The type of location');
        table
          .string('target')
          .notNullable()
          .comment('The actual target of the location');
      })
  );
};
