exports.up = function(knex, Promise) {
	return Promise.all([
		knex.schema.createTable('order', table => {
			table.increments();
			table.dateTime('date');
			table
				.integer('user_id')
				.unsigned()
				.references('id')
				.inTable('user')
				.onDelete('CASCADE');
			table
				.integer('menu_id')
				.unsigned()
				.references('id')
				.inTable('menu')
				.onDelete('CASCADE');
			table
				.integer('schedule_id')
				.unsigned()
				.references('id')
				.inTable('menu_schedule')
				.onDelete('CASCADE');
			table
				.integer('appointment_id')
				.unsigned()
				.references('id')
				.inTable('menu_appointment')
				.onDelete('CASCADE');
			table
				.integer('payment_id')
				.unsigned()
				.references('id')
				.inTable('menu_payment')
				.onDelete('CASCADE');
			table.string('payment_reference');
			//
			table.string('coupon_code');
			//
			table.integer('qty').unsigned();
			table.decimal('subtotal', 6, 2);
			table.decimal('discount', 6, 2);
			table.decimal('total', 8, 2);
			//
			table.boolean('is_payment').defaultTo(false);
			table.boolean('is_pickup').defaultTo(false);
			table.boolean('is_canceled').defaultTo(false);
			table.timestamps(false, true);
		})
	]);
};

exports.down = function(knex, Promise) {
	return Promise.all([
		knex.schema.dropTable('order')
	]);
};
