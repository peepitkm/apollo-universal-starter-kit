exports.up = function(knex, Promise) {
	return Promise.all([
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
		knex.schema.dropTable('review')
	]);
};
