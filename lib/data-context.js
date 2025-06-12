'use client'

import { createContext, useContext } from 'react'
import { useLocalStorage } from '@/hooks/use-local-storage'

const DataContext = createContext()

export function DataProvider({ children }) {
  // Products data
  const [products, setProducts, isProductsHydrated] = useLocalStorage('pos-products', [])
  
  // Transactions data
  const [transactions, setTransactions, isTransactionsHydrated] = useLocalStorage('pos-transactions', [])
  
  // Current cart/selected products
  const [cart, setCart, isCartHydrated] = useLocalStorage('pos-cart', [])
  
  // Settings data
  const [settings, setSettings, isSettingsHydrated] = useLocalStorage('pos-settings', {
    businessName: 'My Store',
    currency: 'IDR',
    taxRate: 10,
    receiptFooter: 'Thank you for your purchase!'
  })

  // Check if all data is hydrated
  const isHydrated = isProductsHydrated && isTransactionsHydrated && isCartHydrated && isSettingsHydrated

  // Product functions
  const addProduct = (product) => {
    const newProduct = {
      ...product,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setProducts(prev => [...prev, newProduct])
    return newProduct
  }

  const updateProduct = (id, updates) => {
    setProducts(prev => 
      prev.map(product => 
        product.id === id 
          ? { ...product, ...updates, updatedAt: new Date().toISOString() }
          : product
      )
    )
  }

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(product => product.id !== id))
    // Also remove from cart if exists
    setCart(prev => prev.filter(item => item.id !== id))
  }

  const getProduct = (id) => {
    return products.find(product => product.id === id)
  }

  const searchProducts = (query) => {
    if (!query) return products
    return products.filter(product => 
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.code.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase())
    )
  }

  const getUniqueCategories = () => {
    const categories = [...new Set(products.map(p => p.category))]
    return categories.sort()
  }

  // Cart functions
  const addToCart = (product, quantity = 1) => {
    const existingItem = cart.find(item => item.id === product.id)
    
    if (existingItem) {
      setCart(prev => 
        prev.map(item => 
          item.id === product.id 
            ? { 
                ...item, 
                quantity: item.quantity + quantity,
                subtotal: (item.quantity + quantity) * item.price
              }
            : item
        )
      )
    } else {
      const cartItem = {
        ...product,
        quantity,
        subtotal: product.price * quantity,
        addedAt: new Date().toISOString()
      }
      setCart(prev => [...prev, cartItem])
    }
  }

  const updateCartQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }
    
    setCart(prev => 
      prev.map(item => 
        item.id === id 
          ? { 
              ...item, 
              quantity,
              subtotal: quantity * item.price
            }
          : item
      )
    )
  }

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id))
  }

  const clearCart = () => {
    setCart([])
  }

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.subtotal, 0)
  }

  const getCartItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0)
  }
  // Transaction functions
  const createTransaction = (paymentMethod = 'cash', customerPaid = 0, taxAmount = null) => {
    const total = getCartTotal()
    const tax = taxAmount !== null ? taxAmount : (total * settings.taxRate) / 100
    const grandTotal = total + tax
    const change = customerPaid - grandTotal

    const transaction = {
      id: Date.now().toString(),
      items: [...cart],
      subtotal: total,
      tax,
      total: grandTotal,
      paymentMethod,
      amountPaid: customerPaid,
      change: change > 0 ? change : 0,
      date: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      status: 'completed'
    }

    setTransactions(prev => [transaction, ...prev])
    
    // Update product stock
    cart.forEach(item => {
      updateProduct(item.id, { 
        stock: (getProduct(item.id)?.stock || 0) - item.quantity 
      })
    })
    
    // Clear cart
    clearCart()
    
    return transaction
  }

  const getTransactionsByDate = (startDate, endDate) => {
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.createdAt)
      return transactionDate >= startDate && transactionDate <= endDate
    })
  }

  const getTransactionStats = () => {
    const today = new Date()
    const startOfDay = new Date(today.setHours(0, 0, 0, 0))
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    
    const todayTransactions = getTransactionsByDate(startOfDay, new Date())
    const monthTransactions = getTransactionsByDate(startOfMonth, new Date())
    
    return {
      todayRevenue: todayTransactions.reduce((sum, t) => sum + t.total, 0),
      todayTransactions: todayTransactions.length,
      monthRevenue: monthTransactions.reduce((sum, t) => sum + t.total, 0),
      monthTransactions: monthTransactions.length,
      totalRevenue: transactions.reduce((sum, t) => sum + t.total, 0),
      totalTransactions: transactions.length
    }
  }

  // Settings functions
  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }))
  }
  const contextValue = {
    // Hydration state
    isHydrated,
    
    // Products
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    getProduct,
    searchProducts,
    getUniqueCategories,
    
    // Cart
    cart,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartItemCount,
    
    // Transactions
    transactions,
    createTransaction,
    getTransactionsByDate,
    getTransactionStats,
    
    // Settings
    settings,
    updateSettings
  }

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}
