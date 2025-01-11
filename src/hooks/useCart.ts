import { useEffect, useMemo, useState } from "react"
import { db } from "../data/db"
import type { CartItem, Guitar } from "../types"

export const useCart = () => {

    const initialCart = (): CartItem[] => {
        const localStorageCart = localStorage.getItem('cart')
        return localStorageCart ? JSON.parse(localStorageCart) : []
    }

    const [data] = useState(db)
    const [cart, setCart] = useState(initialCart)
    const MAX_LIMIT_QUANTITY = 5
    const MIN_LIMIT_QUANTITY = 1

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart))
    }, [cart])

    function addToCart(item: Guitar) {

        const exist = cart.findIndex(guitar => guitar.id === item.id)

        if (exist === -1) {
            const newItem: CartItem = { ...item, quantity: 1 }
            setCart([...cart, newItem])
        } else {
            const updatedCart = [...cart]
            updatedCart[exist].quantity++
            setCart(updatedCart)
            console.log('Existe')
        }

        console.log(item)
    }

    function removeFromCart(id: Guitar['id']) {
        console.log(`Eliminando: ${id}`)
        setCart(prevCart => prevCart.filter(item => item.id !== id))
    }

    function changeQuantity(id: Guitar['id'], quantity: number) {
        console.log(`Cambiando: ${id}`)
        const updatedCart = cart.map(item => {
            if (item.id === id && item.quantity < MAX_LIMIT_QUANTITY && quantity > 0) {
                item.quantity += quantity
                return { ...item }
            } else if (item.id === id && item.quantity > MIN_LIMIT_QUANTITY && quantity < 0) {
                item.quantity += quantity
                return { ...item }
            }
            return item
        })
        setCart(updatedCart)
    }

    function clearCart() {
        setCart([])
    }

     // State derivados
     const isEmpty = useMemo ( () => cart.length === 0, [cart])
     const cartTotal = useMemo ( () => cart.reduce((total, item) => total + item.quantity * item.price, 0), [cart])
 

    return {
        data,
        cart,
        addToCart,
        removeFromCart,
        changeQuantity,
        clearCart,
        isEmpty,
        cartTotal
    }
}