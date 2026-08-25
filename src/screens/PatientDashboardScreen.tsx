import * as SecureStore from "expo-secure-store";
import { Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";

type DashboardProps = {
  navigation: {
    navigate: (screen: string) => void;
    replace: (screen: string) => void;
  };
};

export default function PatientDashboardScreen({ navigation }: DashboardProps) {
  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("mediflow.authToken");
    navigation.replace("Login");
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F8FB" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>GOOD MORNING</Text>
            <Text style={styles.title}>Your health, in hand.</Text>
          </View>
          <Pressable accessibilityLabel="Log out" onPress={handleLogout} style={styles.profileButton}>
            <Text style={styles.profileText}>JD</Text>
          </Pressable>
        </View>

        <View style={styles.statusCard}>
          <View>
            <Text style={styles.statusLabel}>NEXT APPOINTMENT</Text>
            <Text style={styles.doctor}>Dr. Sarah Mitchell</Text>
            <Text style={styles.muted}>General consultation · Today, 10:30 AM</Text>
          </View>
          <View style={styles.dateBadge}>
            <Text style={styles.dateDay}>24</Text>
            <Text style={styles.dateMonth}>JUN</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Your care at a glance</Text>
        <View style={styles.summaryRow}>
          <Pressable onPress={() => navigation.navigate("Appointments")} style={styles.summaryCard}>
            <Text style={styles.cardNumber}>02</Text>
            <Text style={styles.cardLabel}>Upcoming appointments</Text>
            <Text style={styles.cardAction}>View all  ›</Text>
          </Pressable>
          <Pressable onPress={() => navigation.navigate("Queue")} style={[styles.summaryCard, styles.queueCard]}>
            <Text style={styles.cardNumber}>A-18</Text>
            <Text style={styles.cardLabel}>Current queue number</Text>
            <Text style={styles.cardAction}>Track queue  ›</Text>
          </Pressable>
        </View>

        <Text style={styles.sectionTitle}>What do you need?</Text>
        <View style={styles.actions}>
          <Action label="Find a hospital" icon="+" onPress={() => navigation.navigate("Hospitals")} />
          <Action label="Book an appointment" icon="+" onPress={() => navigation.navigate("Appointments")} />
          <Action label="Notifications" icon="!" onPress={() => navigation.navigate("Notifications")} />
          <Action label="Emergency help" icon="!" danger onPress={() => navigation.navigate("Emergency")} />
        </View>

        <Pressable onPress={() => navigation.navigate("Hospitals")} style={styles.banner}>
          <View>
            <Text style={styles.bannerTitle}>Care is closer than you think.</Text>
            <Text style={styles.bannerText}>Discover trusted hospitals near you.</Text>
          </View>
          <Text style={styles.bannerArrow}>›</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

function Action({ label, icon, danger, onPress }: { label: string; icon: string; danger?: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.action}>
      <View style={[styles.actionIcon, danger && styles.dangerIcon]}><Text style={styles.actionIconText}>{icon}</Text></View>
      <Text style={styles.actionLabel}>{label}</Text>
      <Text style={styles.actionArrow}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F4F8FB" },
  content: { padding: 24, paddingBottom: 36 },
  header: { alignItems: "center", flexDirection: "row", justifyContent: "space-between", marginBottom: 28, paddingTop: 12 },
  greeting: { color: "#147D92", fontSize: 11, fontWeight: "700", letterSpacing: 1.4, marginBottom: 8 },
  title: { color: "#18333D", fontSize: 27, fontWeight: "800" },
  profileButton: { alignItems: "center", backgroundColor: "#D9EEF0", borderRadius: 22, height: 44, justifyContent: "center", width: 44 },
  profileText: { color: "#147D92", fontSize: 14, fontWeight: "800" },
  statusCard: { alignItems: "center", backgroundColor: "#147D92", borderRadius: 18, flexDirection: "row", justifyContent: "space-between", padding: 20 },
  statusLabel: { color: "#BDE5E6", fontSize: 10, fontWeight: "700", letterSpacing: 1.1, marginBottom: 8 },
  doctor: { color: "#FFFFFF", fontSize: 18, fontWeight: "700", marginBottom: 6 },
  muted: { color: "#D7F0F0", fontSize: 12 },
  dateBadge: { alignItems: "center", backgroundColor: "#FFFFFF", borderRadius: 12, paddingVertical: 8, width: 56 },
  dateDay: { color: "#18333D", fontSize: 20, fontWeight: "800" },
  dateMonth: { color: "#147D92", fontSize: 10, fontWeight: "700", marginTop: 2 },
  sectionTitle: { color: "#18333D", fontSize: 18, fontWeight: "700", marginBottom: 14, marginTop: 30 },
  summaryRow: { flexDirection: "row", gap: 12 },
  summaryCard: { backgroundColor: "#FFFFFF", borderColor: "#DCE8EC", borderRadius: 16, borderWidth: 1, flex: 1, padding: 16 },
  queueCard: { backgroundColor: "#FFF8E9", borderColor: "#F1DFB5" },
  cardNumber: { color: "#147D92", fontSize: 25, fontWeight: "800", marginBottom: 8 },
  cardLabel: { color: "#526B74", fontSize: 12, lineHeight: 17, minHeight: 34 },
  cardAction: { color: "#147D92", fontSize: 12, fontWeight: "700", marginTop: 12 },
  actions: { gap: 10 },
  action: { alignItems: "center", backgroundColor: "#FFFFFF", borderColor: "#DCE8EC", borderRadius: 14, borderWidth: 1, flexDirection: "row", minHeight: 62, paddingHorizontal: 14 },
  actionIcon: { alignItems: "center", backgroundColor: "#D9EEF0", borderRadius: 11, height: 34, justifyContent: "center", marginRight: 14, width: 34 },
  dangerIcon: { backgroundColor: "#FBE1DF" },
  actionIconText: { color: "#147D92", fontSize: 20, fontWeight: "500" },
  actionLabel: { color: "#294650", flex: 1, fontSize: 14, fontWeight: "600" },
  actionArrow: { color: "#8A9AA1", fontSize: 24 },
  banner: { alignItems: "center", backgroundColor: "#18333D", borderRadius: 16, flexDirection: "row", justifyContent: "space-between", marginTop: 28, padding: 18 },
  bannerTitle: { color: "#FFFFFF", fontSize: 15, fontWeight: "700", marginBottom: 5 },
  bannerText: { color: "#B8CED2", fontSize: 12 },
  bannerArrow: { color: "#8BD3D0", fontSize: 28 },
});
