import { FaGithub } from "react-icons/fa";
import { headerRoutes } from "../../../utils/header-routes";

type DrawerProps = {
  children: React.ReactNode;
};

function Drawer({ children }: DrawerProps) {
  return (
    <div className="drawer drawer-end">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">{children}</div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu p-4 pt-20 w-80 min-h-full text-base-content bg-[#074707] ">
          {headerRoutes.map((route) => (
            <li
              className="hover:bg-[#65ef65] hover:text-black"
              key={route.href}
            >
              <a href={route.href}>{route.text}</a>
            </li>
          ))}
          <li>
            <a href="https://github.com/GuiBibeau/akeru" target="_blank">
              {" "}
              <FaGithub className="w-5 h-5 cursor-pointer hover:text-[#3dff8b]" />
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Drawer;
