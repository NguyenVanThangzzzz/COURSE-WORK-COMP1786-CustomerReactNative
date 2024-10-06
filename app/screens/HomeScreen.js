import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, SafeAreaView, TouchableOpacity } from "react-native";
import { onValue, ref } from "firebase/database";
import { database } from "../firebaseConfig";

export default function HomeScreen({ navigation }) {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const coursesRef = ref(database, "courses");

        onValue(coursesRef, (snapshot) => {
            const coursesData = snapshot.val();
            const coursesList = coursesData ? Object.entries(coursesData).map(([courseId, courseValue]) => {
                const classes = Object.entries(courseValue)
                    .filter(([key, value]) => typeof value === 'object' && value.teacher && value.date && value.comments)
                    .map(([classId, classValue]) => ({
                        id: classId,
                        ...classValue
                    }));

                const { capacity, classType, dayOfWeek, description, duration, pricePerClass, timeOfCourse } = courseValue;

                return {
                    id: courseId,
                    capacity,
                    classType,
                    dayOfWeek,
                    description,
                    duration,
                    pricePerClass,
                    timeOfCourse,
                    classes
                };
            }) : [];

            setCourses(coursesList);
        });
    }, []);

    const renderCourseItem = ({ item }) => (
        <TouchableOpacity onPress={() => navigation.navigate('ClassList', { course: item })}>
            <View style={styles.courseItem}>
                <Text style={styles.courseTitle}>{item.classType} Class</Text>
                <Text style={styles.courseInfo}>Day: {item.dayOfWeek}</Text>
                <Text style={styles.courseInfo}>Time: {item.timeOfCourse}</Text>
                <Text style={styles.courseInfo}>Capacity: {item.capacity}</Text>
                <Text style={styles.courseInfo}>Duration: {item.duration}</Text>
                <Text style={styles.courseInfo}>Price per Class: {item.pricePerClass}</Text>
                <Text style={styles.courseDescription}>Description: {item.description}</Text>
                <Text style={styles.classCount}>Number of Classes: {item.classes.length}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>Available Courses</Text>
            <FlatList
                data={courses}
                renderItem={renderCourseItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContainer}
            />
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
    courseItem: {
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
    courseTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 8,
        color: "#007AFF",
    },
    courseInfo: {
        fontSize: 16,
        marginBottom: 4,
        color: "#333",
    },
    courseDescription: {
        fontSize: 14,
        fontStyle: "italic",
        marginTop: 8,
        marginBottom: 8,
        color: "#666",
    },
    classCount: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#007AFF',
        marginTop: 8,
    },
    classesHeader: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 16,
        marginBottom: 8,
        color: '#333',
    },
    classItem: {
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
    },
    classInfo: {
        fontSize: 14,
        color: '#444',
        marginBottom: 4,
    },
    noClassesText: {
        fontSize: 14,
        fontStyle: 'italic',
        color: '#666',
        marginTop: 8,
    },
});