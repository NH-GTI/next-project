// app/api/order/route.ts

import { fetchDataFromDB } from '@/app/lib/data';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log('Products from order api', body);

  const client = await fetchDataFromDB();

  const {
    products,
    orderCode,
    customerID,
    userID,
    state,
    totalDiscount,
    totalPrice,
  } = body;

  try {
    await client.query('BEGIN');

    // Insert the order
    const orderResult = await client.query(
      `INSERT INTO orders (reference, id_customer, id_user, state, total_discount, total_price)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id`,
      [orderCode, customerID, userID, state, totalDiscount, totalPrice],
    );

    const orderID = orderResult.rows[0].id;

    console.log('Products from order api', products);

    // Insert each order line
    const orderLinesPromises = products.map(
      (product: {
        id: any;
        designation: any;
        quantity: any;
        price: any;
        discount: any;
        reference: any;
      }) => {
        return client.query(
          `INSERT INTO order_lines (id_order, id_product, product_designation, quantity, product_price, discount, product_reference)
        VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            orderID,
            product.id,
            product.designation,
            product.quantity,
            product.price,
            product.discount,
            product.reference,
          ],
        );
      },
    );

    await Promise.all(orderLinesPromises);

    await client.query('COMMIT');
    client.release();

    return NextResponse.json({ message: 'Order created successfully' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Database Error:', err);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 },
    );
  }
}
