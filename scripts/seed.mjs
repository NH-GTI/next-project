import pkg from 'pg';
import { fetchDataFromDB } from './connect.mjs';
const { Pool } = pkg;
let conn;

if (!conn) {
  conn = new Pool({
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    database: process.env.POSTGRES_DATABASE,
  });
}

const {
  invoices,
  customers,
  revenue,
  users,
  products,
  orders,
  order_lines,
  customer_product,
} = await import('../app/lib/placeholder-data.js');

const bcrypt = await import('bcrypt');

async function seedUsers(client) {
  try {
    await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    // Create the "users" table if it doesn't exist
    const createTable = await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );
    `);

    console.log(`Created "users" table`);

    // Insert data into the "users" table
    const insertedUsers = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        console.log(user.id, user.name, user.email, hashedPassword);
        return client.query(
          `
        INSERT INTO users (id, name, email, password)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (id) DO NOTHING;`,
          [user.id, user.name, user.email, hashedPassword],
        );
      }),
    );

    console.log(`Seeded ${insertedUsers.length} users`);

    return {
      createTable,
      users: insertedUsers,
    };
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}

async function seedInvoices(client) {
  try {
    await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // Create the "invoices" table if it doesn't exist
    const createTable = await client.query(`
    CREATE TABLE IF NOT EXISTS invoices (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    customer_id UUID NOT NULL,
    amount INT NOT NULL,
    status VARCHAR(255) NOT NULL,
    date DATE NOT NULL
  );
`);

    console.log(`Created "invoices" table`);

    // Insert data into the "invoices" table
    const insertedInvoices = await Promise.all(
      invoices.map((invoice) =>
        client.query(
          `
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (id) DO NOTHING;`,
          [invoice.customer_id, invoice.amount, invoice.status, invoice.date],
        ),
      ),
    );

    console.log(`Seeded ${insertedInvoices.length} invoices`);

    return {
      createTable,
      invoices: insertedInvoices,
    };
  } catch (error) {
    console.error('Error seeding invoices:', error);
    throw error;
  }
}

async function seedCustomers(client) {
  try {
    await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // Create the "customers" table if it doesn't exist
    const createTable = await client.query(`
      CREATE TABLE IF NOT EXISTS customers (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        image_url VARCHAR(255) NOT NULL
      );
    `);

    console.log(`Created "customers" table`);

    // Insert data into the "customers" table
    const insertedCustomers = await Promise.all(
      customers.map((customer) =>
        client.query(
          `
        INSERT INTO customers (id, name, email, image_url)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (id) DO NOTHING;`,
          [customer.id, customer.name, customer.email, customer.image_url],
        ),
      ),
    );

    console.log(`Seeded ${insertedCustomers.length} customers`);

    return {
      createTable,
      customers: insertedCustomers,
    };
  } catch (error) {
    console.error('Error seeding customers:', error);
    throw error;
  }
}

async function seedRevenue(client) {
  try {
    // Create the "revenue" table if it doesn't exist
    const createTable = await client.query(`
      CREATE TABLE IF NOT EXISTS revenue (
        month VARCHAR(4) NOT NULL UNIQUE,
        revenue INT NOT NULL
      );
    `);

    console.log(`Created "revenue" table`);

    // Insert data into the "revenue" table
    const insertedRevenue = await Promise.all(
      revenue.map((rev) =>
        client.query(
          `
        INSERT INTO revenue (month, revenue)
        VALUES ($1, $2)
        ON CONFLICT (month) DO NOTHING`,
          [rev.month, rev.revenue],
        ),
      ),
    );

    console.log(`Seeded ${insertedRevenue.length} revenue`);

    return {
      createTable,
      revenue: insertedRevenue,
    };
  } catch (error) {
    console.error('Error seeding revenue:', error);
    throw error;
  }
}

async function seedProducts(client) {
  try {
    await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    // Create the "users" table if it doesn't exist
    const createTable = await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        family INT NOT NULL, 
        brand INT NOT NULL,
        reference VARCHAR(20) NOT NULL,
        designation VARCHAR(250) NOT NULL,
        gencod VARCHAR(20) NOT NULL,
        pcb INT NOT NULL,
        mini INT NOT NULL,
        deee INT NULL,
        price FLOAT NOT NULL,
        customer INT NOT NULL
      );
    `);

    console.log(`Created "products" table`);

    // Insert data into the "productsd" table
    const insertedProducts = await Promise.all(
      products.map(async (product) => {
        console.log(
          product.family,
          product.brand,
          product.reference,
          product.designation,
          product.gencod,
          product.pcb,
          product.mini,
          product.deee,
          product.price,
          product.customer,
        );
        return client.query(
          `
        INSERT INTO products (family, brand, reference, designation, gencod, pcb, mini, deee, price, customer)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        ON CONFLICT (id) DO NOTHING;`,
          [
            product.family,
            product.brand,
            product.reference,
            product.designation,
            product.gencod,
            product.pcb,
            product.mini,
            product.deee,
            product.price,
            product.customer,
          ],
        );
      }),
    );

    console.log(`Seeded ${insertedProducts.length} products`);

    return {
      createTable,
      products: insertedProducts,
    };
  } catch (error) {
    console.error('Error seeding products:', error);
    throw error;
  }
}

