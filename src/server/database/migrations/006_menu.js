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
			table.decimal('rating', 3, 2);
			table.boolean('is_active').defaultTo(true);
			table.timestamps(false, true);
		}),
		knex.schema.createTable('review', table => {
			table.increments();
			table
				.integer('menu_id')
				.unsigned()
				.references('id')
				.inTable('menu')
				.onDelete('CASCADE');
			table
				.integer('user_id')
				.unsigned()
				.references('id')
				.inTable('user')
				.onDelete('CASCADE');
			table.string('content');
			table.boolean('is_publish').defaultTo(true);
			table.timestamps(false, true);
		})
	]);
};

exports.down = function(knex, Promise) {
	return Promise.all([
		knex.schema.dropTable('review'),
		knex.schema.dropTable('menu'),
		knex.schema.dropTable('category')
	]);
};
