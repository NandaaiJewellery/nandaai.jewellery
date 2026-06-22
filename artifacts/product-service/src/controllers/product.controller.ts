import { Request, Response } from 'express';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  inStock: boolean;
}

const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    name: 'Wireless Headphones',
    description: 'Premium noise-cancelling over-ear headphones',
    price: 249.99,
    currency: 'USD',
    inStock: true,
  },
  {
    id: 'prod-002',
    name: 'Mechanical Keyboard',
    description: 'Compact TKL keyboard with Cherry MX switches',
    price: 129.99,
    currency: 'USD',
    inStock: true,
  },
  {
    id: 'prod-003',
    name: 'Ergonomic Mouse',
    description: 'Vertical ergonomic mouse for all-day comfort',
    price: 79.99,
    currency: 'USD',
    inStock: false,
  },
];

export async function getProducts(req: Request, res: Response): Promise<void> {
  const userId = req.headers['x-user-id'] as string;
  const userEmail = req.headers['x-user-email'] as string;

  res.json({
    requestedBy: { userId, email: userEmail },
    products: MOCK_PRODUCTS,
    total: MOCK_PRODUCTS.length,
  });
}
