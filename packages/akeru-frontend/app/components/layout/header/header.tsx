import { headerRoutes } from "@/app/utils/header-routes";
import { FaGithub } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";

function Header() {
  return (
    <header>
      <nav className="w-[80%] my-[0] mx-[auto] p-[20px] flex justify-between items-center  sm:w-[95%]">
        <div className="w-[100%]">
          <h1 className="akeru-logo font-[800] text-[30px] tracking-wider cursor-pointer lg:text-[23px]">
            <a href="#">AKERU</a>
          </h1>
        </div>
        <div className="block sm:hidden">
          <ul className="flex gap-[25px] items-center">
            {headerRoutes.map((route) => (
              <li
                className="text-[12px] cursor-pointer hover:text-[#3dff8b] font-[500]"
                key={route.href}
              >
                {route.text}
              </li>
            ))}
            <div className="h-[21px] w-[1px] bg-white" />
            <FaGithub className="w-[20.56px] h-[20px] cursor-pointer hover:text-[#3dff8b] " />
          </ul>
        </div>
        <div className="hidden sm:block">
          <label htmlFor="my-drawer" className="btn btn-square btn-ghost">
            <GiHamburgerMenu className="text-[18px]" />
          </label>
        </div>
      </nav>
    </header>
  );
}

export default Header;
