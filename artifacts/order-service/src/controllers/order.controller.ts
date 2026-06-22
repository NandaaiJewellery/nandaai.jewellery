import { Request, Response } from 'express';

type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered';

interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

interface Order {
  id: string;
  status: OrderStatus;
  createdAt: string;
  items: OrderItem[];
  total: number;
  currency: string;
}

const MOCK_ORDERS: Order[] = [
  {
    id: 'order-001',
    status: 'delivered',
    createdAt: '2026-06-01T10:30:00Z',
    items: [
      { productId: 'prod-001', name: 'Wireless Headphones', quantity: 1, unitPrice: 249.99 },
    ],
    total: 249.99,
    currency: 'USD',
  },
  {
    id: 'order-002',
    status: 'processing',
    createdAt: '2026-06-15T14:22:00Z',
    items: [
      { productId: 'prod-002', name: 'Mechanical Keyboard', quantity: 1, unitPrice: 129.99 },
      { productId: 'prod-003', name: 'Ergonomic Mouse', quantity: 2, unitPrice: 79.99 },
    ],
    total: 289.97,
    currency: 'USD',
  },
];

export async function getOrders(req: Request, res: Response): Promise<void> {
  const userId = req.headers['x-user-id'] as string;
  const userEmail = req.headers['x-user-email'] as string;

  res.json({
    requestedBy: { userId, email: userEmail },
    orders: MOCK_ORDERS,
    total: MOCK_ORDERS.length,
  });
}
