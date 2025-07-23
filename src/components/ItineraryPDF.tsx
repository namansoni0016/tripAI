import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: 'Helvetica',
    },
    title: {
        fontSize: 22,
        marginBottom: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#3B82F6',
    },
    day: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 15,
        marginBottom: 8,
        color: '#111827',
    },
    activity: {
        fontSize: 12,
        marginBottom: 6,
        flexDirection: 'row',
    },
    time: {
        width: 70,
        fontWeight: 'semibold',
    },
    description: {
        flex: 1,
    }
});

interface Activity {
    time: string;
    description: string;
}

interface DayPlan {
    day: string;
    activities: Activity[];
}

interface ItineraryPDFProps {
    title: string;
    itinerary: DayPlan[];
}

const ItineraryPDF = ({title, itinerary} : ItineraryPDFProps) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <Text style={styles.title}>{title}</Text>
            {itinerary.map((dayPlan, index) => (
                <View key={index}>
                    <Text style={styles.day}>Day {dayPlan.day}</Text>
                    {dayPlan.activities.map((activity, idx) => (
                        <View key={idx} style={styles.activity}>
                            <Text style={styles.time}>{activity.time}</Text>
                            <Text style={styles.description}>{activity.description}</Text>
                        </View>
                    ))}
                </View>
            ))}
        </Page>
    </Document>
);

export default ItineraryPDF;