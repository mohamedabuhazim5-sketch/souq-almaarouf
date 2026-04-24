import { useEffect, useState } from "react";
import {
  getActiveBanners,
  getActiveStoreFeatures,
} from "../services/homeContent";

export function useHomeContent() {
  const [banners, setBanners] = useState([]);
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadContent() {
      setLoading(true);
      setError("");

      try {
        const [bannersData, featuresData] = await Promise.all([
          getActiveBanners(),
          getActiveStoreFeatures(),
        ]);

        setBanners(bannersData);
        setFeatures(featuresData);
      } catch (err) {
        console.error("USE HOME CONTENT ERROR:", err);
        setError(err.message || "تعذر تحميل محتوى الصفحة الرئيسية");
      } finally {
        setLoading(false);
      }
    }

    loadContent();
  }, []);

  return { banners, features, loading, error };
}
