import { orderedFor } from '../../sql/helpers';
import knex from '../../sql/connector';

export default class Post {
  foodsPagination(limit, after) {
    let where = '';
    if (after > 0) {
      where = `id < ${after}`;
    }

    return knex
      .select('id', 'title', 'content')
      .from('food')
      .whereRaw(where)
      .orderBy('id', 'desc')
      .limit(limit);
  }

  async getReviewsForPostIds(foodIds) {
    let res = await knex
      .select('id', 'content', 'food_id AS foodId')
      .from('review')
      .whereIn('food_id', foodIds);

    return orderedFor(res, foodIds, 'foodId', false);
  }

  getTotal() {
    return knex('food')
      .countDistinct('id as count')
      .first();
  }

  getNextPageFlag(id) {
    return knex('food')
      .countDistinct('id as count')
      .where('id', '<', id)
      .first();
  }

  food(id) {
    return knex
      .select('id', 'title', 'content')
      .from('food')
      .where('id', '=', id)
      .first();
  }

  addPost({ title, content }) {
    return knex('food')
      .insert({ title, content })
      .returning('id');
  }

  deletePost(id) {
    return knex('food')
      .where('id', '=', id)
      .del();
  }

  editPost({ id, title, content }) {
    return knex('food')
      .where('id', '=', id)
      .update({
        title: title,
        content: content
      });
  }

  addReview({ content, foodId }) {
    return knex('review')
      .insert({ content, food_id: foodId })
      .returning('id');
  }

  getReview(id) {
    return knex
      .select('id', 'content')
      .from('review')
      .where('id', '=', id)
      .first();
  }

  deleteReview(id) {
    return knex('review')
      .where('id', '=', id)
      .del();
  }

  editReview({ id, content }) {
    return knex('review')
      .where('id', '=', id)
      .update({
        content: content
      });
  }
}
