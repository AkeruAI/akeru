import React from "react";
import HeaderLogo from "./header-logo";
import HeaderNavBar from "./header-navbar";
import HeaderProfile from "./header-profile";

const Header = () => {
  return (
    <header className="flex h-16 flex-row items-center justify-between px-8 py-2 bg-white">
      <HeaderLogo />
      <div className="flex items-center gap-4">
        <HeaderNavBar />
        <HeaderProfile />
      </div>
    </header>
  );
};

export default Header;
