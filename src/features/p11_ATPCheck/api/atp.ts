// ATP计算引擎
import type { ATPContext } from '../../../core/types';

function calculateATP(context: ATPContext): {
  availableQty: number;
  atpDate: string;
  status: 'available' | 'partial' | 'unavailable';
  breakdown: {
    onHand: number;
    incoming: number;
    reserved: number;
    safetyStock: number;
  };
} {
  const availableQty = context.onHand + context.incoming - context.reserved - context.safetyStock;
  
  let atpDate = context.requestedDate;
  if (availableQty < context.requestedQty) {
    atpDate = calculateCTPDate(context);
  }
  
  let status: 'available' | 'partial' | 'unavailable' = 'available';
  if (availableQty >= context.requestedQty) status = 'available';
  else if (availableQty > 0) status = 'partial';
  else status = 'unavailable';
  
  return {
    availableQty: Math.max(0, availableQty),
    atpDate,
    status,
    breakdown: {
      onHand: context.onHand,
      incoming: context.incoming,
      reserved: context.reserved,
      safetyStock: context.safetyStock
    }
  };
}

function calculateCTPDate(context: ATPContext): string {
  const needed = context.requestedQty - context.onHand - context.incoming + context.reserved + context.safetyStock;
  const daysNeeded = Math.ceil(needed / 100);
  const date = new Date(context.requestedDate);
  date.setDate(date.getDate() + daysNeeded);
  return date.toISOString().split('T')[0];
}

const atpDatabase: ATPContext[] = [
  {
    materialId: 'HJ-M05',
    materialName: 'DC马达总成',
    requestedQty: 18000,
    requestedDate: '2026-10-08',
    onHand: 630,
    incoming: 0,
    reserved: 630,
    safetyStock: 2000
  },
  {
    materialId: 'HJ-SP03',
    materialName: '精密弹簧',
    requestedQty: 5000,
    requestedDate: '2026-10-08',
    onHand: 8000,
    incoming: 2000,
    reserved: 5000,
    safetyStock: 3000
  }
];

export async function GET() {
  const results = atpDatabase.map(ctx => ({
    ...ctx,
    ...calculateATP(ctx)
  }));
  return Response.json({ atpResults: results, total: results.length });
}

export async function POST(request: Request) {
  const context = await request.json();
  const result = calculateATP(context);
  return Response.json({ ...context, ...result });
}
