import React from "react";
import Navbar from "./Navbar";

function Layout({ children, user, onLogout }) {
  return (
    <>
      <Navbar user={user} />
      <div className="layout-content">
        {children}
      </div>
    </>
  );
}

export default Layout;
