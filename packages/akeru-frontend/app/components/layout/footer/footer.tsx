import React from "react";

function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="footer footer-center p-4 text-base-content">
      <aside>
        <p>Copyright © {currentYear} - All right reserved by Akeru folks!</p>
      </aside>
    </footer>
  );
}

export default Footer;
