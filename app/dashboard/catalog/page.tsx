import ClientSideComponent from './clientSideComponent';
import {
  fetchProducts,
  fetchCustomerProduct,
  fetchCustomerById,
} from '@/app/lib/data';
import { Customer } from '@/app/lib/definitions';
import TopNav from '@/app/ui/dashboard/topnav';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const ProductsPage = async () => {
  const cookiecustomerCode = cookies().get('customer-code')?.value as string;
  if (!cookiecustomerCode) {
    redirect('/dashboard/customers');
  }

  const initialProducts = await fetchProducts();
  const customerProduct = await fetchCustomerProduct();
  const customer: Customer = await fetchCustomerById(cookiecustomerCode);

  const filteredProducts = customerProduct
    .filter((item) => item.code_tarif === customer.code_tarif)
    .map((item) => ({
      product_ref: item.product_ref,
      product_price: item.product_price, // Assuming this is the correct key for the price
    }));

  // console.log(filteredProducts);

  const productList = initialProducts
    .filter((product) =>
      filteredProducts.some((p) => p.product_ref === product.reference),
    )
    .map((product) => {
      const productMatch = filteredProducts.find(
        (p) => p.product_ref === product.reference,
      );
      return {
        ...product,
        product_price: productMatch ? productMatch.product_price : '0',
      };
    });
  // console.log(productList);

  return (
    <>
      <TopNav />
      <ClientSideComponent initialProducts={productList} customer={customer} />
    </>
  );
};

export default ProductsPage;
