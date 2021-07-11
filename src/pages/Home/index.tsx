import { useEffect, useState } from 'react';
import { MdAddShoppingCart } from 'react-icons/md';

import { useCart } from '../../hooks/useCart';
import { api } from '../../services/api';
import { formatPrice } from '../../util/format';
import { ProductList } from './styles';
interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

interface ProductFormatted extends Product {
  priceFormatted: string;
}
interface CartItemsAmount {
  [key: number]: number;
}

export default function Home() {
  const [products, setProducts] = useState<ProductFormatted[]>([] as ProductFormatted[]);
  const { addProduct, cart } = useCart();

  const cartItemsAmount = cart.reduce((sumAmount, product) => {
    sumAmount[product.id] = (sumAmount[product.id] ?? 0) + product.amount;

    return sumAmount;
  }, {} as CartItemsAmount)

  function handleAddProduct(id: number) {
    addProduct(id);
  }

  useEffect(() => {
    async function loadProducts() {
      const response = await api.get('/products');

      const productsApi: ProductFormatted[] = response.data;

      const productsFormatted = productsApi.map(product => {
        product.priceFormatted = formatPrice(product.price);

        return product;
      });

      setProducts(productsFormatted);
    }

    loadProducts();
  }, []);

  return (
    <ProductList>
      {products.map(product => (
        <li key={product.id}>
        <img src={product.image} alt={product.title} />
        <strong>{product.title}</strong>
        <span>{(product.priceFormatted)}</span>
        <button
          type="button"
          data-testid="add-product-button"
          onClick={() => handleAddProduct(product.id)}
        >
          <div data-testid="cart-product-quantity">
            <MdAddShoppingCart size={16} color="#FFF" />
            {cartItemsAmount[product.id] || 0}
          </div>
          <span>ADICIONAR AO CARRINHO</span>
        </button>
      </li>
      ))}
    </ProductList>
  );
};

