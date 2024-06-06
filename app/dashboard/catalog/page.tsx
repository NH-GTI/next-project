import ClientSideComponent from './clientSideComponent';
import {
  fetchCustomers,
  fetchProducts,
  fetchCustomerProduct,
} from '@/app/lib/data';

const ProductsPage = async () => {
  const initialProducts = await fetchProducts();
  const initialCustomers = await fetchCustomers();
  const customerProduct = await fetchCustomerProduct();

  return (
    <ClientSideComponent
      initialProducts={initialProducts}
      initialCustomers={initialCustomers}
      customerProduct={customerProduct}
    />
  );
};

export default ProductsPage;
