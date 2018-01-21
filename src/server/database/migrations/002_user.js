exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('user', table => {
      table.increments();
      table.string('username').unique();
      table.string('email').unique();
      table.string('password');
      table.string('role').defaultTo('user');
      table.boolean('is_active').defaultTo(false);
      table.timestamps(false, true);
    }),
    knex.schema.createTable('user_profile', table => {
      table.increments();
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('user')
        .onDelete('CASCADE');
      table.string('name');
      table.string('first_name');
      table.string('last_name');
      table.string('genger');
      table.date('birthdate');
      table.string('about');
      //
      table.decimal('rating', 3, 2).unsigned();
      table.decimal('balance', 3, 2).unsigned();
      table.integer('point').unsigned();
      //
      table.timestamps(false, true);
    }),
    knex.schema.createTable('cook_profile', table => {
      table.increments();
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('user')
        .onDelete('CASCADE');
      table.string('name');
      table.string('about');
      //
      table.integer('province_id').unsigned();
      table.integer('district_id').unsigned();
      table.integer('subdistrict_id').unsigned();
      //
      table.integer('menus').unsigned();
      table.integer('likes').unsigned();
      table.integer('follows').unsigned();
      //
      table.decimal('rating', 3, 2).unsigned();
      table.decimal('balance', 3, 2).unsigned();
      table.integer('point').unsigned();
      //
      table.boolean('is_active').defaultTo(false);
      table.boolean('is_official').defaultTo(false);
      table.dateTime('last_activity_at');
      table.dateTime('last_sale_at');
      table.timestamps(false, true);
    }),
    knex.schema.createTable('auth_certificate', table => {
      table.increments();
      table.string('serial').unique();
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('user')
        .onDelete('CASCADE');
      table.timestamps(false, true);
    }),
    knex.schema.createTable('auth_facebook', table => {
      table.increments();
      table.string('fb_id').unique();
      table.string('display_name');
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('user')
        .onDelete('CASCADE');
      table.timestamps(false, true);
    }),
    knex.schema.createTable('auth_google', table => {
      table.increments();
      table.string('google_id').unique();
      table.string('display_name');
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('user')
        .onDelete('CASCADE');
      table.timestamps(false, true);
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('auth_certificate'),
    knex.schema.dropTable('auth_facebook'),
    knex.schema.dropTable('auth_google'),
    knex.schema.dropTable('cook_profile'),
    knex.schema.dropTable('user_profile'),
    knex.schema.dropTable('user')
  ]);
};
