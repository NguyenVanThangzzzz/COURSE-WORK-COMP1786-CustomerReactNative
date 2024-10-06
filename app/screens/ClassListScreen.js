import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, SafeAreaView } from "react-native";
import { onValue, ref } from "firebase/database";
import { database } from "../firebaseConfig";

export default function ClassListScreen({ route }) {
    const { courseId } = route.params;
    const [classes, setClasses] = useState([]);

    useEffect(() => {
        console.log('ClassListScreen mounted. CourseId:', courseId);
        const classesRef = ref(database, "addClass");
        onValue(classesRef, (snapshot) => {
            const data = snapshot.val();
            console.log('Raw data from Firebase:', data);
            const classesList = data
                ? Object.entries(data)
                    .map(([key, value]) => ({ id: key, ...value }))
                    .filter(item => item.courseId === courseId)
                : [];
            console.log('Filtered classes:', classesList);
            setClasses(classesList);
        });
    }, [courseId]);

    console.log('Rendering ClassListScreen. Classes:', classes);

    const renderClassItem = ({ item }) => (
        <View style={styles.classItem}>
            <Text style={styles.classInfo}>Teacher: {item.teacher}</Text>
            <Text style={styles.classInfo}>Date: {item.date}</Text>
            <Text style={styles.classDescription}>Comments: {item.comments}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>Classes for Course</Text>
            {classes.length > 0 ? (
                <FlatList
                    data={classes}
                    renderItem={renderClassItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContainer}
                />
            ) : (
                <Text style={styles.noClasses}>No classes available for this course.</Text>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    header: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginVertical: 20,
        color: "#333",
    },
    listContainer: {
        paddingHorizontal: 16,
    },
    classItem: {
        backgroundColor: "#ffffff",
        borderRadius: 10,
        padding: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    classInfo: {
        fontSize: 16,
        marginBottom: 4,
        color: "#333",
    },
    classDescription: {
        fontSize: 14,
        fontStyle: "italic",
        marginTop: 8,
        color: "#666",
    },
    noClasses: {
        fontSize: 18,
        textAlign: "center",
        marginTop: 20,
        color: "#666",
    },
});