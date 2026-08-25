import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { getHospitals, Hospital } from "../services/api";

type HospitalScreenProps = {
  navigation: { navigate: (screen: string, params?: { hospitalId: string }) => void };
};

export default function HospitalScreen({ navigation }: HospitalScreenProps) {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadHospitals = useCallback(async (refresh = false) => {
    if (refresh) setIsRefreshing(true);
    else setIsLoading(true);
    setError("");
    try {
      setHospitals(await getHospitals());
    } catch (requestError: any) {
      setError(requestError?.response?.data?.message ?? "We could not load hospitals right now.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadHospitals();
  }, [loadHospitals]);

  const filteredHospitals = hospitals.filter((hospital) =>
    `${hospital.name} ${hospital.address}`.toLowerCase().includes(search.trim().toLowerCase()),
  );

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={() => loadHospitals(true)} tintColor="#147D92" />}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.eyebrow}>MEDIFLOW NETWORK</Text>
        <Text style={styles.title}>Find a hospital</Text>
        <Text style={styles.subtitle}>Explore trusted care near you and check emergency availability.</Text>
        <TextInput
          autoCapitalize="none"
          onChangeText={setSearch}
          placeholder="Search by hospital or location"
          placeholderTextColor="#8795A1"
          style={styles.search}
          value={search}
        />

        {isLoading ? (
          <View style={styles.state}><ActivityIndicator color="#147D92" size="large" /><Text style={styles.stateText}>Finding hospitals...</Text></View>
        ) : error ? (
          <View style={styles.state}><Text style={styles.error}>{error}</Text><Pressable onPress={() => loadHospitals()} style={styles.retry}><Text style={styles.retryText}>Try again</Text></Pressable></View>
        ) : filteredHospitals.length === 0 ? (
          <View style={styles.state}><Text style={styles.stateTitle}>No hospitals found</Text><Text style={styles.stateText}>Try a different hospital name or location.</Text></View>
        ) : (
          <View style={styles.list}>
            <Text style={styles.resultCount}>{filteredHospitals.length} {filteredHospitals.length === 1 ? "hospital" : "hospitals"}</Text>
            {filteredHospitals.map((hospital) => (
              <Pressable key={hospital.id} onPress={() => navigation.navigate("HospitalDetails", { hospitalId: hospital.id })} style={styles.card}>
                <View style={styles.cardTop}>
                  <View style={styles.hospitalIcon}><Text style={styles.hospitalIconText}>+</Text></View>
                  <View style={styles.cardHeading}><Text style={styles.hospitalName}>{hospital.name}</Text><Text style={styles.address}>{hospital.address}</Text></View>
                  <Text style={styles.arrow}>›</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.stats}>
                  <Stat label="Beds" value={hospital.available_beds ?? "-"} />
                  <Stat label="Queue" value={hospital.emergency_queue ?? "-"} />
                  <Stat label="Doctors" value={hospital.doctors_available ?? "-"} />
                  <View style={styles.status}><View style={[styles.dot, hospital.emergency_status !== "AVAILABLE" && styles.dotMuted]} /><Text style={styles.statusText}>{hospital.emergency_status === "AVAILABLE" ? "Emergency open" : "Check availability"}</Text></View>
                </View>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return <View><Text style={styles.statValue}>{value}</Text><Text style={styles.statLabel}>{label}</Text></View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F4F8FB" },
  content: { padding: 24, paddingBottom: 40 },
  eyebrow: { color: "#147D92", fontSize: 11, fontWeight: "700", letterSpacing: 1.4, marginTop: 8, marginBottom: 8 },
  title: { color: "#18333D", fontSize: 30, fontWeight: "800", marginBottom: 8 },
  subtitle: { color: "#60747D", fontSize: 15, lineHeight: 22, marginBottom: 22 },
  search: { backgroundColor: "#FFFFFF", borderColor: "#D6E2E7", borderRadius: 12, borderWidth: 1, color: "#18333D", fontSize: 15, height: 52, paddingHorizontal: 16 },
  list: { marginTop: 26, gap: 12 },
  resultCount: { color: "#60747D", fontSize: 13, fontWeight: "600", marginBottom: 2 },
  card: { backgroundColor: "#FFFFFF", borderColor: "#DCE8EC", borderRadius: 16, borderWidth: 1, padding: 16 },
  cardTop: { alignItems: "center", flexDirection: "row" },
  hospitalIcon: { alignItems: "center", backgroundColor: "#D9EEF0", borderRadius: 12, height: 42, justifyContent: "center", marginRight: 12, width: 42 },
  hospitalIconText: { color: "#147D92", fontSize: 25, fontWeight: "400" },
  cardHeading: { flex: 1 },
  hospitalName: { color: "#18333D", fontSize: 16, fontWeight: "700", marginBottom: 5 },
  address: { color: "#71838A", fontSize: 12 },
  arrow: { color: "#8A9AA1", fontSize: 26, marginLeft: 8 },
  divider: { backgroundColor: "#E8EFF1", height: 1, marginVertical: 15 },
  stats: { alignItems: "center", flexDirection: "row", justifyContent: "space-between" },
  statValue: { color: "#147D92", fontSize: 17, fontWeight: "800" },
  statLabel: { color: "#84939A", fontSize: 10, marginTop: 3 },
  status: { alignItems: "center", flexDirection: "row", maxWidth: 92 },
  dot: { backgroundColor: "#3DAA78", borderRadius: 4, height: 8, marginRight: 5, width: 8 },
  dotMuted: { backgroundColor: "#D6A547" },
  statusText: { color: "#60747D", flex: 1, fontSize: 10, lineHeight: 13 },
  state: { alignItems: "center", paddingVertical: 70 },
  stateTitle: { color: "#18333D", fontSize: 17, fontWeight: "700", marginBottom: 7 },
  stateText: { color: "#71838A", fontSize: 14, marginTop: 12, textAlign: "center" },
  error: { color: "#B83A45", fontSize: 14, textAlign: "center" },
  retry: { backgroundColor: "#147D92", borderRadius: 10, marginTop: 18, paddingHorizontal: 20, paddingVertical: 11 },
  retryText: { color: "#FFFFFF", fontSize: 14, fontWeight: "700" },
});
