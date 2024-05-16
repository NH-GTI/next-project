import { fetchProducts } from '@/app/lib/data';
import Product from './product';

export default async function Page() {
  const products = await fetchProducts();

  return (
    <div className="flex grid grid-cols-5 flex-row gap-10">
      {products.map((product) => (
        <Product product={product} key={product.id} />
      ))}
    </div>
  );
}
