import { Outlet } from "react-router-dom";
import FloatingWhatsApp from "./components/common/FloatingWhatsApp";

export default function App() {
  return (
    <>
      <Outlet />
      <FloatingWhatsApp />
    </>
  );
}
