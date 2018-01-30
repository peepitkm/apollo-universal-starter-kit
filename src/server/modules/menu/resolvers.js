import { withFilter } from 'graphql-subscriptions';

const MENU_SUBSCRIPTION = 'menu_subscription';
const MENUS_SUBSCRIPTION = 'menus_subscription';
const REVIEW_SUBSCRIPTION = 'review_subscription';

export default pubsub => ({
  Query: {
    async menus(obj, { limit, after }, context) {
      let edgesArray = [];
      let menus = await context.Menu.menusPagination(limit, after);

      menus.map(menu => {
        edgesArray.push({
          cursor: menu.id,
          node: {
            id: menu.id,
            title: menu.title
          }
        });
      });

      const endCursor = edgesArray.length > 0 ? edgesArray[edgesArray.length - 1].cursor : 0;

      const values = await Promise.all([context.Menu.getTotal(), context.Menu.getNextPageFlag(endCursor)]);

      return {
        totalCount: values[0].count,
        edges: edgesArray,
        pageInfo: {
          endCursor: endCursor,
          hasNextPage: values[1].count > 0
        }
      };
    },
    menu(obj, { id }, context) {
      return context.Menu.menu(id);
    }
  },
  Menu: {
    reviews({ id }, args, context) {
      return context.loaders.getReviewsForMenuIds.load(id);
    },
    cook({ cook_id }, args, context) {
      return context.loaders.getCook.load(cook_id);
    },
    category({ category_id }, args, context) {
      return context.loaders.getCategory.load(category);
    }
  },
  Mutation: {
    async addMenu(obj, { input }, context) {
      const [id] = await context.Menu.addMenu(input);
      const menu = await context.Menu.menu(id);
      // publish for menu list
      pubsub.publish(MENUS_SUBSCRIPTION, {
        menusUpdated: {
          mutation: 'CREATED',
          id,
          node: menu
        }
      });
      return menu;
    },
    async deleteMenu(obj, { id }, context) {
      const menu = await context.Menu.menu(id);
      const isDeleted = await context.Menu.deleteMenu(id);
      if (isDeleted) {
        // publish for menu list
        pubsub.publish(MENUS_SUBSCRIPTION, {
          menusUpdated: {
            mutation: 'DELETED',
            id,
            node: menu
          }
        });
        return { id: menu.id };
      } else {
        return { id: null };
      }
    },
    async editMenu(obj, { input }, context) {
      await context.Menu.editMenu(input);
      const menu = await context.Menu.menu(input.id);
      // publish for menu list
      pubsub.publish(MENUS_SUBSCRIPTION, {
        menusUpdated: {
          mutation: 'UPDATED',
          id: menu.id,
          node: menu
        }
      });
      // publish for edit menu page
      pubsub.publish(MENU_SUBSCRIPTION, { menuUpdated: menu });
      return menu;
    },
    async addReview(obj, { input }, context) {
      const [id] = await context.Menu.addReview(input);
      const review = await context.Menu.getReview(id);
      // publish for edit menu page
      pubsub.publish(REVIEW_SUBSCRIPTION, {
        reviewUpdated: {
          mutation: 'CREATED',
          id: review.id,
          menuId: input.menuId,
          node: review
        }
      });
      return review;
    },
    async deleteReview(obj, { input: { id, menuId } }, context) {
      await context.Menu.deleteReview(id);
      // publish for edit menu page
      pubsub.publish(REVIEW_SUBSCRIPTION, {
        reviewUpdated: {
          mutation: 'DELETED',
          id,
          menuId,
          node: null
        }
      });
      return { id };
    },
    async editReview(obj, { input }, context) {
      await context.Menu.editReview(input);
      const review = await context.Menu.getReview(input.id);
      // publish for edit menu page
      pubsub.publish(REVIEW_SUBSCRIPTION, {
        reviewUpdated: {
          mutation: 'UPDATED',
          id: input.id,
          menuId: input.menuId,
          node: review
        }
      });
      return review;
    }
  },
  Subscription: {
    menuUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(MENU_SUBSCRIPTION),
        (payload, variables) => {
          return payload.menuUpdated.id === variables.id;
        }
      )
    },
    menusUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(MENUS_SUBSCRIPTION),
        (payload, variables) => {
          return variables.endCursor <= payload.menusUpdated.id;
        }
      )
    },
    reviewUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(REVIEW_SUBSCRIPTION),
        (payload, variables) => {
          return payload.reviewUpdated.menuId === variables.menuId;
        }
      )
    }
  }
});
