import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { auth, database } from '../firebaseConfig';
import { ref, onValue, remove, update, get } from 'firebase/database';

export default function CartScreen() {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const userId = auth.currentUser.uid;
        const cartRef = ref(database, `carts/${userId}`);

        const unsubscribe = onValue(cartRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const items = Object.entries(data).map(([key, value]) => ({
                    id: key,
                    ...value,
                }));
                setCartItems(items);
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
        const cartRef = ref(database, `carts/${userId}`);

        try {
            // Get current user data
            const userSnapshot = await get(userRef);
            const userData = userSnapshot.val() || {};

            // Get current timestamp
            const timestamp = Date.now();

            // Prepare new purchase data
            const newPurchase = {
                timestamp: timestamp,
                items: cartItems
            };

            // Update user data with new purchase
            const updatedPurchases = userData.purchases ? [...userData.purchases, newPurchase] : [newPurchase];

            await update(userRef, { purchases: updatedPurchases });

            // Clear the cart
            await remove(cartRef);

            Alert.alert("Success", "Thank you for your purchase!");
        } catch (error) {
            console.error("Error processing checkout: ", error);
            Alert.alert("Error", "Failed to process your purchase. Please try again.");
        }
    };

    const renderCartItem = ({ item }) => (
        <View style={styles.cartItem}>
            <Text style={styles.itemText}>{item.classType} - {item.date}</Text>
            <Text style={styles.itemText}>Teacher: {item.teacher}</Text>
            <Text style={styles.itemText}>Price: {item.pricePerClass}</Text>
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
    },
    itemText: {
        fontSize: 16,
        marginBottom: 5,
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
    emptyCartText: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 50,
    },
});