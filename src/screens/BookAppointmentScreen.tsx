import { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { createAppointment, getHospitalDetails, HospitalDetails } from "../services/api";

type BookAppointmentProps = {
  route: { params?: { hospitalId?: string } };
  navigation: { goBack: () => void; navigate: (screen: string) => void };
};

export default function BookAppointmentScreen({ route, navigation }: BookAppointmentProps) {
  const hospitalId = route.params?.hospitalId;
  const [details, setDetails] = useState<HospitalDetails | null>(null);
  const [doctorId, setDoctorId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const loadDetails = useCallback(async () => {
    if (!hospitalId) {
      setError("Hospital information is unavailable.");
      setIsLoading(false);
      return;
    }
    try {
      const hospitalDetails = await getHospitalDetails(hospitalId);
      setDetails(hospitalDetails);
      const firstAvailableDoctor = hospitalDetails.doctors.find((doctor) => doctor.available);
      if (firstAvailableDoctor) setDoctorId(firstAvailableDoctor.id);
    } catch (requestError: any) {
      setError(requestError?.response?.data?.message ?? "We could not load doctors right now.");
    } finally {
      setIsLoading(false);
    }
  }, [hospitalId]);

  useEffect(() => {
    const request = setTimeout(loadDetails, 0);
    return () => clearTimeout(request);
  }, [loadDetails]);

  const availableDoctors = useMemo(() => details?.doctors.filter((doctor) => doctor.available) ?? [], [details]);

  const handleSubmit = async () => {
    if (!doctorId || !hospitalId || !date.trim() || !time.trim()) {
      setError("Choose a doctor and enter the appointment date and time.");
      return;
    }
    setError("");
    setIsSubmitting(true);
    try {
      await createAppointment({ doctor_id: doctorId, hospital_id: hospitalId, appointment_date: date.trim(), appointment_time: time.trim() });
      Alert.alert("Appointment booked", "Your appointment has been booked successfully.", [{ text: "View appointments", onPress: () => navigation.navigate("Appointments") }]);
    } catch (requestError: any) {
      setError(requestError?.response?.data?.message ?? "We could not book this appointment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <View style={styles.state}><ActivityIndicator color="#147D92" size="large" /><Text style={styles.stateText}>Loading available doctors...</Text></View>;
  if (error && !details) return <View style={styles.state}><Text style={styles.error}>{error}</Text><Pressable onPress={loadDetails} style={styles.retry}><Text style={styles.retryText}>Try again</Text></Pressable></View>;

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <Pressable onPress={navigation.goBack} style={styles.back}><Text style={styles.backText}>‹  Hospital details</Text></Pressable>
        <Text style={styles.eyebrow}>NEW APPOINTMENT</Text>
        <Text style={styles.title}>Book your visit</Text>
        <Text style={styles.subtitle}>{details?.hospital.name}</Text>

        <Text style={styles.label}>CHOOSE A DOCTOR</Text>
        {availableDoctors.length ? availableDoctors.map((doctor) => (
          <Pressable key={doctor.id} onPress={() => setDoctorId(doctor.id)} style={[styles.doctorCard, doctorId === doctor.id && styles.doctorSelected]}>
            <View style={styles.avatar}><Text style={styles.avatarText}>{doctor.doctor_name.charAt(0).toUpperCase()}</Text></View>
            <View style={styles.doctorInfo}><Text style={styles.doctorName}>{doctor.doctor_name}</Text><Text style={styles.specialization}>{doctor.specialization ?? doctor.department_name ?? "Medical specialist"}</Text></View>
            <View style={[styles.radio, doctorId === doctor.id && styles.radioSelected]} />
          </Pressable>
        )) : <Text style={styles.muted}>No doctors are currently available at this hospital.</Text>}

        <Text style={styles.label}>APPOINTMENT DATE</Text>
        <TextInput autoCapitalize="none" keyboardType="numbers-and-punctuation" onChangeText={setDate} placeholder="YYYY-MM-DD" placeholderTextColor="#8795A1" style={styles.input} value={date} />
        <Text style={styles.hint}>Use the format YYYY-MM-DD.</Text>

        <Text style={styles.label}>APPOINTMENT TIME</Text>
        <TextInput autoCapitalize="none" keyboardType="numbers-and-punctuation" onChangeText={setTime} placeholder="HH:MM" placeholderTextColor="#8795A1" style={styles.input} value={time} />
        <Text style={styles.hint}>Use 24-hour time, for example 14:30.</Text>

        {!!error && <Text style={styles.error}>{error}</Text>}
        <Pressable disabled={isSubmitting || !availableDoctors.length} onPress={handleSubmit} style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}>
          {isSubmitting ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>Confirm appointment</Text>}
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F4F8FB" },
  content: { padding: 24, paddingBottom: 40 },
  back: { marginBottom: 24 },
  backText: { color: "#147D92", fontSize: 14, fontWeight: "700" },
  eyebrow: { color: "#147D92", fontSize: 11, fontWeight: "700", letterSpacing: 1.4, marginBottom: 8 },
  title: { color: "#18333D", fontSize: 30, fontWeight: "800", marginBottom: 8 },
  subtitle: { color: "#60747D", fontSize: 15, marginBottom: 30 },
  label: { color: "#49616A", fontSize: 11, fontWeight: "700", letterSpacing: 1.1, marginBottom: 10, marginTop: 20 },
  doctorCard: { alignItems: "center", backgroundColor: "#FFFFFF", borderColor: "#DCE8EC", borderRadius: 14, borderWidth: 1, flexDirection: "row", marginBottom: 10, padding: 13 },
  doctorSelected: { borderColor: "#147D92", borderWidth: 2 },
  avatar: { alignItems: "center", backgroundColor: "#D9EEF0", borderRadius: 19, height: 38, justifyContent: "center", marginRight: 11, width: 38 },
  avatarText: { color: "#147D92", fontSize: 16, fontWeight: "800" },
  doctorInfo: { flex: 1 },
  doctorName: { color: "#294650", fontSize: 14, fontWeight: "700", marginBottom: 4 },
  specialization: { color: "#84939A", fontSize: 12 },
  radio: { borderColor: "#B9C9CE", borderRadius: 10, borderWidth: 2, height: 20, width: 20 },
  radioSelected: { backgroundColor: "#147D92", borderColor: "#147D92" },
  input: { backgroundColor: "#FFFFFF", borderColor: "#D6E2E7", borderRadius: 12, borderWidth: 1, color: "#18333D", fontSize: 16, height: 54, paddingHorizontal: 16 },
  hint: { color: "#84939A", fontSize: 12, marginTop: 6 },
  muted: { color: "#71838A", fontSize: 14 },
  error: { color: "#B83A45", fontSize: 13, lineHeight: 19, marginTop: 18 },
  button: { alignItems: "center", backgroundColor: "#147D92", borderRadius: 12, height: 54, justifyContent: "center", marginTop: 28 },
  buttonPressed: { backgroundColor: "#0E6475" },
  buttonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
  state: { alignItems: "center", backgroundColor: "#F4F8FB", flex: 1, justifyContent: "center", padding: 24 },
  stateText: { color: "#71838A", fontSize: 14, marginTop: 12 },
  retry: { backgroundColor: "#147D92", borderRadius: 10, marginTop: 18, paddingHorizontal: 20, paddingVertical: 11 },
  retryText: { color: "#FFFFFF", fontSize: 14, fontWeight: "700" },
});
