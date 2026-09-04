import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { getHospitalDetails, HospitalDetails } from "../services/api";

type HospitalDetailsProps = {
  route: { params?: { hospitalId?: string } };
  navigation: { goBack: () => void; navigate: (screen: string, params?: unknown) => void };
};

export default function HospitalDetailsScreen({ route, navigation }: HospitalDetailsProps) {
  const hospitalId = route.params?.hospitalId;
  const [details, setDetails] = useState<HospitalDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadDetails = useCallback(async (refresh = false) => {
    if (!hospitalId) {
      setError("Hospital information is unavailable.");
      setIsLoading(false);
      return;
    }
    if (refresh) setIsRefreshing(true);
    else setIsLoading(true);
    setError("");
    try {
      setDetails(await getHospitalDetails(hospitalId));
    } catch (requestError: any) {
      setError(requestError?.response?.data?.message ?? "We could not load this hospital right now.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [hospitalId]);

  useEffect(() => {
    loadDetails();
  }, [loadDetails]);

  if (isLoading) {
    return <View style={styles.state}><ActivityIndicator color="#147D92" size="large" /><Text style={styles.stateText}>Loading hospital details...</Text></View>;
  }

  if (error || !details) {
    return (
      <View style={styles.state}>
        <Text style={styles.error}>{error || "Hospital not found."}</Text>
        <Pressable onPress={() => loadDetails()} style={styles.retry}><Text style={styles.retryText}>Try again</Text></Pressable>
      </View>
    );
  }

  const { hospital, departments, doctors } = details;
  const emergencyAvailable = hospital.emergency_status === "AVAILABLE";

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={() => loadDetails(true)} tintColor="#147D92" />}
        showsVerticalScrollIndicator={false}
      >
        <Pressable onPress={navigation.goBack} style={styles.back}><Text style={styles.backText}>‹  All hospitals</Text></Pressable>
        <View style={styles.heroIcon}><Text style={styles.heroIconText}>+</Text></View>
        <Text style={styles.title}>{hospital.name}</Text>
        <Text style={styles.address}>{hospital.address}</Text>
        {!!hospital.phone && <Text style={styles.phone}>{hospital.phone}</Text>}
        <View style={[styles.emergencyBanner, emergencyAvailable ? styles.emergencyOpen : styles.emergencyCheck]}>
          <View style={[styles.statusDot, !emergencyAvailable && styles.statusDotMuted]} />
          <Text style={styles.emergencyText}>{emergencyAvailable ? "Emergency services available" : "Check emergency availability"}</Text>
        </View>

        <Text style={styles.sectionTitle}>At a glance</Text>
        <View style={styles.statsGrid}>
          <Metric label="Available beds" value={hospital.available_beds ?? "-"} />
          <Metric label="Emergency queue" value={hospital.emergency_queue ?? "-"} />
          <Metric label="Doctors available" value={hospital.doctors_available ?? "-"} />
          <Metric label="Departments" value={departments.length} />
        </View>

        <Text style={styles.sectionTitle}>Departments</Text>
        <View style={styles.chips}>{departments.length ? departments.map((department) => <View key={department.id} style={styles.chip}><Text style={styles.chipText}>{department.name}</Text></View>) : <Text style={styles.muted}>No departments listed.</Text>}</View>

        <Text style={styles.sectionTitle}>Medical team</Text>
        <View style={styles.doctorList}>
          {doctors.length ? doctors.map((doctor) => (
            <View key={doctor.id} style={styles.doctorCard}>
              <View style={styles.doctorAvatar}><Text style={styles.doctorAvatarText}>{doctor.doctor_name.charAt(0).toUpperCase()}</Text></View>
              <View style={styles.doctorInfo}><Text style={styles.doctorName}>{doctor.doctor_name}</Text><Text style={styles.specialization}>{doctor.specialization || doctor.department_name || "Medical specialist"}</Text></View>
              <View style={[styles.availability, !doctor.available && styles.unavailable]}><Text style={styles.availabilityText}>{doctor.available ? "Available" : "Busy"}</Text></View>
            </View>
          )) : <Text style={styles.muted}>No doctors listed.</Text>}
        </View>

        <Pressable onPress={() => navigation.navigate("BookAppointment", { hospitalId: hospital.id })} style={styles.bookButton}><Text style={styles.bookButtonText}>Book an appointment</Text></Pressable>
      </ScrollView>
    </View>
  );
}

function Metric({ label, value }: { label: string; value: number | string }) {
  return <View style={styles.metric}><Text style={styles.metricValue}>{value}</Text><Text style={styles.metricLabel}>{label}</Text></View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F4F8FB" },
  content: { padding: 24, paddingBottom: 40 },
  back: { marginBottom: 22 },
  backText: { color: "#147D92", fontSize: 14, fontWeight: "700" },
  heroIcon: { alignItems: "center", backgroundColor: "#D9EEF0", borderRadius: 18, height: 68, justifyContent: "center", marginBottom: 18, width: 68 },
  heroIconText: { color: "#147D92", fontSize: 38, fontWeight: "300" },
  title: { color: "#18333D", fontSize: 29, fontWeight: "800", lineHeight: 35, marginBottom: 8 },
  address: { color: "#60747D", fontSize: 15, lineHeight: 21 },
  phone: { color: "#147D92", fontSize: 14, marginTop: 7 },
  emergencyBanner: { alignItems: "center", borderRadius: 12, flexDirection: "row", marginTop: 20, padding: 14 },
  emergencyOpen: { backgroundColor: "#E2F3EA" },
  emergencyCheck: { backgroundColor: "#FFF4D9" },
  statusDot: { backgroundColor: "#3DAA78", borderRadius: 5, height: 10, marginRight: 9, width: 10 },
  statusDotMuted: { backgroundColor: "#D6A547" },
  emergencyText: { color: "#41665A", fontSize: 13, fontWeight: "700" },
  sectionTitle: { color: "#18333D", fontSize: 19, fontWeight: "700", marginBottom: 14, marginTop: 30 },
  statsGrid: { backgroundColor: "#FFFFFF", borderColor: "#DCE8EC", borderRadius: 16, borderWidth: 1, flexDirection: "row", flexWrap: "wrap", padding: 8 },
  metric: { padding: 12, width: "50%" },
  metricValue: { color: "#147D92", fontSize: 23, fontWeight: "800" },
  metricLabel: { color: "#71838A", fontSize: 11, marginTop: 4 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { backgroundColor: "#D9EEF0", borderRadius: 18, paddingHorizontal: 14, paddingVertical: 9 },
  chipText: { color: "#176A79", fontSize: 13, fontWeight: "600" },
  muted: { color: "#71838A", fontSize: 14 },
  doctorList: { gap: 10 },
  doctorCard: { alignItems: "center", backgroundColor: "#FFFFFF", borderColor: "#DCE8EC", borderRadius: 14, borderWidth: 1, flexDirection: "row", padding: 13 },
  doctorAvatar: { alignItems: "center", backgroundColor: "#EAF2F3", borderRadius: 19, height: 38, justifyContent: "center", marginRight: 11, width: 38 },
  doctorAvatarText: { color: "#147D92", fontSize: 16, fontWeight: "800" },
  doctorInfo: { flex: 1 },
  doctorName: { color: "#294650", fontSize: 14, fontWeight: "700", marginBottom: 4 },
  specialization: { color: "#84939A", fontSize: 12 },
  availability: { backgroundColor: "#E2F3EA", borderRadius: 10, paddingHorizontal: 8, paddingVertical: 5 },
  unavailable: { backgroundColor: "#F2E9E6" },
  availabilityText: { color: "#3D8A68", fontSize: 10, fontWeight: "700" },
  bookButton: { alignItems: "center", backgroundColor: "#147D92", borderRadius: 12, height: 54, justifyContent: "center", marginTop: 30 },
  bookButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
  state: { alignItems: "center", backgroundColor: "#F4F8FB", flex: 1, justifyContent: "center", padding: 24 },
  stateText: { color: "#71838A", fontSize: 14, marginTop: 12 },
  error: { color: "#B83A45", fontSize: 14, textAlign: "center" },
  retry: { backgroundColor: "#147D92", borderRadius: 10, marginTop: 18, paddingHorizontal: 20, paddingVertical: 11 },
  retryText: { color: "#FFFFFF", fontSize: 14, fontWeight: "700" },
});
