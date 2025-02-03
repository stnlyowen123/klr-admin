import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "../../components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../../components/ui/sheet";
import { Menu, X, Home, Package, Settings } from "lucide-react";

type SidebarProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
      router.push("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <>
      {/* Sidebar permanen untuk desktop */}
      <div className="hidden md:flex flex-col w-64 bg-gradient-to-b from-orange-600 to-orange-800 text-white h-full p-6 gap-6 fixed inset-y-0 left-0 shadow-lg">
        <div className="flex items-center justify-between">
          <img src="/klr.png" alt="Admin Panel" className="w-auto h-auto" />
        </div>
        <nav className="flex flex-col gap-4 text-lg font-medium">
          <Link href="/" className="flex items-center gap-3 hover:text-orange-300 transition">
            <Home className="w-5 h-5" /> Beranda
          </Link>
          <Link href="/products" className="flex items-center gap-3 hover:text-orange-300 transition">
            <Package className="w-5 h-5" /> Products
          </Link>
          <Link href="/settings" className="flex items-center gap-3 hover:text-orange-300 transition">
            <Settings className="w-5 h-5" /> Settings
          </Link>
        </nav>
        <Button
          onClick={handleLogout}
          className="mt-auto bg-white text-orange-600 hover:bg-orange-300 hover:text-white transition font-semibold rounded-md shadow-lg"
        >
          Logout
        </Button>
      </div>
  
      {/* Sidebar untuk mobile dan tablet */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" className="md:hidden">
            <Menu className="w-6 h-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 bg-gradient-to-b from-orange-600 to-orange-800 text-white flex flex-col gap-6 p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <img src="/klr.png" alt="Admin Panel" className="w-32 h-auto" />
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="w-6 h-6 text-white" />
            </Button>
          </div>
          <nav className="flex flex-col gap-4 text-lg font-medium">
            <Link href="/" className="flex items-center gap-3 hover:text-orange-300 transition">
              <Home className="w-5 h-5" /> Beranda
            </Link>
            <Link href="/products" className="flex items-center gap-3 hover:text-orange-300 transition">
              <Package className="w-5 h-5" /> Products
            </Link>
            <Link href="/settings" className="flex items-center gap-3 hover:text-orange-300 transition">
              <Settings className="w-5 h-5" /> Settings
            </Link>
          </nav>
          <Button
            onClick={handleLogout}
            className="mt-auto bg-white text-orange-600 hover:bg-orange-300 hover:text-white transition font-semibold rounded-md shadow-lg"
          >
            Logout
          </Button>
        </SheetContent>
      </Sheet>
    </>
  );
}