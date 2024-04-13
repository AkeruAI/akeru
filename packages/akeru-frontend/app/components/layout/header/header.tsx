import { headerRoutes } from "@/app/utils/header-routes";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";

function Header() {
  return (
    <header>
      <nav className="w-4/5 my-0 mx-auto p-5 flex justify-between items-center  sm:w-11/12">
        <div className="w-full">
          <h1 className="akeru-logo font-extrabold text-3xl tracking-wider cursor-pointer lg:text-2xl">
            <a href="#">AKERU</a>
          </h1>
        </div>
        <div className="block sm:hidden">
          <ul className="flex gap-5 items-center">
            {headerRoutes.map((route) => (
              <li
                className="text-xs cursor-pointer hover:text-textHover font-medium"
                key={route.href}
              >
                <Link href={route.href}>{route.text}</Link>
              </li>
            ))}
            <div className="h-5 w-px bg-white" />
            <Link href="https://github.com/GuiBibeau/akeru" target="_blank">
              {" "}
              <FaGithub className="w-5 h-5 cursor-pointer hover:text-textHover " />
            </Link>
          </ul>
        </div>
        <div className="hidden sm:block">
          <label htmlFor="my-drawer" className="btn btn-square btn-ghost">
            <GiHamburgerMenu className="text-lg" />
          </label>
        </div>
      </nav>
    </header>
  );
}

export default Header;
