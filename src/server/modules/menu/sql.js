import { orderedFor } from '../../sql/helpers';
import knex from '../../sql/connector';
import _ from 'lodash';

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

  async getCook(cookId) {
    let res = await knex
      .select('id', 'user_id', 'name', 'about', 'province_id', 'district_id', 'subdistrict_id', 'menus', 'likes', 'follows', 'rating', 'balance', 'point', 'is_active', 'is_official', 'last_activity_at', 'last_sale_at')
      .from('cook_profile')
      .whereIn('user_id', cookId);

    return res;
  }

  async getCategory(categoryId) {
    let res = await knex
      .select('id', 'title', 'description')
      .from('category')
      .whereIn('id', categoryId);

    return res;
  }

  async getAppointmentsForMenuId(menuId) {
    let res = await knex
      .from('menu_appointment')
      .whereIn('menu_id', menuId);

    return orderedFor(res, menuId, 'menu_id', false);
  }

  async getPaymentsForMenuId(menuId) {
    let res = await knex
      .from('menu_payment')
      .whereIn('menu_id', menuId);

    return orderedFor(res, menuId, 'menu_id', false);
  }

  async getPricesForMenuId(menuId) {
    let res = await knex
      .from('menu_price')
      .whereIn('menu_id', menuId);

    return orderedFor(res, menuId, 'menu_id', false);
  }

  async getSchedulesForMenuId(menuId) {
    let res = await knex
      .from('menu_schedule')
      .whereIn('menu_id', menuId);

    return orderedFor(res, menuId, 'menu_id', false);
  }

  async getTagsForMenuId(menuIds) {
    let res = await knex
      .select('id', 'name')
      .from('menu_tag')
      .join('menu', function() {
        this.on('menu.id', '=', 'menu_tag.tag_id')
      })
      .whereIn('menu_id', menuIds);

    return orderedFor(res, menuIds, 'menu_id', false);
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

  addMenu({cook_id, title, description, appointments, payments, prices, schedules, tags}) {
    return knex('menu')
      .insert({ cook_id, title, description })
      .returning('id')
      .then(function(response){
        if(appointments != null){
          appointments.map(function(object, index){
            object.menu_id = response[0];
          });
          return knex('menu_appointment').insert(appointments).then(function(){
            return response;
          });
        }else{
          return response;
        }
      })
      .then(function(response){
        if(payments != null){
          payments.map(function(object, index){
            object.menu_id = response[0];
          });
          return knex('menu_payment').insert(payments).then(function(){
            return response;
          });
        }else{
          return response;
        }
      })
      .then(function(response){
        if(prices != null){
          prices.map(function(object, index){
            object.menu_id = response[0];
          });
          return knex('menu_price').insert(prices).then(function(){
            return response;
          });
        }else{
          return response;
        }
      })
      .then(function(response){
        if(schedules != null){
          schedules.map(function(object, index){
            object.menu_id = response[0];
          });
          return knex('menu_schedule').insert(schedules).then(function(){
            return response;
          });
        }else{
          return response;
        }
      })
      .then(function(response){
        if(prices != null){
          prices.map(function(object, index){
            object.menu_id = response[0];
          });
          return knex('menu_price').insert(prices).then(function(){
            return response;
          });
        }else{
          return response;
        }
      })
      .then(function(response){
        if(tags != null){
          tags.map(function(object, index){
            object.menu_id = response[0];
          });
          return knex('menu_tag').insert(tags).then(function(){
            return response;
          });
        }else{
          return response;
        }
      });
  }

  // addMenu(menu) {
  //   console.log(menu);
  //   console.log('---');
  //   let id = knex('menu')
  //     .insert(menu)
  //     .returning('id');

  //   return id;
  // }

  deleteMenu(id) {
    return knex('menu')
      .where('id', '=', id)
      .del();
  }

  // editMenu(menu) {
  //   return knex('menu')
  //     .where('id', '=', menu.id)
  //     .update({
  //       title: menu.title,
  //       description: menu.description
  //     });
  // }

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
