import { truncateTables } from '../../sql/helpers';

export async function seed(knex, Promise) {
  await truncateTables(knex, Promise, ['category']);

  await knex('category')
    .insert([
      {title: 'Main Dishs', description: 'Main Dishs Description', is_active: true},
      {title: 'Soup', description: 'Soup Description', is_active: true},
      {title: 'BBQ', description: 'BBQ Description', is_active: true},
      {title: 'Vegetable Sides', description: 'Vegetable Sides Description', is_active: true},
      {title: 'Drinks', description: 'Drinks Description', is_active: true},
      {title: 'Cookies', description: 'Cookies Description', is_active: true},
      {title: 'Cakes', description: 'Cakes Description', is_active: true},
    ]);

}
