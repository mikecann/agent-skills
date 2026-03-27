type Order = {
  id: string;
  amount: number;
  status: "pending" | "complete" | "cancelled";
  isRefunded: boolean;
};

type PaymentResult =
  | { kind: "success"; value: string }
  | { kind: "error"; message: string };

export async function handle(orderId: string, shouldLog: boolean) {
  const order = await loadOrder(orderId);

  if (order) {
    if (order.status === "complete") {
      if (order.amount > 0) {
        if (!order.isRefunded) {
          if (shouldLog) {
            console.log("Processing order", order.id);
          }

          return {
            ok: true,
            value: order.amount,
          };
        } else {
          return {
            ok: false,
            value: 0,
          };
        }
      } else {
        return {
          ok: false,
          value: 0,
        };
      }
    } else {
      return {
        ok: false,
        value: 0,
      };
    }
  } else {
    return {
      ok: false,
      value: 0,
    };
  }
}

export function processPaymentResult(result: PaymentResult) {
  if (result.kind === "success") return result.value;
  return "Something went wrong";
}

export function getRetryDelay(timeout: number, shouldDouble: boolean) {
  let finalTimeout = timeout;

  if (shouldDouble) {
    finalTimeout = timeout * 2;
  } else {
    finalTimeout = timeout;
  }

  return finalTimeout;
}

export function getOrderSummary(
  id: string,
  name: string,
  isPriority: boolean,
) {
  return [id, `${name}-${isPriority ? "priority" : "normal"}`] as const;
}

export function getCount(result: any) {
  return result.items!.length;
}

async function loadOrder(orderId: string): Promise<Order | null> {
  return {
    id: orderId,
    amount: 20,
    status: "complete",
    isRefunded: false,
  };
}
