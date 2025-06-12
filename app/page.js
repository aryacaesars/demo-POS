"use client"

import { useEffect } from "react"
import Sidebar from "@/components/sidebar"
import Navbar from "@/components/navbar"
import TransactionSection from "@/components/transaction-section"
import ProductList from "@/components/product-list"
import { useData } from "@/lib/data-context"
import { useSampleData } from "@/hooks/use-sample-data"
import { formatRupiah } from "@/lib/currency"
import { DollarSign, ShoppingBag, Package, TrendingUp } from "lucide-react"

export default function Dashboard() {
  const { getTransactionStats, products, getCartItemCount, isHydrated } = useData()
  const { seedSampleData } = useSampleData()
  
  // Show loading state during hydration to prevent mismatch
  if (!isHydrated) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col lg:ml-0">
          <Navbar />
          <main className="flex-1 p-6 overflow-auto">
            <div className="max-w-6xl mx-auto">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600">Loading...</p>
              </div>
              <div className="animate-pulse">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <div className="h-16 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }
  
  const stats = getTransactionStats()
  const cartItems = getCartItemCount()

  // Auto-seed sample data if no products exist
  useEffect(() => {
    if (isHydrated && products.length === 0) {
      seedSampleData()
    }
  }, [isHydrated, products.length, seedSampleData])

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col lg:ml-0">
        <Navbar />

        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Manage your sales and transactions</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <DollarSign className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Today's Revenue</p>
                    <p className="text-xl font-bold text-gray-900">{formatRupiah(stats.todayRevenue)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <ShoppingBag className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Transactions</p>
                    <p className="text-xl font-bold text-gray-900">{stats.todayTransactions}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Package className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Products</p>
                    <p className="text-xl font-bold text-gray-900">{products.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Cart Items</p>
                    <p className="text-xl font-bold text-gray-900">{cartItems}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main POS Interface */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <ProductList />
              <TransactionSection />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
