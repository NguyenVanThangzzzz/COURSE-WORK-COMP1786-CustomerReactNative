import React from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView } from 'react-native';

export default function ClassListScreen({ route }) {
    const { course } = route.params;

    const renderClassItem = ({ item }) => (
        <View style={styles.classItem}>
            <Text style={styles.classInfo}>Teacher: {item.teacher}</Text>
            <Text style={styles.classInfo}>Date: {item.date}</Text>
            <Text style={styles.classInfo}>Comments: {item.comments}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>{course.classType} Course</Text>
            <View style={styles.courseInfo}>
                <Text style={styles.courseInfoText}>Day: {course.dayOfWeek}</Text>
                <Text style={styles.courseInfoText}>Time: {course.timeOfCourse}</Text>
                <Text style={styles.courseInfoText}>Capacity: {course.capacity}</Text>
                <Text style={styles.courseInfoText}>Duration: {course.duration}</Text>
                <Text style={styles.courseInfoText}>Price per Class: {course.pricePerClass}</Text>
            </View>
            <Text style={styles.classesHeader}>Classes:</Text>
            {course.classes && course.classes.length > 0 ? (
                <FlatList
                    data={course.classes}
                    renderItem={renderClassItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContainer}
                />
            ) : (
                <Text style={styles.noClassesText}>No classes available for this course.</Text>
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
    courseInfo: {
        backgroundColor: "#ffffff",
        borderRadius: 10,
        padding: 16,
        marginHorizontal: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    courseInfoText: {
        fontSize: 16,
        marginBottom: 4,
        color: "#333",
    },
    classesHeader: {
        fontSize: 20,
        fontWeight: "bold",
        marginHorizontal: 16,
        marginTop: 20,
        marginBottom: 10,
        color: "#007AFF",
    },
    listContainer: {
        paddingHorizontal: 16,
    },
    classItem: {
        backgroundColor: '#ffffff',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    classInfo: {
        fontSize: 14,
        color: '#444',
        marginBottom: 4,
    },
    noClassesText: {
        fontSize: 16,
        fontStyle: 'italic',
        color: '#666',
        textAlign: 'center',
        marginTop: 20,
        marginHorizontal: 16,
    },
});