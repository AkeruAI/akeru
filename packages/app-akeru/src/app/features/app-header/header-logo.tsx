import { Sprout } from "lucide-react";
import React from "react";

const HeaderLogo = () => {
  return (
    <div className="flex items-center gap-1">
      <Sprout className="h-6 w-6" />
      <h1 className="text-lg font-semibold">Akeru</h1>
    </div>
  );
};

export default HeaderLogo;
