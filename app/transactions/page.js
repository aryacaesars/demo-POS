"use client"

import { useState } from "react"
import Sidebar from "@/components/sidebar"
import Navbar from "@/components/navbar"
import { useData } from "@/lib/data-context"
import { formatRupiah } from "@/lib/currency"
import { Calendar, Receipt, Search } from "lucide-react"

export default function TransactionsPage() {
  const { transactions } = useData()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDate, setSelectedDate] = useState("")

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDate = selectedDate ? 
      new Date(transaction.createdAt).toDateString() === new Date(selectedDate).toDateString() : true
    return matchesSearch && matchesDate
  })

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col lg:ml-0">
        <Navbar />

        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
                <p className="text-gray-600">View and manage your sales history</p>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search by transaction ID..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-4 px-6 font-medium text-gray-900">Transaction ID</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-900">Date</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-900">Items</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-900">Total</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-900">Payment</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-900">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center py-12 text-gray-500">
                          <div className="flex flex-col items-center">
                            <Receipt className="h-12 w-12 text-gray-300 mb-4" />
                            <p>No transactions found</p>
                            <p className="text-sm">
                              {transactions.length === 0 
                                ? "Start making sales to see transaction history"
                                : "Try adjusting your search criteria"
                              }
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredTransactions.map((transaction) => (
                        <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-6 text-gray-900 font-mono text-sm">
                            #{transaction.id.slice(-8)}
                          </td>
                          <td className="py-4 px-6 text-gray-900">
                            {formatDate(transaction.createdAt)}
                          </td>
                          <td className="py-4 px-6 text-gray-900">
                            {transaction.items.length} item(s)
                          </td>
                          <td className="py-4 px-6 text-gray-900 font-medium">
                            {formatRupiah(transaction.total)}
                          </td>
                          <td className="py-4 px-6 text-gray-900 capitalize">
                            {transaction.paymentMethod}
                          </td>
                          <td className="py-4 px-6">
                            <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                              {transaction.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
