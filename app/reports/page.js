"use client"

import Sidebar from "@/components/sidebar"
import Navbar from "@/components/navbar"
import { useData } from "@/lib/data-context"
import { formatRupiah } from "@/lib/currency"
import { TrendingUp, DollarSign, ShoppingBag, Package } from "lucide-react"

export default function ReportsPage() {
  const { getTransactionStats, products, transactions } = useData()
  const stats = getTransactionStats()

  const topSellingProducts = () => {
    const productSales = {}
    
    transactions.forEach(transaction => {
      transaction.items.forEach(item => {
        if (productSales[item.id]) {
          productSales[item.id].quantity += item.quantity
          productSales[item.id].revenue += item.subtotal
        } else {
          productSales[item.id] = {
            name: item.name,
            quantity: item.quantity,
            revenue: item.subtotal
          }
        }
      })
    })

    return Object.entries(productSales)
      .sort(([,a], [,b]) => b.quantity - a.quantity)
      .slice(0, 5)
      .map(([id, data]) => ({ id, ...data }))
  }

  const lowStockProducts = products.filter(product => product.stock <= 10)
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col lg:ml-0">
        <Navbar />

        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
              <p className="text-gray-600">View sales analytics and reports</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <DollarSign className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Today's Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">{formatRupiah(stats.todayRevenue)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <ShoppingBag className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Today's Transactions</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.todayTransactions}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">{formatRupiah(stats.monthRevenue)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Package className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Products</p>
                    <p className="text-2xl font-bold text-gray-900">{products.length}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Selling Products */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Top Selling Products</h3>
                </div>
                <div className="p-6">
                  {topSellingProducts().length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No sales data available</p>
                  ) : (
                    <div className="space-y-4">
                      {topSellingProducts().map((product, index) => (
                        <div key={product.id} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                              {index + 1}
                            </div>
                            <div className="ml-3">
                              <p className="font-medium text-gray-900">{product.name}</p>
                              <p className="text-sm text-gray-600">{product.quantity} sold</p>
                            </div>
                          </div>
                          <p className="font-medium text-gray-900">{formatRupiah(product.revenue)}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Low Stock Alert */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Low Stock Alert</h3>
                </div>
                <div className="p-6">
                  {lowStockProducts.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">All products are well stocked</p>
                  ) : (
                    <div className="space-y-4">
                      {lowStockProducts.map((product) => (
                        <div key={product.id} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">{product.name}</p>
                            <p className="text-sm text-gray-600">{product.code}</p>
                          </div>
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            product.stock === 0
                              ? "bg-red-100 text-red-800"
                              : product.stock <= 5
                                ? "bg-orange-100 text-orange-800"
                                : "bg-yellow-100 text-yellow-800"
                          }`}>
                            {product.stock} left
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
