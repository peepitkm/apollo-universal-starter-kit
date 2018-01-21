exports.up = function(knex, Promise) {
	return Promise.all([
		knex.schema.createTable('cook_category', table => {
			table
				.integer('user_id')
				.unsigned()
				.references('id')
				.inTable('user')
				.onDelete('CASCADE');
			table
				.integer('category_id')
				.unsigned()
				.references('id')
				.inTable('category')
				.onDelete('CASCADE');
			table.primary(['user_id', 'category_id']);
		}),
		knex.schema.createTable('cook_payout', table => {
			table.increments();
			table
				.integer('user_id')
				.unsigned()
				.references('id')
				.inTable('user')
				.onDelete('CASCADE');
			table.string('type', 25);
			table.longtext('object');
			table.timestamps(false, true);
		}),
		knex.schema.createTable('cook_social_channel', table => {
			table.increments();
			table
				.integer('user_id')
				.unsigned()
				.references('id')
				.inTable('user')
				.onDelete('CASCADE');
			table.string('type', 25);
			table.longtext('object');
			table.timestamps(false, true);
		})
	]);
};

exports.down = function(knex, Promise) {
	return Promise.all([
		knex.schema.dropTable('cook_social_channel'),
		knex.schema.dropTable('cook_payout'),
		knex.schema.dropTable('cook_category')
	]);
};
