exports.up = function(knex, Promise) {
	return Promise.all([
		knex.schema.createTable('user_follows', table => {
			table
				.integer('user_id')
				.unsigned()
				.references('user_id')
				.inTable('user_profile')
				.onDelete('CASCADE');
			table
				.integer('cook_id')
				.unsigned()
				.references('user_id')
				.inTable('cook_profile')
				.onDelete('CASCADE');
			table.timestamp('since').defaultTo(knex.fn.now());
			table.primary(['user_id', 'cook_id']);
		}),
		knex.schema.createTable('user_likes', table => {
			table
				.integer('user_id')
				.unsigned()
				.references('user_id')
				.inTable('user_profile')
				.onDelete('CASCADE');
			table
				.integer('menu_id')
				.unsigned()
				.references('id')
				.inTable('menu')
				.onDelete('CASCADE');
			table.timestamp('since').defaultTo(knex.fn.now());
			table.primary(['user_id', 'menu_id']);
		})
	]);
};

exports.down = function(knex, Promise) {
	return Promise.all([
		knex.schema.dropTable('user_likes'),
		knex.schema.dropTable('user_follows')
	]);
};
