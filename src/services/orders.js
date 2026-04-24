import { supabase } from "../lib/supabase";

export async function submitOrder({
  customerName,
  customerPhone,
  customerAddress,
  paymentMethod,
  notes,
  totalAmount,
  items,
  couponCode = null,
  discountAmount = 0,
}) {
  let customerId = null;
  const existingCustomerRes = await supabase.from("customers").select("id").eq("phone", customerPhone).maybeSingle();

  if (existingCustomerRes.data?.id) {
    customerId = existingCustomerRes.data.id;
    const updateCustomerRes = await supabase
      .from("customers")
      .update({ full_name: customerName, address: customerAddress })
      .eq("id", customerId);
    if (updateCustomerRes.error) throw updateCustomerRes.error;
  } else {
    const insertCustomerRes = await supabase
      .from("customers")
      .insert({ full_name: customerName, phone: customerPhone, address: customerAddress })
      .select("id")
      .single();
    if (insertCustomerRes.error) throw insertCustomerRes.error;
    customerId = insertCustomerRes.data.id;
  }

  const orderRes = await supabase
    .from("orders")
    .insert({
      customer_id: customerId,
      customer_name: customerName,
      customer_phone: customerPhone,
      customer_address: customerAddress,
      payment_method: paymentMethod,
      notes,
      total_amount: totalAmount,
      coupon_code: couponCode,
      discount_amount: discountAmount,
      status: "new",
    })
    .select("id")
    .single();

  if (orderRes.error) throw orderRes.error;
  const orderId = orderRes.data.id;

  const itemsRes = await supabase.from("order_items").insert(
    items.map((item) => ({
      order_id: orderId,
      product_id: item.product_id,
      product_name: item.product_name,
      weight_label: item.weight_label,
      price: item.price,
      quantity: item.quantity,
    }))
  );
  if (itemsRes.error) throw itemsRes.error;
  return { orderId };
}
