exports.up = function(knex, Promise) {
	return Promise.all([
		knex.schema.createTable('tag', table => {
			table.increments();
			table.string('name');
			table.timestamps(false, true);
		}),
		knex.schema.createTable('menu_tag', table => {
			table.increments();
			table
				.integer('menu_id')
				.unsigned()
				.references('id')
				.inTable('menu')
				.onDelete('CASCADE');
			table
				.integer('tag_id')
				.unsigned()
				.references('id')
				.inTable('tag')
				.onDelete('CASCADE');
			table.timestamps(false, true);
		})
	]);
};

exports.down = function(knex, Promise) {
	return Promise.all([
		knex.schema.dropTable('menu_tag'),
		knex.schema.dropTable('tag')
	]);
};
