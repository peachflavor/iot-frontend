import { Box, Group } from "@mantine/core";
import websiteLogo from "../assets/website-logo.png";
import { Link } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Box>
        <header className="h-14 px-8 border border-t-0 border-x-0 border-solid border-neutral-200 bg-white">
          <div className="flex justify-between items-center h-full">
            <img src={websiteLogo} alt="Website Logo" className="h-14 w-auto" />

            <Group className="h-full gap-4">
              <Link
                to="/"
                className="flex items-center h-full px-2 no-underline text-neutral-600 font-semibold text-sm"
                aria-label="Home"
              >
                หน้าหลัก
              </Link>

              <Link
                to="/books"
                className="flex items-center h-full px-2 no-underline text-neutral-600 font-semibold text-sm"
                aria-label="Books"
              >
                หนังสือ
              </Link>

              <Link
                to="/menus"
                className="flex items-center h-full px-2 no-underline text-neutral-600 font-semibold text-sm"
                aria-label="Menus"
              >
                เมนู
              </Link>

              <Link
                to="/staffs"
                className="flex items-center h-full px-2 no-underline text-neutral-600 font-semibold text-sm"
                aria-label="Staff"
              >
                สตาฟ
              </Link>
            </Group>

            <div></div>
          </div>
        </header>
      </Box>

      <main>{children}</main>
    </>
  );
}
