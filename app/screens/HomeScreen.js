import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, SafeAreaView, TouchableOpacity, TextInput } from "react-native";
import { onValue, ref } from "firebase/database";
import { database } from "../firebaseConfig";

export default function HomeScreen({ navigation }) {
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

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
            setFilteredCourses(coursesList);
        });
    }, []);

    useEffect(() => {
        filterCourses();
    }, [searchQuery, courses]);

    const filterCourses = () => {
        if (searchQuery.trim() === "") {
            setFilteredCourses(courses);
            return;
        }

        const lowercasedQuery = searchQuery.toLowerCase();
        const filtered = courses.filter(course =>
            course.classType.toLowerCase().includes(lowercasedQuery) ||
            course.timeOfCourse.toLowerCase().includes(lowercasedQuery) ||
            course.classes.some(classItem =>
                classItem.date.toLowerCase().includes(lowercasedQuery) ||
                classItem.teacher.toLowerCase().includes(lowercasedQuery)
            )
        );

        setFilteredCourses(filtered);
    };

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
                <Text style={styles.classesHeader}>Classes:</Text>
                {item.classes.map((classItem, index) => (
                    <View key={index} style={styles.classItem}>
                        <Text style={styles.classInfo}>Date: {classItem.date}</Text>
                        <Text style={styles.classInfo}>Teacher: {classItem.teacher}</Text>
                    </View>
                ))}
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>Available Courses</Text>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search by course name, time, class date or teacher"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>
            <FlatList
                data={filteredCourses}
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
    searchContainer: {
        paddingHorizontal: 16,
        marginBottom: 10,
    },
    searchInput: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
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
        marginTop: 10,
        marginBottom: 5,
    },
    classItem: {
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
        padding: 10,
        marginBottom: 5,
    },
    classInfo: {
        fontSize: 14,
        color: '#333',
    },
});