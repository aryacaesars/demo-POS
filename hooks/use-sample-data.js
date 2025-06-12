import { useData } from "@/lib/data-context"

export function useSampleData() {
  const { addProduct, createTransaction, clearCart, addToCart } = useData()

  const seedSampleData = () => {
    // Sample products
    const sampleProducts = [
      {
        name: "Nasi Gudeg",
        code: "NG001",
        category: "Makanan",
        price: 15000,
        stock: 50,
        description: "Gudeg khas Yogyakarta dengan ayam dan telur"
      },
      {
        name: "Es Teh Manis",
        code: "ETM001", 
        category: "Minuman",
        price: 5000,
        stock: 100,
        description: "Es teh manis segar"
      },
      {
        name: "Ayam Geprek",
        code: "AG001",
        category: "Makanan",
        price: 18000,
        stock: 30,
        description: "Ayam geprek pedas dengan sambal"
      },
      {
        name: "Kopi Hitam",
        code: "KH001",
        category: "Minuman",
        price: 8000,
        stock: 75,
        description: "Kopi hitam tubruk asli"
      },
      {
        name: "Soto Ayam",
        code: "SA001",
        category: "Makanan",
        price: 12000,
        stock: 40,
        description: "Soto ayam kuning dengan telur"
      },
      {
        name: "Juice Jeruk",
        code: "JJ001",
        category: "Minuman",
        price: 10000,
        stock: 60,
        description: "Jus jeruk segar tanpa gula"
      },
      {
        name: "Gado-gado",
        code: "GG001",
        category: "Makanan",
        price: 14000,
        stock: 25,
        description: "Gado-gado dengan bumbu kacang"
      },
      {
        name: "Air Mineral",
        code: "AM001",
        category: "Minuman",
        price: 3000,
        stock: 200,
        description: "Air mineral botol 600ml"
      }
    ]

    // Add sample products
    sampleProducts.forEach(product => {
      addProduct(product)
    })

    // Create some sample transactions
    setTimeout(() => {
      // Sample transaction 1
      const products = JSON.parse(localStorage.getItem('pos-products') || '[]')
      if (products.length > 0) {
        addToCart(products[0], 2) // Nasi Gudeg x2
        addToCart(products[1], 2) // Es Teh Manis x2
        createTransaction('cash', 50000)

        // Sample transaction 2  
        setTimeout(() => {
          addToCart(products[2], 1) // Ayam Geprek x1
          addToCart(products[3], 1) // Kopi Hitam x1
          createTransaction('cash', 30000)
        }, 100)

        // Sample transaction 3
        setTimeout(() => {
          addToCart(products[4], 3) // Soto Ayam x3
          addToCart(products[5], 2) // Juice Jeruk x2
          createTransaction('cash', 60000)
        }, 200)
      }
    }, 500)

    return true
  }

  return { seedSampleData }
}
