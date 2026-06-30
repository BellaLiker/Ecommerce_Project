import { Outlet } from "react-router-dom";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import UserSidebar from "./UserSidebar.jsx";
import styles from "./AdminLayout.module.css";

export default function UserLayout() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      <div style={{ display: "flex", flex: 1 }}>
        <UserSidebar />
        <main style={{ flex: 1, padding: "24px", background: "#f5f5f5" }}>
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}
