import {
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        MediFlow
      </Text>

      <Text>
        Login Screen
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F4F8FB",
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
  },
});