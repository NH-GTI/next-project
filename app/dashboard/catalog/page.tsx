import ClientSideComponent from './clientSideComponent';
import {
  fetchCustomers,
  fetchProducts,
  fetchCustomerProduct,
} from '@/app/lib/data';
import TopNav from '@/app/ui/dashboard/topnav';

const ProductsPage = async () => {
  const initialProducts = await fetchProducts();
  const initialCustomers = await fetchCustomers();
  const customerProduct = await fetchCustomerProduct();

  return (
    <>
      <TopNav />
      <ClientSideComponent
        initialProducts={initialProducts}
        initialCustomers={initialCustomers}
        customerProduct={customerProduct}
      />
    </>
  );
};

export default ProductsPage;
