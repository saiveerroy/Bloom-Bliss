
import { useState } from "react";
import ManageProducts from "./ManageProducts";
import ManageOrders from "./ManageOrders";
import ManageCustomers from "./ManageCustomers";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useInventory } from "../context/InventoryContext";



  const menuItems = [
    { name: "Overview", icon: "📊" },
    { name: "Products", icon: "🌷" },
    { name: "Orders", icon: "📦" },
    { name: "Customers", icon: "👥" },
    { name: "Settings", icon: "⚙️" },
  ];


  function AdminDashboard() {
    const navigate = useNavigate();

    const { products, orders, loading } = useInventory();
  

    const [activePage, setActivePage] = useState("Overview");
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const totalSales = orders
        .filter((order) => order.status?.toLowerCase() !== "cancelled")
        .reduce((sum, order) => sum + Number(order.total || 0), 0);

    const pendingOrders = orders.filter(
      (order) => order.status?.toLowerCase() === "pending"
    ).length;

    const stats = [
      {
        title: "Total Sales",
        value: `₹${totalSales.toLocaleString("en-IN")}`,
        icon: "💰",
        change: "All-time sales",
      },
      {
        title: "Total Orders",
        value: orders.length,
        icon: "📦",
        change: "All orders",
      },
      {
        title: "Total Products",
        value: products.length,
        icon: "🌸",
        change: "Available products",
      },
      {
        title: "Pending Orders",
        value: pendingOrders,
        icon: "⏳",
        change: "Needs attention",
      },
    ];

    const recentOrders = [...orders]
      .sort((a, b) => {
        const dateA = a.createdAt?.toDate?.()?.getTime() || 0;
        const dateB = b.createdAt?.toDate?.()?.getTime() || 0;

        return dateB - dateA;
      })
      .slice(0, 5);

  return (
    <div className="min-h-screen bg-[#fffaf7] text-[#3d332f]">

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
     className={`fixed inset-y-0 left-0 z-50 flex h-screen w-64 flex-col
        bg-[#382b2b] text-white transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      >
        <div className="border-b border-white/10 px-6 py-7">
          <h1 className="text-2xl font-bold tracking-wide">
            Bloom <span className="text-pink-300">&</span> Bliss
          </h1>
          <p className="mt-2 text-sm text-white/60">Owner Dashboard</p>
        </div>

        <nav className="flex-1 space-y-2 px-4 py-6">
          <p className="mb-4 px-3 text-xs uppercase tracking-widest text-white/40">
            Main Menu
          </p>

          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => {
                setActivePage(item.name);
                setSidebarOpen(false);
              }}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3
                text-left transition
                ${
                  activePage === item.name
                    ? "bg-pink-200 text-[#382b2b] font-semibold"
                    : "text-white/75 hover:bg-white/10"
                }`}
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </button>
          ))}
        </nav>

        
        
          {/* Shop Owner Profile */}
        {/* Shop Owner Profile */}
<div className="mt-auto shrink-0 border-t border-white/10 p-5">
  <button
    type="button"
    onClick={() => navigate("/admin/profile")}
    className="flex w-full items-center gap-3 rounded-xl p-3 text-left hover:bg-white/10"
  >
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-200 text-lg">
      👩
    </div>

    <div>
      <p className="font-semibold">Shop Owner</p>
      <p className="text-xs text-white/50">
        Administrator
      </p>
    </div>

    <span className="ml-auto">›</span>
  </button>
</div>

      </aside>



      {/* Main content */}
      <main className="min-h-screen lg:ml-64">

        {/* Topbar */}
        <header className="sticky top-0 z-30 flex items-center justify-between
          border-b border-[#eee3dc] bg-white/95 px-5 py-4 backdrop-blur sm:px-8">

          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 hover:bg-gray-100 lg:hidden"
              aria-label="Open menu"
            >
              ☰
            </button>

            <div>
              <h2 className="text-lg font-bold sm:text-xl">
                {activePage}
              </h2>
              <p className="text-xs text-gray-500 sm:text-sm">
                Welcome back! Here's your shop update.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-gray-500 sm:block">
              Bloom & Bliss Store
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100">
              🌷
            </div>
          </div>
        </header>

        {/* Dashboard body */}
        
        <div className="p-5 sm:p-8">

          {activePage === "Overview" && (
            <>
              <div className="mb-7">
                <h3 className="text-2xl font-bold">Dashboard Overview 🌸</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Here's what's happening with your flower shop.
                </p>
              </div>
              {loading ? (
                <div className="rounded-xl bg-white p-8 text-center">
                  Loading dashboard data...
                </div>
              ) : (
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                  {stats.map((stat) => (
                    <div
                      key={stat.title}
                      className="rounded-2xl border border-[#f0e5df] bg-white p-5 shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500">{stat.title}</p>
                        <span className="text-2xl">{stat.icon}</span>
                      </div>

                      <h3 className="mt-4 text-2xl font-bold">
                        {stat.value}
                      </h3>

                      <p className="mt-2 text-xs text-green-600">
                        {stat.change}
                      </p>
                    </div>
                  ))}
                </div>
              )}

            

              {/* Recent orders */}
              <section className="mt-8 overflow-hidden rounded-2xl border
                border-[#f0e5df] bg-white shadow-sm">

                <div className="flex flex-wrap items-center justify-between gap-3 p-5">
                  <div>
                    <h3 className="font-bold">Recent Orders</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Latest customer orders
                    </p>
                  </div>

                  <button
                    onClick={() => setActivePage("Orders")}
                    className="rounded-lg bg-[#382b2b] px-4 py-2 text-sm text-white hover:bg-[#574141]"
                  >
                    View All Orders
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[650px] text-left text-sm">
                    <thead className="bg-[#fffaf7] text-gray-500">
                      <tr>
                        <th className="px-5 py-4">Order ID</th>
                        <th className="px-5 py-4">Customer</th>
                        <th className="px-5 py-4">Product</th>
                        <th className="px-5 py-4">Amount</th>
                        <th className="px-5 py-4">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order) => (
                        <tr key={order.id} className="border-t border-[#f3ece7]">
                          <td className="px-5 py-4 font-semibold">
                            #{order.id}
                          </td>

                          <td className="px-5 py-4">
                            {order.customerName || "Customer"}
                          </td>

                          <td className="px-5 py-4">
                            {order.items?.map((item) => item.name).join(", ") || "N/A"}
                          </td>

                          <td className="px-5 py-4">
                            ₹{Number(order.total || 0).toLocaleString("en-IN")}
                          </td>

                          <td className="px-5 py-4">

                            <span className="rounded-full bg-pink-50 px-3 py-1 text-xs font-medium text-pink-700">
                              {order.status || "Pending"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          )}

          {activePage === "Products" && <ManageProducts />}

          {activePage === "Orders" && <ManageOrders />}
          {activePage === "Customers" && <ManageCustomers />}

          {activePage !== "Overview" &&
            activePage !== "Products" &&
            activePage !== "Orders" &&
            activePage !== "Customers" && (
            <div className="rounded-2xl border bg-white p-8">
              <h3 className="text-xl font-bold">{activePage}</h3>
              <p className="mt-2 text-sm text-gray-500">
                We will build this section next.
              </p>
            </div>
)}

        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
