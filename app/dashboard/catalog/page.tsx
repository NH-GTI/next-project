import {
  fetchCustomers,
  fetchProducts,
  fetchCustomerProduct,
} from '@/app/lib/data';
import ProductContainer from './productContainer';
import { Product, Customer, CustomerProduct } from '@/app/lib/definitions';
import ClientContainer from './customerContainer';

export default async function Page() {
  const products: Product[] = await fetchProducts();
  const customerProduct: CustomerProduct[] = await fetchCustomerProduct();
  const customers: Customer[] = await fetchCustomers();

  return (
    <div>
      <ClientContainer customers={customers} />
      <ProductContainer products={products} customerProduct={customerProduct} />
    </div>
  );
}
