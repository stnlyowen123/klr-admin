import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "../../components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../../components/ui/sheet";
import { Menu, X, Home, Package, Settings, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

type SidebarProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const router = useRouter();
  const [isProductsOpen, setIsProductsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
      router.push("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const navLinks = [
    { href: "/", label: "Beranda", icon: Home },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <>
      {/* Sidebar permanen untuk desktop */}
      <motion.div
        className="hidden md:flex flex-col w-64 bg-gradient-to-b from-black to-orange-600 text-white h-full p-6 gap-6 fixed inset-y-0 left-0 shadow-lg"
      >
        <div className="flex items-center justify-between">
          <img src="/klr.png" alt="Admin Panel" className="w-auto h-auto" />
        </div>
        <nav className="flex flex-col gap-4 text-lg font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 hover:text-primary-light transition"
            >
              <link.icon className="w-5 h-5" /> {link.label}
            </Link>
          ))}
          <div className="flex flex-col">
            <button
              className="flex items-center gap-3 hover:text-primary-light transition w-full text-left"
              onClick={() => setIsProductsOpen(!isProductsOpen)}
            >
              <Package className="w-5 h-5" /> Produk
              <ChevronDown className={`w-5 h-5 transition-transform ${isProductsOpen ? "rotate-180" : "rotate-0"}`} />
            </button>
            {isProductsOpen && (
              <div className="ml-6 mt-2 flex flex-col gap-2">
                <Link href="/add-products" className="hover:text-primary-light transition">
                  Tambah Produk
                </Link>
                <Link href="/products" className="hover:text-primary-light transition">
                  Lihat Produk
                </Link>
              </div>
            )}
          </div>
        </nav>
        <Button
          onClick={handleLogout}
          className="mt-auto bg-white text-primary hover:bg-primary-light hover:text-white transition font-semibold rounded-md shadow-lg"
        >
          Logout
        </Button>
      </motion.div>

      {/* Sidebar untuk mobile dan tablet */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" className="md:hidden">
            <Menu className="w-6 h-6" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-64 bg-gradient-to-b from-primary to-primary-dark text-white flex flex-col gap-6 p-6 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <img src="/klr.png" alt="Admin Panel" className="w-32 h-auto" />
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="w-6 h-6 text-white" />
            </Button>
          </div>
          <nav className="flex flex-col gap-4 text-lg font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 hover:text-primary-light transition"
              >
                <link.icon className="w-5 h-5" /> {link.label}
              </Link>
            ))}
            <div className="flex flex-col">
              <button
                className="flex items-center gap-3 hover:text-primary-light transition w-full text-left"
                onClick={() => setIsProductsOpen(!isProductsOpen)}
              >
                <Package className="w-5 h-5" /> Produk
                <ChevronDown className={`w-5 h-5 transition-transform ${isProductsOpen ? "rotate-180" : "rotate-0"}`} />
              </button>
              {isProductsOpen && (
                <div className="ml-6 mt-2 flex flex-col gap-2">
                  <Link href="/add-products" className="hover:text-primary-light transition">
                    Tambah Produk
                  </Link>
                  <Link href="/products" className="hover:text-primary-light transition">
                    Lihat Produk
                  </Link>
                </div>
              )}
            </div>
          </nav>
          <Button
            onClick={handleLogout}
            className="mt-auto bg-white text-primary hover:bg-primary-light hover:text-white transition font-semibold rounded-md shadow-lg"
          >
            Logout
          </Button>
        </SheetContent>
      </Sheet>
    </>
  );
}