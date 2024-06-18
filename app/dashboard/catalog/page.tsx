import ClientSideComponent from './clientSideComponent';
import {
  fetchCustomers,
  fetchProducts,
  fetchCustomerProduct,
} from '@/app/lib/data';
import TopNav from '@/app/ui/dashboard/topnav';
import { cookies } from 'next/headers';

const ProductsPage = async () => {
  const cookiecustomerCode = cookies().get('customer-code')?.value;

  const initialProducts = await fetchProducts();
  const initialCustomers = await fetchCustomers();
  const customerProduct = await fetchCustomerProduct();

  const filteredProducts = customerProduct
    .filter((item) => item.customer_code === cookiecustomerCode)
    .map((item) => item.id_product);

  console.log(filteredProducts);
  const productList = initialProducts.filter((item) =>
    filteredProducts.includes(item.id),
  );

  return (
    <>
      <TopNav />
      <ClientSideComponent initialProducts={productList} />
    </>
  );
};

export default ProductsPage;
