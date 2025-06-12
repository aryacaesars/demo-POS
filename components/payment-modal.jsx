"use client"

import { useState } from "react"
import { X, CreditCard, Smartphone, Printer, CheckCircle } from "lucide-react"
import { formatRupiah } from "@/lib/currency"
import { useData } from "@/lib/data-context"

export default function PaymentModal({ isOpen, onClose, cart, total }) {
  const { createTransaction, clearCart, settings } = useData()
  const [paymentMethod, setPaymentMethod] = useState("cash")
  const [amountPaid, setAmountPaid] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [transaction, setTransaction] = useState(null)
  
  const subtotal = total
  const taxAmount = (subtotal * settings.taxRate) / 100
  const finalTotal = subtotal + taxAmount
  const change = amountPaid ? Math.max(0, parseFloat(amountPaid) - finalTotal) : 0

  const handlePayment = async () => {
    if (cart.length === 0) return
    
    if (paymentMethod === "cash" && (!amountPaid || parseFloat(amountPaid) < finalTotal)) {
      alert("Amount paid must be greater than or equal to total amount")
      return
    }

    setIsProcessing(true)
    
    // Simulate payment processing
    setTimeout(() => {
      const newTransaction = createTransaction(
        paymentMethod, 
        paymentMethod === "cash" ? parseFloat(amountPaid) : finalTotal,
        taxAmount
      )
      setTransaction(newTransaction)
      setIsProcessing(false)
    }, 1500)
  }

  const handlePrintReceipt = () => {
    if (!transaction) return
    
    const receiptContent = generateReceiptHTML(transaction)
    const printWindow = window.open('', '_blank')
    printWindow.document.write(receiptContent)
    printWindow.document.close()
    printWindow.print()
  }

  const generateReceiptHTML = (transaction) => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Receipt</title>
          <style>
            body { 
              font-family: 'Courier New', monospace; 
              width: 300px; 
              margin: 0 auto; 
              padding: 20px;
              font-size: 12px;
            }
            .header { text-align: center; margin-bottom: 20px; }
            .line { border-bottom: 1px dashed #333; margin: 10px 0; }
            .row { display: flex; justify-content: space-between; margin: 5px 0; }
            .total { font-weight: bold; font-size: 14px; }
            .footer { text-align: center; margin-top: 20px; font-size: 10px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>${settings.businessName}</h2>
            <p>Transaction #${transaction.id}</p>
            <p>${new Date(transaction.date).toLocaleString('id-ID')}</p>
          </div>
          
          <div class="line"></div>
          
          ${transaction.items.map(item => `
            <div class="row">
              <span>${item.name}</span>
              <span>${formatRupiah(item.subtotal)}</span>
            </div>
            <div class="row" style="font-size: 10px; color: #666;">
              <span>${item.quantity} x ${formatRupiah(item.price)}</span>
              <span></span>
            </div>
          `).join('')}
          
          <div class="line"></div>
          
          <div class="row">
            <span>Subtotal:</span>
            <span>${formatRupiah(transaction.subtotal)}</span>
          </div>
          
          <div class="row">
            <span>Tax (${settings.taxRate}%):</span>
            <span>${formatRupiah(transaction.tax)}</span>
          </div>
          
          <div class="row total">
            <span>Total:</span>
            <span>${formatRupiah(transaction.total)}</span>
          </div>
          
          <div class="row">
            <span>Payment (${transaction.paymentMethod.toUpperCase()}):</span>
            <span>${formatRupiah(transaction.amountPaid)}</span>
          </div>
          
          ${transaction.paymentMethod === 'cash' && transaction.change > 0 ? `
            <div class="row">
              <span>Change:</span>
              <span>${formatRupiah(transaction.change)}</span>
            </div>
          ` : ''}
          
          <div class="line"></div>
          
          <div class="footer">
            <p>${settings.receiptFooter}</p>
            <p>Powered by POS System</p>
          </div>
        </body>
      </html>
    `
  }

  const handleNewTransaction = () => {
    clearCart()
    setTransaction(null)
    setAmountPaid("")
    setPaymentMethod("cash")
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {transaction ? "Payment Complete" : "Payment Details"}
          </h2>
          <button
            onClick={transaction ? handleNewTransaction : onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {transaction ? (
            /* Payment Success */
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Successful!</h3>
              <p className="text-gray-600 mb-6">Transaction ID: #{transaction.id}</p>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total Amount:</span>
                    <span className="font-semibold">{formatRupiah(transaction.total)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Method:</span>
                    <span className="font-semibold uppercase">{transaction.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Amount Paid:</span>
                    <span className="font-semibold">{formatRupiah(transaction.amountPaid)}</span>
                  </div>
                  {transaction.change > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Change:</span>
                      <span className="font-semibold">{formatRupiah(transaction.change)}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={handlePrintReceipt}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Print Receipt
                </button>
                
                <button
                  onClick={handleNewTransaction}
                  className="w-full bg-gray-900 text-white py-3 px-4 rounded-md hover:bg-gray-800 transition-colors"
                >
                  New Transaction
                </button>
              </div>
            </div>
          ) : (
            /* Payment Form */
            <>
              {/* Order Summary */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Order Summary</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="space-y-2 text-sm">
                    {cart.map((item) => (
                      <div key={item.id} className="flex justify-between">
                        <span>{item.name} x{item.quantity}</span>
                        <span>{formatRupiah(item.subtotal)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Price Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{formatRupiah(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax ({settings.taxRate}%):</span>
                    <span>{formatRupiah(taxAmount)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total:</span>
                      <span>{formatRupiah(finalTotal)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Payment Method</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setPaymentMethod("cash")}
                    className={`p-4 border-2 rounded-lg transition-colors flex flex-col items-center ${
                      paymentMethod === "cash"
                        ? "border-gray-900 bg-gray-50 text-gray-900"
                        : "border-gray-300 text-gray-600 hover:border-gray-400"
                    }`}
                  >
                    <CreditCard className="h-6 w-6 mb-2" />
                    <span className="font-medium">Cash</span>
                  </button>
                  
                  <button
                    onClick={() => setPaymentMethod("qris")}
                    className={`p-4 border-2 rounded-lg transition-colors flex flex-col items-center ${
                      paymentMethod === "qris"
                        ? "border-gray-900 bg-gray-50 text-gray-900"
                        : "border-gray-300 text-gray-600 hover:border-gray-400"
                    }`}
                  >
                    <Smartphone className="h-6 w-6 mb-2" />
                    <span className="font-medium">QRIS</span>
                  </button>
                </div>
              </div>

              {/* Cash Payment Input */}
              {paymentMethod === "cash" && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount Paid
                  </label>
                  <input
                    type="number"
                    value={amountPaid}
                    onChange={(e) => setAmountPaid(e.target.value)}
                    placeholder={`Minimum: ${formatRupiah(finalTotal)}`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                  {amountPaid && parseFloat(amountPaid) >= finalTotal && (
                    <div className="mt-2 text-sm">
                      <span className="text-green-600 font-medium">
                        Change: {formatRupiah(change)}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* QRIS Payment */}
              {paymentMethod === "qris" && (
                <div className="mb-6 text-center">
                  <div className="bg-gray-100 rounded-lg p-8">
                    <div className="w-32 h-32 bg-white border-2 border-dashed border-gray-400 rounded-lg mx-auto flex items-center justify-center mb-4">
                      <span className="text-gray-500 text-sm">QR Code</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Scan QR code with your mobile banking app
                    </p>
                    <p className="text-lg font-semibold text-gray-900 mt-2">
                      {formatRupiah(finalTotal)}
                    </p>
                  </div>
                </div>
              )}

              {/* Process Payment Button */}
              <button
                onClick={handlePayment}
                disabled={
                  isProcessing || 
                  cart.length === 0 || 
                  (paymentMethod === "cash" && (!amountPaid || parseFloat(amountPaid) < finalTotal))
                }
                className="w-full bg-gray-900 text-white py-3 px-4 rounded-md hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  `Process Payment - ${formatRupiah(finalTotal)}`
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
