"use client"

import { useState } from "react"
import { Search, Trash2, ShoppingCart } from "lucide-react"
import { formatRupiah } from "@/lib/currency"
import { useData } from "@/lib/data-context"
import PaymentModal from "./payment-modal"

export default function TransactionSection() {
  const { 
    products, 
    cart, 
    addToCart, 
    updateCartQuantity, 
    removeFromCart, 
    clearCart,
    getCartTotal,
    createTransaction,
    searchProducts,
    isHydrated
  } = useData()

  const [searchQuery, setSearchQuery] = useState("")
  const [showProducts, setShowProducts] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  // Show loading state during hydration
  if (!isHydrated) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">New Transaction</h2>
        </div>
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  const filteredProducts = searchProducts(searchQuery)
  const total = getCartTotal()

  const handleProductSelect = (product) => {
    addToCart(product, 1)
    setSearchQuery("")
    setShowProducts(false)
  }

  const handlePayment = () => {
    if (cart.length === 0) return
    setShowPaymentModal(true)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">New Transaction</h2>
      </div>

      <div className="p-6">
        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search product by name or code..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setShowProducts(e.target.value.length > 0)
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          />
          
          {/* Product Search Results */}
          {showProducts && filteredProducts.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
              {filteredProducts.slice(0, 10).map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleProductSelect(product)}
                  className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-600">Code: {product.code}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900">{formatRupiah(product.price)}</div>
                      <div className="text-sm text-gray-600">Stock: {product.stock}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Selected Products Table */}
        <div className="mb-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Product Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Qty</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Price</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Subtotal</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Action</th>
                </tr>
              </thead>
              <tbody>
                {cart.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-gray-500">
                      No products selected
                    </td>
                  </tr>
                ) : (
                  cart.map((product) => (
                    <tr key={product.id} className="border-b border-gray-100">
                      <td className="py-3 px-4 text-gray-900">{product.name}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateCartQuantity(product.id, product.quantity - 1)}
                            className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                          >
                            -
                          </button>
                          <span className="w-8 text-center">{product.quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(product.id, product.quantity + 1)}
                            className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-900">{formatRupiah(product.price)}</td>
                      <td className="py-3 px-4 text-gray-900">{formatRupiah(product.subtotal)}</td>
                      <td className="py-3 px-4">
                        <button onClick={() => removeFromCart(product.id)} className="text-red-600 hover:text-red-800 p-1">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Total and Pay Button */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="text-xl font-semibold text-gray-900">Total: {formatRupiah(total)}</div>
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Clear Cart
              </button>
            )}
          </div>
          <button
            onClick={handlePayment}
            disabled={cart.length === 0}
            className="px-6 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Pay Now
          </button>
        </div>
      </div>
      
      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        cart={cart}
        total={total}
      />
    </div>
  )
}
