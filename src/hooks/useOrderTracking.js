import { useState } from "react";
import { supabase } from "../lib/supabase";

export function useOrderTracking() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState(null);

  const trackOrder = async ({ orderId, phone }) => {
    setLoading(true);
    setError("");
    setOrder(null);

    const res = await supabase
      .from("orders")
      .select(`
        id, customer_name, customer_phone, payment_method, status,
        total_amount, discount_amount, coupon_code, created_at,
        order_items ( id, product_name, weight_label, price, quantity )
      `)
      .eq("id", orderId)
      .eq("customer_phone", phone)
      .maybeSingle();

    if (res.error || !res.data) {
      setError("لم يتم العثور على طلب بهذه البيانات");
      setLoading(false);
      return;
    }

    setOrder(res.data);
    setLoading(false);
  };

  return { loading, error, order, trackOrder };
}
