import { fetchDataFromDB } from '../../scripts/connect.mjs';
import { unstable_noStore as noStore } from 'next/cache';
import {
  User,
  Revenue,
  Product,
  Customer,
  CustomerProduct,
  Order,
  QRCode,
} from './definitions';
import { formatCurrency } from './utils';

export async function fetchUser(email: FormDataEntryValue | null) {
  const client = await fetchDataFromDB();

  try {
    const user = await client.query<User>(
      `SELECT * FROM users WHERE email=$1`,
      [email],
    );

    client.release();
    return user.rows[0] as User;
  } catch (error) {}
}

export async function fetchRevenue() {
  // Add noStore() here to prevent the response from being cached.
  // This is equivalent to in fetch(..., {cache: 'no-store'}).
  noStore();
  try {
    const client = await fetchDataFromDB();
    const data = await client.query<Revenue>(`SELECT * FROM revenue`);

    client.release();

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchLatestInvoices() {
  const client = await fetchDataFromDB();
  try {
    const data = await client.query(`
      SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
      LIMIT 5`);

    const latestInvoices = data.rows.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
    client.release();

    return latestInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

export async function fetchCardData() {
  noStore();
  const client = await fetchDataFromDB();
  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    const invoiceCountPromise = client.query(`SELECT COUNT(*) FROM invoices`);
    const customerCountPromise = client.query(`SELECT COUNT(*) FROM customers`);
    const invoiceStatusPromise = client.query(`SELECT
         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
         FROM invoices`);

    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);

    const numberOfInvoices = Number(data[0].rows[0].count ?? '0');
    const numberOfCustomers = Number(data[1].rows[0].count ?? '0');
    const totalPaidInvoices = formatCurrency(data[2].rows[0].paid ?? '0');
    const totalPendingInvoices = formatCurrency(data[2].rows[0].pending ?? '0');
    client.release();

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  noStore();
  const client = await fetchDataFromDB();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await client.query(`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `);
    client.release();

    return invoices.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

export async function fetchInvoicesPages(query: string) {
  noStore();
  const client = await fetchDataFromDB();
  try {
    const count = await client.query(`SELECT COUNT(*)
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      invoices.amount::text ILIKE ${`%${query}%`} OR
      invoices.date::text ILIKE ${`%${query}%`} OR
      invoices.status ILIKE ${`%${query}%`}
  `);

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    client.release();

    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchInvoiceById(id: string) {
  noStore();
  const client = await fetchDataFromDB();
  try {
    const data = await client.query(`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = ${id};
    `);

    const invoice = data.rows.map((invoice) => ({
      ...invoice,
      // Convert amount from cents to dollars
      amount: invoice.amount / 100,
    }));
    client.release();

    return invoice[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

export async function fetchFilteredCustomers(query: string) {
  noStore();
  const client = await fetchDataFromDB();
  try {
    const data = await client.query(`
		SELECT
		  customers.id,
		  customers.name,
		  customers.email,
		  customers.image_url,
		  COUNT(invoices.id) AS total_invoices,
		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
		FROM customers
		LEFT JOIN invoices ON customers.id = invoices.customer_id
		WHERE
		  customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`}
		GROUP BY customers.id, customers.name, customers.email, customers.image_url
		ORDER BY customers.name ASC
	  `);

    const customers = data.rows.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));
    client.release();

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}

export async function getUser(email: string) {
  const client = await fetchDataFromDB();
  try {
    const user = await client.query(`SELECT * FROM users WHERE email = $1`, [
      email,
    ]);
    return user.rows[0] as User;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export async function fetchProducts(): Promise<Product[]> {
  const client = await fetchDataFromDB();

  try {
    const data = await client.query(`
		SELECT
		  *
		FROM products
    LIMIT 500
	  `);
    client.release();

    return data.rows;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}

export async function fetchCustomers(): Promise<Customer[]> {
  const client = await fetchDataFromDB();

  try {
    const data = await client.query(`
		SELECT
		  *
		FROM customers
	  `);
    client.release();

    return data.rows;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}

export async function fetchCustomerById(code: string): Promise<Customer> {
  const client = await fetchDataFromDB();

  try {
    const data = await client.query(
      `
		SELECT
		  *
		FROM customers
    Where code = $1
	  `,
      [code],
    );
    client.release();
    console.log(data.rows[0]);

    return data.rows[0];
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}

export async function fetchCustomerProduct(): Promise<CustomerProduct[]> {
  const client = await fetchDataFromDB();

  try {
    const data = await client.query(`
		SELECT
		  *
		FROM customer_product
	  `);
    client.release();

    return data.rows;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}

export async function fetchOrders(): Promise<Order[]> {
  const client = await fetchDataFromDB();

  try {
    const data = await client.query(`
		SELECT
		  *
		FROM orders 
	  `);
    client.release();

    return data.rows;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}

export async function sendOrder(products: Product) {
  const client = await fetchDataFromDB();

  try {
    const data = await client.query(`
		INSERT INTO order (reference, id_customer, id_user, state, total_discount, total_price)
	  `);
    client.release();

    return data.rows;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}

export async function fetchQRCode(): Promise<QRCode[]> {
  const client = await fetchDataFromDB();

  try {
    const data = await client.query(`
        SELECT * from qrcode
      `);
    client.release();

    return data.rows;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch qrcode table.');
  }
}

export async function createQRCode(qrcode: QRCode) {
  const client = await fetchDataFromDB();

  try {
    const data = await client.query(
      `
        INSERT INTO qrcode (name, url, img, file_name, file_size, created_at, updated_at, is_file, created_by, updated_by) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      `,
      [],
    );
    client.release();

    return data.rows;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch qrcode table.');
  }
}

export { fetchDataFromDB };
