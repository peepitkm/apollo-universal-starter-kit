import { orderedFor } from '../../sql/helpers';
import knex from '../../sql/connector';

export default class Menu {
  menusPagination(limit, after) {
    let where = '';
    if (after > 0) {
      where = `id < ${after}`;
    }

    return knex
      .select('id', 'cook_id', 'category_id', 'title', 'description', 'rating', 'free_items', 'sale_items', 'is_active')
      .from('menu')
      .whereRaw(where)
      .orderBy('id', 'desc')
      .limit(limit);
  }

  async getReviewsForMenuIds(menuIds) {
    let res = await knex
      .select('id', 'content', 'menu_id AS menuId')
      .from('review')
      .whereIn('menu_id', menuIds);

    return orderedFor(res, menuIds, 'menuId', false);
  }

  getTotal() {
    return knex('menu')
      .countDistinct('id as count')
      .first();
  }

  getNextPageFlag(id) {
    return knex('menu')
      .countDistinct('id as count')
      .where('id', '<', id)
      .first();
  }

  menu(id) {
    return knex
      .select('id', 'cook_id', 'category_id', 'title', 'description', 'rating', 'free_items', 'sale_items', 'is_active')
      .from('menu')
      .where('id', '=', id)
      .first();
  }

  addMenu({ title, content }) {
    return knex('menu')
      .insert({ title, content })
      .returning('id');
  }

  deleteMenu(id) {
    return knex('menu')
      .where('id', '=', id)
      .del();
  }

  editMenu({ id, title, content }) {
    return knex('menu')
      .where('id', '=', id)
      .update({
        title: title,
        content: content
      });
  }

  addReview({ content, menuId }) {
    return knex('review')
      .insert({ content, menu_id: menuId })
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
