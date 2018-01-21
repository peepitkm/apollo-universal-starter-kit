import { expect } from 'chai';
import { step } from 'mocha-steps';

import { getApollo } from '../../testHelpers/integrationSetup';
import FOODS_QUERY from '../../../client/modules/food/graphql/FoodsQuery.graphql';
import FOOD_QUERY from '../../../client/modules/food/graphql/FoodQuery.graphql';
import ADD_FOOD from '../../../client/modules/food/graphql/AddFood.graphql';
import EDIT_FOOD from '../../../client/modules/food/graphql/EditFood.graphql';
import DELETE_FOOD from '../../../client/modules/food/graphql/DeleteFood.graphql';
import FOODS_SUBSCRIPTION from '../../../client/modules/food/graphql/FoodsSubscription.graphql';

describe('Food and reviews example API works', () => {
  let apollo;

  before(() => {
    apollo = getApollo();
  });

  step('Query food list works', async () => {
    let result = await apollo.query({
      query: FOODS_QUERY,
      variables: { limit: 1, after: 0 }
    });

    expect(result.data).to.deep.equal({
      foods: {
        totalCount: 20,
        edges: [
          {
            cursor: 20,
            node: {
              id: 20,
              title: 'Food title 20',
              content: 'Food content 20',
              __typename: 'Food'
            },
            __typename: 'FoodEdges'
          }
        ],
        pageInfo: {
          endCursor: 20,
          hasNextPage: true,
          __typename: 'FoodPageInfo'
        },
        __typename: 'Foods'
      }
    });
  });

  step('Query single food with reviews works', async () => {
    let result = await apollo.query({ query: FOOD_QUERY, variables: { id: 1 } });

    expect(result.data).to.deep.equal({
      food: {
        id: 1,
        title: 'Food title 1',
        content: 'Food content 1',
        __typename: 'Food',
        reviews: [
          {
            id: 1,
            content: 'Review title 1 for food 1',
            __typename: 'Review'
          },
          {
            id: 2,
            content: 'Review title 2 for food 1',
            __typename: 'Review'
          }
        ]
      }
    });
  });

  step('Publishes food on add', done => {
    apollo.mutate({
      mutation: ADD_FOOD,
      variables: {
        input: {
          title: 'New food 1',
          content: 'New food content 1'
        }
      }
    });

    let subscription;

    subscription = apollo
      .subscribe({
        query: FOODS_SUBSCRIPTION,
        variables: { endCursor: 10 }
      })
      .subscribe({
        next(data) {
          expect(data).to.deep.equal({
            data: {
              foodsUpdated: {
                mutation: 'CREATED',
                node: {
                  id: 21,
                  title: 'New food 1',
                  content: 'New food content 1',
                  __typename: 'Food'
                },
                __typename: 'UpdateFoodPayload'
              }
            }
          });
          subscription.unsubscribe();
          done();
        }
      });
  });

  step('Adding food works', async () => {
    let result = await apollo.query({
      query: FOODS_QUERY,
      variables: { limit: 1, after: 0 },
      fetchPolicy: 'network-only'
    });
    expect(result.data.foods).to.have.property('totalCount', 21);
    expect(result.data.foods).to.have.nested.property('edges[0].node.title', 'New food 1');
    expect(result.data.foods).to.have.nested.property('edges[0].node.content', 'New food content 1');
  });

  step('Publishes food on update', done => {
    apollo.mutate({
      mutation: EDIT_FOOD,
      variables: {
        input: {
          id: 21,
          title: 'New food 2',
          content: 'New food content 2'
        }
      }
    });

    let subscription;

    subscription = apollo
      .subscribe({
        query: FOODS_SUBSCRIPTION,
        variables: { endCursor: 10 }
      })
      .subscribe({
        next(data) {
          expect(data).to.deep.equal({
            data: {
              foodsUpdated: {
                mutation: 'UPDATED',
                node: {
                  id: 21,
                  title: 'New food 2',
                  content: 'New food content 2',
                  __typename: 'Food'
                },
                __typename: 'UpdateFoodPayload'
              }
            }
          });
          subscription.unsubscribe();
          done();
        }
      });
  });

  step('Updating food works', async () => {
    let result = await apollo.query({
      query: FOODS_QUERY,
      variables: { limit: 1, after: 0 },
      fetchPolicy: 'network-only'
    });
    expect(result.data.foods).to.have.property('totalCount', 21);
    expect(result.data.foods).to.have.nested.property('edges[0].node.title', 'New food 2');
    expect(result.data.foods).to.have.nested.property('edges[0].node.content', 'New food content 2');
  });

  step('Publishes food on removal', done => {
    apollo.mutate({
      mutation: DELETE_FOOD,
      variables: { id: '21' }
    });

    let subscription;

    subscription = apollo
      .subscribe({
        query: FOODS_SUBSCRIPTION,
        variables: { endCursor: 10 }
      })
      .subscribe({
        next(data) {
          expect(data).to.deep.equal({
            data: {
              foodsUpdated: {
                mutation: 'DELETED',
                node: {
                  id: 21,
                  title: 'New food 2',
                  content: 'New food content 2',
                  __typename: 'Food'
                },
                __typename: 'UpdateFoodPayload'
              }
            }
          });
          subscription.unsubscribe();
          done();
        }
      });
  });

  step('Deleting food works', async () => {
    let result = await apollo.query({
      query: FOODS_QUERY,
      variables: { limit: 2, after: 0 },
      fetchPolicy: 'network-only'
    });
    expect(result.data.foods).to.have.property('totalCount', 20);
    expect(result.data.foods).to.have.nested.property('edges[0].node.title', 'Food title 20');
    expect(result.data.foods).to.have.nested.property('edges[0].node.content', 'Food content 20');
  });
});
