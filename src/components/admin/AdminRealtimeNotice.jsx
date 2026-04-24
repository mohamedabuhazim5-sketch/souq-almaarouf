import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function AdminRealtimeNotice() {
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const channel = supabase
      .channel("orders-realtime")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "orders" }, () => {
        setNotice("يوجد طلب جديد وصل الآن");
        setTimeout(() => setNotice(""), 5000);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  if (!notice) return null;
  return <div className="success-box sticky-notice">{notice}</div>;
}
