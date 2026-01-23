'use client';

import { useCart } from "@/context/CartContext";
import { CartDrawer } from "@/components/common/UI";

export const CartDrawerWrapper = () => {
    const { isCartOpen, toggleCart, cart, removeFromCart, updateQuantity, cartTotal } = useCart();

    return (
        <CartDrawer 
            isOpen={isCartOpen} 
            onClose={toggleCart} 
            cart={cart} 
            onRemove={removeFromCart} 
            onUpdateQty={updateQuantity}
            total={cartTotal}
        />
    );
}