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
        getReviewsForMenuIds: new DataLoader(menu.getReviewsForMenuIds)
      }
    };
  }
});
