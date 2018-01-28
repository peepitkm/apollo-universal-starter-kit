import bcrypt from 'bcryptjs';
import { truncateTables } from '../../sql/helpers';

export async function seed(knex, Promise) {
  await truncateTables(knex, Promise, ['user_profile', 'cook_profile']);

  var user_id = await knex('user')
    .returning('id')
    .insert({
      username: 'peepitkm',
      email: 'peepitkm@example.com',
      password: await bcrypt.hash('peepitkm', 12),
      role: 'user',
      is_active: true
    });

  await knex('user_profile')
    .returning('id')
    .insert({
      user_id: user_id,
      name: 'peepitkm',
      first_name: 'Pornpat',
      last_name: 'Paethong',
      genger: 'M',
      birthdate: '1992-08-01',
      about: 'I am a good boy.',
      rating: 7.5,
      balance: 0.0,
      point: 100
    });

  await knex('cook_profile')
    .returning('id')
    .insert({
      user_id: user_id,
      name: 'peepitkm',
      about: 'I am a good cooking.',
      province_id: 1,
      district_id: 1,
      subdistrict_id: 1,
      menus: 10,
      likes: 100,
      follows: 100,
      rating: 7.5,
      balance: 0.0,
      point: 100
      is_active: true,
      is_official: true,
      last_activity_at: now(),
      last_sale_at: now()
    });
}
