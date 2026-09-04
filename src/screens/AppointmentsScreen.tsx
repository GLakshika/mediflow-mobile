import { useCallback, useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Pressable,
    RefreshControl,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { Appointment, cancelAppointment, getAppointments } from "../services/api";

type FilterStatus = "ALL" | "BOOKED" | "COMPLETED" | "CANCELLED";

const filters: { label: string; value: FilterStatus }[] = [
  { label: "All", value: "ALL" },
  { label: "Scheduled", value: "BOOKED" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Cancelled", value: "CANCELLED" },
];

export default function AppointmentsScreen() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const loadAppointments = useCallback(async (refresh = false) => {
    if (refresh) setIsRefreshing(true);
    else setIsLoading(true);
    setError("");
    try {
      setAppointments(await getAppointments());
    } catch (requestError: any) {
      setError(requestError?.response?.data?.message ?? "We could not load your appointments right now.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const request = setTimeout(() => loadAppointments(), 0);
    return () => clearTimeout(request);
  }, [loadAppointments]);

  const visibleAppointments = useMemo(
    () => filterStatus === "ALL" ? appointments : appointments.filter(({ status }) => status === filterStatus),
    [appointments, filterStatus],
  );

  const confirmCancel = (appointment: Appointment) => {
    Alert.alert(
      "Cancel appointment?",
      `${appointment.doctor_name} at ${appointment.hospital_name}`,
      [
        { text: "Keep appointment", style: "cancel" },
        { text: "Cancel appointment", style: "destructive", onPress: () => handleCancel(appointment.id) },
      ],
    );
  };

  const handleCancel = async (id: string) => {
    setCancellingId(id);
    try {
      await cancelAppointment(id);
      await loadAppointments(true);
    } catch (requestError: any) {
      Alert.alert("Unable to cancel", requestError?.response?.data?.message ?? "Please try again.");
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <View style={styles.screen}>
      <FlatList
        contentContainerStyle={styles.content}
        data={visibleAppointments}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={() => loadAppointments(true)} tintColor="#147D92" />}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <Text style={styles.eyebrow}>YOUR CARE PLAN</Text>
            <Text style={styles.title}>Appointments</Text>
            <Text style={styles.subtitle}>Keep track of upcoming visits and your care history.</Text>
            <FlatList
              contentContainerStyle={styles.filterList}
              data={filters}
              horizontal
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <Pressable onPress={() => setFilterStatus(item.value)} style={[styles.filter, filterStatus === item.value && styles.filterActive]}>
                  <Text style={[styles.filterText, filterStatus === item.value && styles.filterTextActive]}>{item.label}</Text>
                </Pressable>
              )}
              showsHorizontalScrollIndicator={false}
            />
            {isLoading && <View style={styles.state}><ActivityIndicator color="#147D92" size="large" /><Text style={styles.stateText}>Loading appointments...</Text></View>}
            {!isLoading && error && <View style={styles.state}><Text style={styles.error}>{error}</Text><Pressable onPress={() => loadAppointments()} style={styles.retry}><Text style={styles.retryText}>Try again</Text></Pressable></View>}
            {!isLoading && !error && visibleAppointments.length === 0 && <View style={styles.state}><Text style={styles.stateTitle}>No appointments found</Text><Text style={styles.stateText}>Your {filterStatus === "ALL" ? "appointments" : filterStatus.toLowerCase()} will appear here.</Text></View>}
          </>
        }
        renderItem={({ item }) => <AppointmentCard appointment={item} cancelling={cancellingId === item.id} onCancel={() => confirmCancel(item)} />}
      />
    </View>
  );
}

function AppointmentCard({ appointment, cancelling, onCancel }: { appointment: Appointment; cancelling: boolean; onCancel: () => void }) {
  const canCancel = appointment.status === "BOOKED";
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.avatar}><Text style={styles.avatarText}>{appointment.doctor_name.charAt(0)}</Text></View>
        <View style={styles.cardHeading}><Text style={styles.doctor}>{appointment.doctor_name}</Text><Text style={styles.specialization}>{appointment.specialization ?? "Healthcare provider"}</Text></View>
        <View style={[styles.status, statusStyle[appointment.status]]}><Text style={styles.statusText}>{formatStatus(appointment.status)}</Text></View>
      </View>
      <View style={styles.dateBox}><Text style={styles.date}>{formatDate(appointment.appointment_date)}</Text><Text style={styles.time}>{appointment.appointment_time}</Text></View>
      <Text style={styles.hospital}>{appointment.hospital_name}</Text>
      {appointment.department_name && <Text style={styles.detail}>{appointment.department_name}{appointment.reason ? `  ·  ${appointment.reason}` : ""}</Text>}
      {canCancel && <Pressable disabled={cancelling} onPress={onCancel} style={styles.cancelButton}><Text style={styles.cancelText}>{cancelling ? "Cancelling..." : "Cancel appointment"}</Text></Pressable>}
    </View>
  );
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}

