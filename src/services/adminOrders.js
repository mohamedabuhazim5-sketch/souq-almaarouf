import { supabase } from "../lib/supabase";

export async function getAllOrders() {
  const res = await supabase
    .from("orders")
    .select(`
      *,
      order_items (*)
    `)
    .order("created_at", { ascending: false });

  if (res.error) {
    console.error("GET ALL ORDERS ERROR:", res.error);
    throw res.error;
  }

  return res.data || [];
}

export async function updateOrderStatus(orderId, status) {
  const res = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId)
    .select()
    .single();

  if (res.error) {
    console.error("UPDATE ORDER STATUS ERROR:", res.error);
    throw res.error;
  }

  return res.data;
}

export async function createManualOrder(payload) {
  const customerRes = await supabase
    .from("customers")
    .insert({
      full_name: payload.customer_name,
      phone: payload.customer_phone,
      address: payload.customer_address,
      city: payload.customer_city || null,
      area: payload.customer_area || null,
    })
    .select("id")
    .single();

  if (customerRes.error) {
    console.error("CREATE CUSTOMER ERROR:", customerRes.error);
    throw customerRes.error;
  }

  const orderRes = await supabase
    .from("orders")
    .insert({
      customer_id: customerRes.data.id,
      customer_name: payload.customer_name,
      customer_phone: payload.customer_phone,
      customer_address: payload.customer_address,
      customer_city: payload.customer_city || null,
      customer_area: payload.customer_area || null,
      payment_method: payload.payment_method,
      payment_status: payload.payment_status || "pending",
      status: payload.status || "new",
      notes: payload.notes || null,
      subtotal_amount: payload.subtotal_amount,
      delivery_fee: payload.delivery_fee || 0,
      discount_amount: payload.discount_amount || 0,
      total_amount: payload.total_amount,
      order_source: "admin_manual",
      delivery_type: payload.delivery_type || "delivery",
    })
    .select("id, invoice_number")
    .single();

  if (orderRes.error) {
    console.error("CREATE ORDER ERROR:", orderRes.error);
    throw orderRes.error;
  }

  const itemsPayload = payload.items.map((item) => ({
    order_id: orderRes.data.id,
    product_id: item.product_id || null,
    product_name: item.product_name,
    product_slug: item.product_slug || null,
    weight_label: item.weight_label,
    price: Number(item.price || 0),
    quantity: Number(item.quantity || 1),
    line_total: Number(item.price || 0) * Number(item.quantity || 1),
  }));

  const itemsRes = await supabase.from("order_items").insert(itemsPayload);

  if (itemsRes.error) {
    console.error("CREATE ORDER ITEMS ERROR:", itemsRes.error);
    throw itemsRes.error;
  }

  return orderRes.data;
}

export async function incrementInvoicePrintCount(orderId, currentPrintedCount = 0) {
  const res = await supabase
    .from("orders")
    .update({ printed_count: currentPrintedCount + 1 })
    .eq("id", orderId)
    .select()
    .single();

  if (res.error) {
    console.error("INCREMENT PRINT COUNT ERROR:", res.error);
    throw res.error;
  }

  return res.data;
}

export async function cancelOrder(orderId) {
  const res = await supabase
    .from("orders")
    .update({ status: "cancelled" })
    .eq("id", orderId)
    .select()
    .single();

  if (res.error) {
    console.error("CANCEL ORDER ERROR:", res.error);
    throw res.error;
  }

  return res.data;
}

export function exportOrdersToCSV(orders) {
  const headers = [
    "invoice_number",
    "customer_name",
    "customer_phone",
    "customer_address",
    "payment_method",
    "delivery_type",
    "status",
    "subtotal_amount",
    "delivery_fee",
    "discount_amount",
    "total_amount",
    "created_at",
  ];

  const rows = orders.map((order) => [
    order.invoice_number || "",
    order.customer_name || "",
    order.customer_phone || "",
    order.customer_address || "",
    order.payment_method || "",
    order.delivery_type || "",
    order.status || "",
    order.subtotal_amount || 0,
    order.delivery_fee || 0,
    order.discount_amount || 0,
    order.total_amount || 0,
    order.created_at || "",
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      row
        .map((value) => `"${String(value).replace(/"/g, '""')}"`)
        .join(",")
    ),
  ].join("\n");

  const blob = new Blob(["\uFEFF" + csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "orders-export.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export async function updateOrderDetails(orderId, payload) {
  const { data, error } = await supabase
    .from("orders")
    .update({
      customer_name: payload.customer_name,
      customer_phone: payload.customer_phone,
      customer_address: payload.customer_address,
      customer_city: payload.customer_city || null,
      customer_area: payload.customer_area || null,
      payment_method: payload.payment_method,
      payment_status: payload.payment_status || "pending",
      delivery_type: payload.delivery_type || "delivery",
      delivery_fee: Number(payload.delivery_fee || 0),
      discount_amount: Number(payload.discount_amount || 0),
      subtotal_amount: Number(payload.subtotal_amount || 0),
      total_amount: Number(payload.total_amount || 0),
      notes: payload.notes || null,
    })
    .eq("id", orderId)
    .select()
    .single();

  if (error) {
    console.error("UPDATE ORDER DETAILS ERROR:", error);
    throw error;
  }

  return data;
}

export async function updateOrderWithItems(orderId, payload) {
  const orderUpdateRes = await supabase
    .from("orders")
    .update({
      customer_name: payload.customer_name,
      customer_phone: payload.customer_phone,
      customer_address: payload.customer_address,
      customer_city: payload.customer_city || null,
      customer_area: payload.customer_area || null,
      payment_method: payload.payment_method,
      payment_status: payload.payment_status || "pending",
      delivery_type: payload.delivery_type || "delivery",
      delivery_fee: Number(payload.delivery_fee || 0),
      discount_amount: Number(payload.discount_amount || 0),
      subtotal_amount: Number(payload.subtotal_amount || 0),
      total_amount: Number(payload.total_amount || 0),
      notes: payload.notes || null,
    })
    .eq("id", orderId)
    .select()
    .single();

  if (orderUpdateRes.error) {
    console.error("UPDATE ORDER WITH ITEMS - ORDER ERROR:", orderUpdateRes.error);
    throw orderUpdateRes.error;
  }

  const deleteItemsRes = await supabase
    .from("order_items")
    .delete()
    .eq("order_id", orderId);

  if (deleteItemsRes.error) {
    console.error("DELETE OLD ORDER ITEMS ERROR:", deleteItemsRes.error);
    throw deleteItemsRes.error;
  }

  const itemsPayload = payload.items.map((item) => ({
    order_id: orderId,
    product_id: item.product_id || null,
    product_name: item.product_name,
    product_slug: item.product_slug || null,
    weight_label: item.weight_label,
    price: Number(item.price || 0),
    quantity: Number(item.quantity || 1),
    line_total: Number(item.price || 0) * Number(item.quantity || 1),
  }));

  const insertItemsRes = await supabase.from("order_items").insert(itemsPayload);

  if (insertItemsRes.error) {
    console.error("INSERT NEW ORDER ITEMS ERROR:", insertItemsRes.error);
    throw insertItemsRes.error;
  }

  return orderUpdateRes.data;
}
