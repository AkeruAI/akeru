import { headerRoutes } from "@/app/utils/header-routes";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";

function Header() {
  return (
    <header className="w-full mx-auto py-5">
      <nav className="flex justify-between items-center">
        <div className="w-full">
          <Link
            className="bg-gradient-to-r w-fit from-green-300 via-green-300 to-blue-300 animate-text text-transparent bg-clip-text font-extrabold text-2xl md:text-3xl tracking-wider"
            href="/"
          >
            AKERU
          </Link>
        </div>
        <div className="hidden md:block">
          <ul className="flex gap-5 items-center">
            {headerRoutes.map((route) => (
              <li
                className="text-sm cursor-pointer hover:text-green-300 duration-100"
                key={route.href}
              >
                <Link href={route.href}>{route.text}</Link>
              </li>
            ))}
            <div className="h-5 w-px bg-white" />
            <Link href="https://github.com/GuiBibeau/akeru" target="_blank">
              <FaGithub className="w-5 h-5 cursor-pointer hover:text-green-300 duration-100 " />
            </Link>
          </ul>
        </div>
        <div className="block md:hidden">
          <label htmlFor="my-drawer" className="btn btn-square btn-ghost">
            <GiHamburgerMenu className="text-lg" />
          </label>
        </div>
      </nav>
    </header>
  );
}

export default Header;
