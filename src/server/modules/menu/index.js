import DataLoader from 'dataloader';

import Menu from './sql';
import schema from './schema.graphql';
import createResolvers from './resolvers';

import Feature from '../connector';

export default new Feature({
  schema,
  createResolversFunc: createResolvers,
  createContextFunc: () => {
    const menu = new Menu();

    return {
      Menu: menu,
      loaders: {
        getReviewsForMenuIds: new DataLoader(menu.getReviewsForMenuIds),
        getCook: new DataLoader(menu.getCook),
        getCategory: new DataLoader(menu.getCategory),
        getAppointmentsForMenuId: new DataLoader(menu.getAppointmentsForMenuId),
        getPaymentsForMenuId: new DataLoader(menu.getPaymentsForMenuId),
        getPricesForMenuId: new DataLoader(menu.getPricesForMenuId),
        getSchedulesForMenuId: new DataLoader(menu.getSchedulesForMenuId),
        getTagsForMenuId: new DataLoader(menu.getTagsForMenuId)
      }
    };
  }
});
