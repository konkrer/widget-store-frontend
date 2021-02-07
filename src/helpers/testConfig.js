/** Test data setup/teardown helper hooks */

export const TEST_DATA = {};

export const populateTestDataHook = testData => {
  testData.product = {
    byline: 'Latest generation smart televison 2021',
    date_added: '2020-12-29T08:00:00.000Z',
    description:
      'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nihil, voluptates enim nam voluptatum, quia doloribus quis sequi, porro consequatur excepturi eos error voluptas nobis modi atque magni commodi amet placeat.',
    discount: '0.00',
    image_url:
      'https://www.lg.com/sg/images/tvs/md05271244/gallery/LG-43LH600T-L.jpg',
    name: 'Samsung XG-900 55 inch LCD TV',
    price: '400.40',
    product_id: 1,
    quantity: 100,
    rating: null,
  };

  testData.product2 = {
    byline: 'A good remote.',
    discount: '0.15',
    image_url:
      'https://www.lg.com/sg/images/tvs/md05271244/gallery/LG-43LH600T-L.jpg',
    name: 'Logitech Singularity Universal Remote',
    price: '40.20',
    product_id: 2,
    rating: null,
    quantity: 1,
  };

  testData.userProfileData = {
    data: {
      user: {
        user_id: 1,
        username: 'widgetLord',
        email: 'foo@gmail.com',
        first_name: 'bob',
        last_name: 'bobert',
        address: '123 Hill Ave.',
        address_line2: null,
        city: 'Big City',
        state: 'Texas',
        postal_code: '33333',
        phone_number: null,
        avatar_url: null,
        orders: [
          {
            order_id: 1,
            order_date: '2021-01-24T08:00:00.000Z',
            status: 'Pending',
          },
        ],
      },
    },
  };

  testData.CustomerInfoFormsValues = {
    first_name: 'Test',
    last_name: 'User',
    email: 'foo@gmail.com',
    address: '123 Main St',
    address_line2: '',
    city: 'Big City',
    state: 'TX',
    postal_code: '39488',
    phone_number: '(555) 555-5555',
    set_default: false,
  };

  testData.cart = {
    items: {
      2: {
        byline: 'The only remote you will need',
        date_added: '2021-01-24T08:00:00.000Z',
        description: 'Lorem ipsum dolor sit, placeat.',
        discount: '0.15',
        image_url:
          'https://cnet3.cbsistatic.com/img/SB-Lc9lni02k-GQeFZlVGII6cpg=/1070x602/2010/08/03/57369690-bb77-11e2-8a8e-0291187978f3/33981226-2-1333-OVR-1.jpg',
        name: 'Logitech Singularity Universal Remote',
        price: '40.20',
        product_id: 2,
        quantity: 2,
        rating: null,
      },
    },
    numCartItems: 1,
    subtotal: '34.17',
  };
};
