import { headerRoutes } from "@/app/utils/header-routes";
import { FaGithub } from "react-icons/fa";

function Header() {
  return (
    <header>
      <nav className="w-[80%] my-[0] mx-[auto] p-[20px] flex justify-between items-center">
        <div className="w-[100%]">
          <h1 className="akeru-logo font-[800] text-[30px] tracking-wider">
            <a href="#">AKERU</a>
          </h1>
        </div>
        <div className="">
          <ul className="flex gap-[25px] items-center">
            {headerRoutes.map((route) => (
              <li className="text-[12px]" key={route.href}>
                {route.text}
              </li>
            ))}
            <div className="h-[21px] w-[1px] bg-white" />
            <FaGithub className="w-[20.56px] h-[20px]" />
          </ul>
        </div>
      </nav>
    </header>
  );
}

export default Header;
