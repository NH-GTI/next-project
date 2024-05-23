import { fetchProducts } from '@/app/lib/data';
import ProductContainer from './productContainer';
import { Product } from '@/app/lib/definitions';

export default async function Page() {
  const products: Product[] = await fetchProducts();

  return (
    <div className="flex grid grid-cols-5 flex-row gap-10">
      <ProductContainer products={products} />
    </div>
  );
}