function formatStatus(status: Appointment["status"]) {
  const label = status === "BOOKED" ? "Scheduled" : status.replace("_", " ").toLowerCase();
  return label.replace(/^\w/, (letter) => letter.toUpperCase());
}

const statusStyle = StyleSheet.create({
  BOOKED: { backgroundColor: "#D9EEF0" },
  COMPLETED: { backgroundColor: "#E3F2E8" },
  CANCELLED: { backgroundColor: "#FBE1DF" },
  NO_SHOW: { backgroundColor: "#FFF0D2" },
});

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F4F8FB" },
  content: { padding: 24, paddingBottom: 40 },
  eyebrow: { color: "#147D92", fontSize: 11, fontWeight: "700", letterSpacing: 1.4, marginTop: 8, marginBottom: 8 },
  title: { color: "#18333D", fontSize: 30, fontWeight: "800", marginBottom: 8 },
  subtitle: { color: "#60747D", fontSize: 15, lineHeight: 22, marginBottom: 18 },
  filterList: { gap: 8, paddingBottom: 22 },
  filter: { borderColor: "#D6E2E7", borderRadius: 20, borderWidth: 1, paddingHorizontal: 16, paddingVertical: 10 },
  filterActive: { backgroundColor: "#147D92", borderColor: "#147D92" },
  filterText: { color: "#60747D", fontSize: 13, fontWeight: "600" },
  filterTextActive: { color: "#FFFFFF" },
  card: { backgroundColor: "#FFFFFF", borderColor: "#DCE8EC", borderRadius: 16, borderWidth: 1, marginBottom: 12, padding: 16 },
  cardHeader: { alignItems: "center", flexDirection: "row" },
  avatar: { alignItems: "center", backgroundColor: "#D9EEF0", borderRadius: 21, height: 42, justifyContent: "center", marginRight: 12, width: 42 },
  avatarText: { color: "#147D92", fontSize: 18, fontWeight: "800" },
  cardHeading: { flex: 1 },
  doctor: { color: "#18333D", fontSize: 16, fontWeight: "700", marginBottom: 4 },
  specialization: { color: "#71838A", fontSize: 12 },
  status: { borderRadius: 12, paddingHorizontal: 9, paddingVertical: 6 },
  statusText: { color: "#42616A", fontSize: 11, fontWeight: "700" },
  dateBox: { backgroundColor: "#147D92", borderRadius: 11, flexDirection: "row", justifyContent: "space-between", marginTop: 16, paddingHorizontal: 13, paddingVertical: 11 },
  date: { color: "#FFFFFF", fontSize: 13, fontWeight: "700" },
  time: { color: "#D7F0F0", fontSize: 13, fontWeight: "600" },
  hospital: { color: "#294650", fontSize: 14, fontWeight: "700", marginTop: 15 },
  detail: { color: "#71838A", fontSize: 12, marginTop: 5 },
  cancelButton: { alignItems: "center", borderColor: "#E7B4B0", borderRadius: 9, borderWidth: 1, marginTop: 15, paddingVertical: 10 },
  cancelText: { color: "#B83A45", fontSize: 13, fontWeight: "700" },
  state: { alignItems: "center", paddingVertical: 55 },
  stateTitle: { color: "#18333D", fontSize: 17, fontWeight: "700" },
  stateText: { color: "#71838A", fontSize: 14, marginTop: 10, textAlign: "center" },
  error: { color: "#B83A45", fontSize: 14, textAlign: "center" },
  retry: { backgroundColor: "#147D92", borderRadius: 10, marginTop: 18, paddingHorizontal: 20, paddingVertical: 11 },
  retryText: { color: "#FFFFFF", fontSize: 14, fontWeight: "700" },
});
