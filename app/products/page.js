"use client"

import { useState } from "react"
import Sidebar from "@/components/sidebar"
import Navbar from "@/components/navbar"
import ProductModal from "@/components/product-modal"
import { Plus, Edit, Trash2, Package, ShoppingCart } from "lucide-react"
import { formatRupiah } from "@/lib/currency"
import { useData } from "@/lib/data-context"

export default function ProductsPage() {
  const { products, deleteProduct, addToCart } = useData()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  const handleEditProduct = (product) => {
    setEditingProduct(product)
    setIsModalOpen(true)
  }

  const handleDeleteProduct = (productId) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteProduct(productId)
    }
  }

  const handleAddToCart = (product) => {
    addToCart(product, 1)
    alert(`${product.name} added to cart!`)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingProduct(null)
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
                <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                <p className="text-gray-600">Manage your product inventory</p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-4 px-6 font-medium text-gray-900">Product Name</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-900">Price</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-900">Stock</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center py-12 text-gray-500">
                          <div className="flex flex-col items-center">
                            <Package className="h-12 w-12 text-gray-300 mb-4" />
                            <p>No products found</p>
                            <p className="text-sm">Add your first product to get started</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      products.map((product) => (
                        <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-6 text-gray-900">{product.name}</td>
                          <td className="py-4 px-6 text-gray-900">{formatRupiah(product.price)}</td>
                          <td className="py-4 px-6">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                product.stock > 10
                                  ? "bg-green-100 text-green-800"
                                  : product.stock > 0
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                              }`}
                            >
                              {product.stock} units
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleAddToCart(product)}
                                className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                                title="Add to Cart"
                              >
                                <ShoppingCart className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleEditProduct(product)}
                                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                                title="Edit Product"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product.id)}
                                className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                                title="Delete Product"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
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

      <ProductModal isOpen={isModalOpen} onClose={closeModal} product={editingProduct} />
    </div>
  )
}
