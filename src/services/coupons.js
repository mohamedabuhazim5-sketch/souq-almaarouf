import { supabase } from "../lib/supabase";

export async function validateCoupon(code, totalAmount) {
  const normalized = String(code || "").trim().toUpperCase();
  if (!normalized) return { valid: false, message: "أدخل كود الخصم" };

  const res = await supabase
    .from("coupons")
    .select("*")
    .eq("code", normalized)
    .eq("is_active", true)
    .maybeSingle();

  if (res.error) throw res.error;
  if (!res.data) return { valid: false, message: "كوبون غير صالح" };

  const coupon = res.data;
  const expired = coupon.expires_at && new Date(coupon.expires_at) < new Date();
  if (expired) return { valid: false, message: "انتهت صلاحية الكوبون" };
  if (Number(totalAmount) < Number(coupon.min_order_amount || 0)) {
    return {
      valid: false,
      message: `الحد الأدنى لاستخدام الكوبون هو ${coupon.min_order_amount} ج`,
    };
  }

  let discountAmount = 0;
  if (coupon.discount_type === "fixed") {
    discountAmount = Number(coupon.discount_value || 0);
  } else {
    discountAmount = (Number(totalAmount) * Number(coupon.discount_value || 0)) / 100;
  }

  discountAmount = Math.min(discountAmount, Number(totalAmount));

  return {
    valid: true,
    coupon,
    discountAmount,
    finalTotal: Number(totalAmount) - discountAmount,
    message: "تم تطبيق الكوبون بنجاح",
  };
}

export async function getAllCoupons() {
  const { data, error } = await supabase
    .from("coupons")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("GET COUPONS ERROR:", error);
    throw error;
  }

  return data || [];
}

export async function createCoupon(payload) {
  const { data, error } = await supabase
    .from("coupons")
    .insert({
      code: String(payload.code || "").trim().toUpperCase(),
      description_ar: payload.description_ar || null,
      discount_type: payload.discount_type,
      discount_value: Number(payload.discount_value || 0),
      min_order_amount: Number(payload.min_order_amount || 0),
      max_discount_amount:
        payload.max_discount_amount === "" || payload.max_discount_amount == null
          ? null
          : Number(payload.max_discount_amount),
      usage_limit:
        payload.usage_limit === "" || payload.usage_limit == null
          ? null
          : Number(payload.usage_limit),
      used_count: Number(payload.used_count || 0),
      is_active: Boolean(payload.is_active),
      starts_at: payload.starts_at || null,
      expires_at: payload.expires_at || null,
    })
    .select()
    .single();

  if (error) {
    console.error("CREATE COUPON ERROR:", error);
    throw error;
  }

  return data;
}

export async function updateCoupon(couponId, payload) {
  const { data, error } = await supabase
    .from("coupons")
    .update({
      code: String(payload.code || "").trim().toUpperCase(),
      description_ar: payload.description_ar || null,
      discount_type: payload.discount_type,
      discount_value: Number(payload.discount_value || 0),
      min_order_amount: Number(payload.min_order_amount || 0),
      max_discount_amount:
        payload.max_discount_amount === "" || payload.max_discount_amount == null
          ? null
          : Number(payload.max_discount_amount),
      usage_limit:
        payload.usage_limit === "" || payload.usage_limit == null
          ? null
          : Number(payload.usage_limit),
      used_count: Number(payload.used_count || 0),
      is_active: Boolean(payload.is_active),
      starts_at: payload.starts_at || null,
      expires_at: payload.expires_at || null,
    })
    .eq("id", couponId)
    .select()
    .single();

  if (error) {
    console.error("UPDATE COUPON ERROR:", error);
    throw error;
  }

  return data;
}

export async function deleteCoupon(couponId) {
  const { error } = await supabase
    .from("coupons")
    .delete()
    .eq("id", couponId);

  if (error) {
    console.error("DELETE COUPON ERROR:", error);
    throw error;
  }
}

export async function toggleCouponStatus(couponId, isActive) {
  const { data, error } = await supabase
    .from("coupons")
    .update({ is_active: !isActive })
    .eq("id", couponId)
    .select()
    .single();

  if (error) {
    console.error("TOGGLE COUPON ERROR:", error);
    throw error;
  }

  return data;
}
