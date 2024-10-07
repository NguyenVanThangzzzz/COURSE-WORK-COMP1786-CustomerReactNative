import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { auth, database } from '../firebaseConfig';
import { ref, onValue, update, get } from 'firebase/database';
import { Ionicons } from '@expo/vector-icons';

export default function CartScreen() {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const userId = auth.currentUser.uid;
        const userRef = ref(database, `users/${userId}`);

        const unsubscribe = onValue(userRef, (snapshot) => {
            const userData = snapshot.val();
            if (userData && userData.cart) {
                setCartItems(Object.values(userData.cart));
            } else {
                setCartItems([]);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleCheckout = () => {
        Alert.alert(
            "Checkout",
            "Confirm your purchase?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "OK", onPress: () => processCheckout() }
            ]
        );
    };

    const processCheckout = async () => {
        const userId = auth.currentUser.uid;
        const userRef = ref(database, `users/${userId}`);

        try {
            const snapshot = await get(userRef);
            const userData = snapshot.val() || {};

            const timestamp = Date.now();
            const purchasedItems = cartItems.map(item => ({
                ...item,
                purchaseTimestamp: timestamp
            }));

            // Kiểm tra xem userData.items có tồn tại không
            const currentItems = userData.items || [];
            const updatedItems = [...currentItems, ...purchasedItems];

            await update(userRef, {
                items: updatedItems,
                cart: null // Xóa giỏ hàng
            });

            Alert.alert("Thành công", "Cảm ơn bạn đã mua hàng!");
            setCartItems([]); // Cập nhật state local
        } catch (error) {
            console.error("Lỗi khi xử lý thanh toán: ", error);
            Alert.alert("Lỗi", "Không thể xử lý thanh toán. Vui lòng thử lại.");
        }
    };

    const deleteCartItem = async (itemId) => {
        const userId = auth.currentUser.uid;
        const userRef = ref(database, `users/${userId}`);

        try {
            const snapshot = await get(userRef);
            const userData = snapshot.val() || {};
            const currentCart = userData.cart || {};

            delete currentCart[itemId];

            await update(userRef, { cart: currentCart });
            Alert.alert("Success", "Item removed from cart!");
        } catch (error) {
            console.error("Error removing item from cart: ", error);
            Alert.alert("Error", "Failed to remove item from cart. Please try again.");
        }
    };

    const deleteAllCartItems = async () => {
        const userId = auth.currentUser.uid;
        const userRef = ref(database, `users/${userId}`);

        try {
            await update(userRef, { cart: null });
            Alert.alert("Success", "All items removed from cart!");
        } catch (error) {
            console.error("Error removing all items from cart: ", error);
            Alert.alert("Error", "Failed to remove all items from cart. Please try again.");
        }
    };

    const renderCartItem = ({ item }) => (
        <View style={styles.cartItem}>
            <View style={styles.itemInfo}>
                <Text style={styles.itemText}>{item.classType} - {item.date}</Text>
                <Text style={styles.itemText}>Teacher: {item.teacher}</Text>
                <Text style={styles.itemText}>Price: {item.pricePerClass}</Text>
            </View>
            <TouchableOpacity onPress={() => deleteCartItem(item.id)} style={styles.deleteButton}>
                <Ionicons name="trash-outline" size={24} color="red" />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Your Cart</Text>
            {cartItems.length > 0 ? (
                <>
                    <FlatList
                        data={cartItems}
                        renderItem={renderCartItem}
                        keyExtractor={(item) => item.id}
                    />
                    <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
                        <Text style={styles.checkoutButtonText}>Checkout</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.deleteAllButton} onPress={deleteAllCartItems}>
                        <Text style={styles.deleteAllButtonText}>Delete All</Text>
                    </TouchableOpacity>
                </>
            ) : (
                <Text style={styles.emptyCartText}>Your cart is empty</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    cartItem: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemInfo: {
        flex: 1,
    },
    itemText: {
        fontSize: 16,
        marginBottom: 5,
    },
    deleteButton: {
        padding: 5,
    },
    checkoutButton: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    checkoutButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    deleteAllButton: {
        backgroundColor: 'red',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    deleteAllButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    emptyCartText: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 50,
    },
});