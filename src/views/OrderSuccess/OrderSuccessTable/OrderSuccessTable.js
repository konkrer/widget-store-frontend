import Table from 'react-bootstrap/Table';

const OrderSuccessTable = ({ order, id }) => (
  <Table variant="dark" className="rounded">
    <tbody>
      <tr>
        <th scope="row" className="border-top-0">
          Order Id
        </th>
        <td className="border-top-0">{id}</td>
      </tr>
      {order && (
        <>
          <tr>
            <th scope="row">Total</th>
            <td>${order.total}</td>
          </tr>
          <tr>
            <th scope="row">Order Date</th>
            <td>{order.order_date.match(/(\d{4}-\d{2}-\d{2})/)[1]}</td>
          </tr>
          <tr>
            <th scope="row">Shipping</th>
            <td>{order.shipping_method.details.name}</td>
          </tr>
          <tr>
            <th scope="row">Ordered By</th>
            <td>{`${order.customer_info.first_name} ${order.customer_info.last_name}`}</td>
          </tr>
          {order.shipping_address && (
            <tr>
              <th scope="row">Shipped To</th>
              <td>{`${order.shipping_address.first_name} ${order.shipping_address.last_name}`}</td>
            </tr>
          )}
        </>
      )}
    </tbody>
  </Table>
);

export default OrderSuccessTable;
