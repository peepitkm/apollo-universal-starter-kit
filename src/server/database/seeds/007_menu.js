import { truncateTables } from '../../sql/helpers';

export async function seed(knex, Promise) {
  await truncateTables(knex, Promise, ['menu']);

  await knex('menu')
    .insert([
    {
      cook_id: 4,
      category_id: 1,
      title: '1st Menu of Main Dishs',
      description: 'This a 1st Menu of Main Dishs Description',
      rating: 1,
      free_items: 10,
      sale_items: 50,
      is_active: true
    },
    {
      cook_id: 4,
      category_id: 2,
      title: '2nd Menu of Soup',
      description: 'This a 2nd Menu of Soup Description',
      rating: 2,
      free_items: 1,
      sale_items: 10,
      is_active: true
    },
    {
      cook_id: 4,
      category_id: 1,
      title: '3rd Menu of Main Dishs',
      description: 'This a 3rd Menu of Main Dishs Description',
      rating: 3,
      free_items: 5,
      sale_items: 25,
      is_active: true
    },
    ]);

}
