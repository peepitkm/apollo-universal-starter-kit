import DataLoader from 'dataloader';

import Food from './sql';
import schema from './schema.graphql';
import createResolvers from './resolvers';

import Feature from '../connector';

export default new Feature({
  schema,
  createResolversFunc: createResolvers,
  createContextFunc: () => {
    const food = new Food();

    return {
      Food: food,
      loaders: {
        getReviewsForPostIds: new DataLoader(post.getReviewsForFoodIds)
      }
    };
  }
});
