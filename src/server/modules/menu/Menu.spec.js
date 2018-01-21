import { expect } from 'chai';
import { step } from 'mocha-steps';

import { getApollo } from '../../testHelpers/integrationSetup';
import MENUS_QUERY from '../../../client/modules/menu/graphql/MenusQuery.graphql';
import MENU_QUERY from '../../../client/modules/menu/graphql/MenuQuery.graphql';
import ADD_MENU from '../../../client/modules/menu/graphql/AddMenu.graphql';
import EDIT_MENU from '../../../client/modules/menu/graphql/EditMenu.graphql';
import DELETE_MENU from '../../../client/modules/menu/graphql/DeleteMenu.graphql';
import MENUS_SUBSCRIPTION from '../../../client/modules/menu/graphql/MenusSubscription.graphql';

describe('Menu and reviews example API works', () => {
  let apollo;

  before(() => {
    apollo = getApollo();
  });

  step('Query menu list works', async () => {
    let result = await apollo.query({
      query: MENUS_QUERY,
      variables: { limit: 1, after: 0 }
    });

    expect(result.data).to.deep.equal({
      menus: {
        totalCount: 20,
        edges: [
          {
            cursor: 20,
            node: {
              id: 20,
              title: 'Menu title 20',
              content: 'Menu content 20',
              __typename: 'Menu'
            },
            __typename: 'MenuEdges'
          }
        ],
        pageInfo: {
          endCursor: 20,
          hasNextPage: true,
          __typename: 'MenuPageInfo'
        },
        __typename: 'Menus'
      }
    });
  });

  step('Query single menu with reviews works', async () => {
    let result = await apollo.query({ query: MENU_QUERY, variables: { id: 1 } });

    expect(result.data).to.deep.equal({
      menu: {
        id: 1,
        title: 'Menu title 1',
        content: 'Menu content 1',
        __typename: 'Menu',
        reviews: [
          {
            id: 1,
            content: 'Review title 1 for menu 1',
            __typename: 'Review'
          },
          {
            id: 2,
            content: 'Review title 2 for menu 1',
            __typename: 'Review'
          }
        ]
      }
    });
  });

  step('Publishes menu on add', done => {
    apollo.mutate({
      mutation: ADD_MENU,
      variables: {
        input: {
          title: 'New menu 1',
          content: 'New menu content 1'
        }
      }
    });

    let subscription;

    subscription = apollo
      .subscribe({
        query: MENUS_SUBSCRIPTION,
        variables: { endCursor: 10 }
      })
      .subscribe({
        next(data) {
          expect(data).to.deep.equal({
            data: {
              menusUpdated: {
                mutation: 'CREATED',
                node: {
                  id: 21,
                  title: 'New menu 1',
                  content: 'New menu content 1',
                  __typename: 'Menu'
                },
                __typename: 'UpdateMenuPayload'
              }
            }
          });
          subscription.unsubscribe();
          done();
        }
      });
  });

  step('Adding menu works', async () => {
    let result = await apollo.query({
      query: MENUS_QUERY,
      variables: { limit: 1, after: 0 },
      fetchPolicy: 'network-only'
    });
    expect(result.data.menus).to.have.property('totalCount', 21);
    expect(result.data.menus).to.have.nested.property('edges[0].node.title', 'New menu 1');
    expect(result.data.menus).to.have.nested.property('edges[0].node.content', 'New menu content 1');
  });

  step('Publishes menu on update', done => {
    apollo.mutate({
      mutation: EDIT_MENU,
      variables: {
        input: {
          id: 21,
          title: 'New menu 2',
          content: 'New menu content 2'
        }
      }
    });

    let subscription;

    subscription = apollo
      .subscribe({
        query: MENUS_SUBSCRIPTION,
        variables: { endCursor: 10 }
      })
      .subscribe({
        next(data) {
          expect(data).to.deep.equal({
            data: {
              menusUpdated: {
                mutation: 'UPDATED',
                node: {
                  id: 21,
                  title: 'New menu 2',
                  content: 'New menu content 2',
                  __typename: 'Menu'
                },
                __typename: 'UpdateMenuPayload'
              }
            }
          });
          subscription.unsubscribe();
          done();
        }
      });
  });

  step('Updating menu works', async () => {
    let result = await apollo.query({
      query: MENUS_QUERY,
      variables: { limit: 1, after: 0 },
      fetchPolicy: 'network-only'
    });
    expect(result.data.menus).to.have.property('totalCount', 21);
    expect(result.data.menus).to.have.nested.property('edges[0].node.title', 'New menu 2');
    expect(result.data.menus).to.have.nested.property('edges[0].node.content', 'New menu content 2');
  });

  step('Publishes menu on removal', done => {
    apollo.mutate({
      mutation: DELETE_MENU,
      variables: { id: '21' }
    });

    let subscription;

    subscription = apollo
      .subscribe({
        query: MENUS_SUBSCRIPTION,
        variables: { endCursor: 10 }
      })
      .subscribe({
        next(data) {
          expect(data).to.deep.equal({
            data: {
              menusUpdated: {
                mutation: 'DELETED',
                node: {
                  id: 21,
                  title: 'New menu 2',
                  content: 'New menu content 2',
                  __typename: 'Menu'
                },
                __typename: 'UpdateMenuPayload'
              }
            }
          });
          subscription.unsubscribe();
          done();
        }
      });
  });

  step('Deleting menu works', async () => {
    let result = await apollo.query({
      query: MENUS_QUERY,
      variables: { limit: 2, after: 0 },
      fetchPolicy: 'network-only'
    });
    expect(result.data.menus).to.have.property('totalCount', 20);
    expect(result.data.menus).to.have.nested.property('edges[0].node.title', 'Menu title 20');
    expect(result.data.menus).to.have.nested.property('edges[0].node.content', 'Menu content 20');
  });
});