async function seedOrders(client) {
  try {
    await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    // Create the "users" table if it doesn't exist
    const createTable = await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        reference VARCHAR(20) NOT NULL, 
        id_customer INT NOT NULL,
        id_user INT NOT NULL,
        state INT NOT NULL,
        total_discount FLOAT NOT NULL,
        total_price FLOAT NOT NULL,
        created_at DATE NOT NULL DEFAULT CURRENT_DATE,
        updated_at DATE NOT NULL DEFAULT CURRENT_DATE
      );
    `);

    // Insert data into the "products" table
    const insertedOrders = await Promise.all(
      orders.map(async (order) => {
        return client.query(
          `
        INSERT INTO orders (reference, id_customer, id_user, state, total_discount, total_price, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (id) DO NOTHING;`,
          [
            order.reference,
            order.id_customer,
            order.id_user,
            order.state,
            order.total_discount,
            order.total_price,
            order.created_at,
            order.updated_at,
          ],
        );
      }),
    );

    console.log(`Seeded ${insertedOrders.length} orders`);

    return {
      createTable,
      orders: insertedOrders,
    };
  } catch (error) {}
}

async function seedOrderLines(client) {
  try {
    await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    // Create the "users" table if it doesn't exist
    const createTable = await client.query(`
      CREATE TABLE IF NOT EXISTS order_lines (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        id_order VARCHAR(50) NOT NULL, 
        id_product VARCHAR(50) NOT NULL,
        product_designation VARCHAR(250) NOT NULL,
        quantity INT NOT NULL,
        product_price FLOAT NOT NULL,
        discount FLOAT NOT NULL,
        product_reference VARCHAR(50) NOT NULL,
        created_at DATE NOT NULL DEFAULT CURRENT_DATE,
        updated_at DATE NOT NULL DEFAULT CURRENT_DATE
      );
    `);

    console.log(order_lines);
    // Insert data into the "products" table
    const insertedOrderLines = await Promise.all(
      order_lines.map(async (line) => {
        return client.query(
          `
        INSERT INTO order_lines (id_order, id_product, product_designation, quantity, product_price, discount, product_reference)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (id) DO NOTHING;`,
          [
            line.id_order,
            line.id_product,
            line.product_designation,
            line.quantity,
            line.product_price,
            line.discount,
            line.product_reference,
          ],
        );
      }),
    );

    console.log(`Seeded ${insertedOrderLines.length} order lines`);

    return {
      createTable,
      order_lines: insertedOrderLines,
    };
  } catch (error) {}
}

async function seedCustomerProduct(client) {
  // console.log(customer_product);
  try {
    await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    // Create the "customer_product" table if it doesn't exist
    const createTable = await client.query(`
      CREATE TABLE IF NOT EXISTS customer_product (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        id_customer VARCHAR(50) NOT NULL, 
        id_product VARCHAR(50) NOT NULL
      );
    `);

    // Insert data into the "customer_product" table
    const insertedCustomerProduct = await Promise.all(
      customer_product.map(async (line) => {
        console.log(line);
        return client.query(
          `
        INSERT INTO customer_product (id_customer, id_product)
        VALUES ($1, $2)
        ON CONFLICT (id) DO NOTHING;`,
          [line.id_customer, line.id_product],
        );
      }),
    );

    console.log(
      `Seeded ${insertedCustomerProduct.length} customer_product lines`,
    );

    return {
      createTable,
      customer_product: insertedCustomerProduct,
    };
  } catch (error) {}
}

async function main() {
  const client = await conn.connect();

  await seedUsers(client);
  // await seedCustomers(client);
  // await seedInvoices(client);
  // await seedRevenue(client);
  // await seedProducts(client);
  // await seedOrders(client);
  // await seedOrderLines(client);
  // await seedCustomerProduct(client);

  await client.end();
}

main().catch((err) => {
  console.error(
    'An error occurred while attempting to seed the database:',
    err,
  );
});
