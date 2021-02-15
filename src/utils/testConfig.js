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
    byline: 'The only remote you will need',
    description: 'Lorem ipsum dolor sit, placeat.',
    discount: '0.15',
    image_url:
      'https://cnet3.cbsistatic.com/img/SB-Lc9lni02k-GQeFZlVGII6cpg=/1070x602/2010/08/03/57369690-bb77-11e2-8a8e-0291187978f3/33981226-2-1333-OVR-1.jpg',
    name: 'Logitech Singularity Universal Remote',
    price: '40.20',
    product_id: 2,
    quantity: 1,
    rating: null,
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
    address_line2: 'Apt 5',
    city: 'Big City',
    state: 'TX',
    postal_code: '39488',
    phone_number: '(555) 555-5555',
  };

  testData.cart = {
    items: {
      2: {
        byline: 'The only remote you will need',
        description: 'Lorem ipsum dolor sit, placeat.',
        discount: '0.15',
        image_url:
          'https://cnet3.cbsistatic.com/img/SB-Lc9lni02k-GQeFZlVGII6cpg=/1070x602/2010/08/03/57369690-bb77-11e2-8a8e-0291187978f3/33981226-2-1333-OVR-1.jpg',
        name: 'Logitech Singularity Universal Remote',
        price: '40.20',
        product_id: 2,
        quantity: 1,
        rating: null,
      },
    },
    numCartItems: 1,
    subtotal: '34.17',
  };

  // mock return from /order/:id
  testData.orderGet = {
    customer: 1,
    customer_info: {
      first_name: 'Test',
      last_name: 'User',
      email: 'foo@gmail.com',
      address: '123 Main St',
      address_line2: '',
      city: 'Big City',
      state: 'TX',
      postal_code: '39488',
      phone_number: '(555) 555-5555',
    },

    discount: null,
    items: [
      { 0: { order_id: 2, product_id: 6, quantity: 1 } },
      { 1: { order_id: 2, product_id: 8, quantity: 1 } },
    ],

    order_date: '2021-02-05T08:00:00.000Z',
    order_id: 2,
    shipping_address: null,
    shipping_cost: '12.00',
    shipping_method: {
      details: { cost: '12.00', name: 'USPS ground shipping (3-7 days)' },
      shipping_method: 'usps_ground',
    },

    status: 'Pending',
    subtotal: '784.16',
    tax: '66.65',
    total: '862.81',
    total_items_quantity: 2,
    tracking_number: null,
  };

  TEST_DATA.shippingMethods = {
    usps_ground: {
      cost: '12.00',
      name: 'USPS ground shipping (3-7 days)',
    },
    usps_priority: {
      cost: '16.00',
      name: 'USPS priority shipping (2-4 days)',
    },
    usps_next_day: {
      cost: '25.00',
      name: 'USPS next day delivery (1 day)',
    },
    ups_ground: {
      cost: '16.00',
      name: 'UPS ground shipping (3-6 days)',
    },
    ups_2nd_day: {
      cost: '20.00',
      name: 'UPS second day delivery (2 days)',
    },
    ups_overnight: {
      cost: '28.00',
      name: 'UPS overnight delivery (1 day)',
    },
  };
};
