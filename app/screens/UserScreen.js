import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { auth, database } from '../firebaseConfig';
import { signOut } from 'firebase/auth';
import { ref, onValue } from 'firebase/database';

export default function UserScreen({ navigation }) {
    const [purchasedItems, setPurchasedItems] = useState([]);

    useEffect(() => {
        const userId = auth.currentUser.uid;
        const userRef = ref(database, `users/${userId}/items`);

        const unsubscribe = onValue(userRef, (snapshot) => {
            const items = snapshot.val();
            if (items) {
                const itemsArray = Object.values(items);
                // Sắp xếp các mục theo thời gian mua, mới nhất lên đầu
                itemsArray.sort((a, b) => b.purchaseTimestamp - a.purchaseTimestamp);
                setPurchasedItems(itemsArray);
            } else {
                setPurchasedItems([]);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleLogout = () => {
        signOut(auth).then(() => {
            navigation.replace('Login');
        }).catch((error) => {
            console.error('Logout error:', error);
        });
    };

    const renderPurchasedItem = (item, index) => (
        <View key={index} style={styles.itemContainer}>
            <Text style={styles.itemText}>{item.classType} - {item.date}</Text>
            <Text style={styles.itemText}>Teacher: {item.teacher}</Text>
            <Text style={styles.itemText}>Price: {item.pricePerClass}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={styles.title}>User Profile</Text>
                    <Text style={styles.email}>{auth.currentUser?.email}</Text>
                </View>

                <View style={styles.purchasedItemsSection}>
                    <Text style={styles.sectionTitle}>Purchased Classes</Text>
                    {purchasedItems.length > 0 ? (
                        purchasedItems.map(renderPurchasedItem)
                    ) : (
                        <Text style={styles.noItemsText}>No purchased classes yet.</Text>
                    )}
                </View>
            </ScrollView>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scrollContent: {
        flexGrow: 1,
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    email: {
        fontSize: 18,
        color: '#666',
    },
    purchasedItemsSection: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    itemContainer: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
    },
    itemText: {
        fontSize: 16,
        marginBottom: 5,
    },
    noItemsText: {
        fontSize: 16,
        fontStyle: 'italic',
        color: '#666',
    },
    logoutButton: {
        backgroundColor: '#ff3b30',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginHorizontal: 20,
        marginBottom: 20,
    },
    logoutButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});