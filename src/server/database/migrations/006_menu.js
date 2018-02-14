exports.up = function(knex, Promise) {
	return Promise.all([
		knex.schema.createTable('category', table => {
			table.increments();
			table.string('title');
			table.string('description');
			table.boolean('is_active').defaultTo(true);
			table.timestamps(false, true);
		}),
		knex.schema.createTable('menu', table => {
			table.increments();
			table
				.integer('cook_id')
				.unsigned()
				.references('user_id')
				.inTable('cook_profile')
				.onDelete('CASCADE');
			table
				.integer('category_id')
				.unsigned()
				.references('id')
				.inTable('category')
				.onDelete('CASCADE');
			table.string('title');
			table.string('description');
			table.decimal('rating', 3, 2).defaultTo(0);
			//
			table.integer('free_items').unsigned().defaultTo(0);
			table.integer('sale_items').unsigned().defaultTo(0);
			//
			table.boolean('is_active').defaultTo(true);
			table.timestamps(false, true);
		}),
		knex.schema.createTable('menu_schedule', table => {
			table.increments();
			table
				.integer('menu_id')
				.unsigned()
				.references('id')
				.inTable('menu')
				.onDelete('CASCADE');
			table.enu('type', ['only', 'every', 'any']);
			table.date('schedule');
		}),
		knex.schema.createTable('menu_payment', table => {
			table.increments();
			table
				.integer('menu_id')
				.unsigned()
				.references('id')
				.inTable('menu')
				.onDelete('CASCADE');
			table.enu('type', ['only', 'every', 'any']);
			table.string('object');
		}),
		knex.schema.createTable('menu_price', table => {
			table.increments();
			table
				.integer('menu_id')
				.unsigned()
				.references('id')
				.inTable('menu')
				.onDelete('CASCADE');
			table
				.integer('unit_id')
				.unsigned()
				.references('id')
				.inTable('menu_unit')
				.onDelete('CASCADE');
			table.decimal('price', 6, 2);
		}),
		knex.schema.createTable('menu_unit', table => {
			table.increments();
			table.string('name');
			table.string('description');
			//
			table.boolean('is_active').defaultTo(true);
			table.timestamps(false, true);
		}),
		knex.schema.createTable('menu_appointment', table => {
			table.increments();
			table
				.integer('menu_id')
				.unsigned()
				.references('id')
				.inTable('menu')
				.onDelete('CASCADE');
			table.string('name');
			table.string('short_description');
			table.string('time');
			//
			table.integer('province_id').unsigned();
			table.integer('district_id').unsigned();
			table.integer('subdistrict_id').unsigned();
			table.decimal('latitude', 10, 8);
			table.decimal('longitude', 11, 8);
		})
	]);
};

exports.down = function(knex, Promise) {
	return Promise.all([
		knex.schema.dropTable('menu_appointment'),
		knex.schema.dropTable('menu_unit'),
		knex.schema.dropTable('menu_price'),
		knex.schema.dropTable('menu_payment'),
		knex.schema.dropTable('menu_schedule'),
		knex.schema.dropTable('menu'),
		knex.schema.dropTable('category')
	]);
};
