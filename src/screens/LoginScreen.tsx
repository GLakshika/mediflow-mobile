import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import { ActivityIndicator, Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { login } from "../services/api";

type LoginScreenProps = { navigation: { replace: (screen: string) => void } };

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    const normalizedEmail = email.trim();
    if (!normalizedEmail || !password) {
      setError("Enter your email and password to continue.");
      return;
    }
    setError("");
    setIsSubmitting(true);
    try {
      const response = await login({ email: normalizedEmail, password });
      const token = response.token ?? response.accessToken;
      if (token) await SecureStore.setItemAsync("mediflow.authToken", token);
      navigation.replace("PatientDashboard");
    } catch (requestError: any) {
      setError(requestError?.response?.data?.message ?? "We could not sign you in. Check your details and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.brandRow}>
          <Image source={require("../../assets/images/mediflow-logo.jpg")} style={styles.logo} />
          <Text style={styles.brandName}>Medi Flow</Text>
        </View>
        <Text style={styles.eyebrow}>WELCOME BACK</Text>
        <Text style={styles.title}>Your care, connected.</Text>
        <Text style={styles.subtitle}>Sign in to manage appointments, queues, and your healthcare journey.</Text>
        <View style={styles.form}>
          <Text style={styles.label}>EMAIL ADDRESS</Text>
          <TextInput autoCapitalize="none" autoComplete="email" keyboardType="email-address" onChangeText={setEmail} placeholder="you@example.com" placeholderTextColor="#8795A1" style={styles.input} value={email} />
          <Text style={styles.label}>PASSWORD</Text>
          <TextInput autoCapitalize="none" autoComplete="password" onChangeText={setPassword} placeholder="Enter your password" placeholderTextColor="#8795A1" secureTextEntry style={styles.input} value={password} />
          {!!error && <Text style={styles.error}>{error}</Text>}
          <Pressable disabled={isSubmitting} onPress={handleLogin} style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}>
            {isSubmitting ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>Sign in</Text>}
          </Pressable>
        </View>
        <Text style={styles.footer}>MediFlow - Better care, closer to you</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F4F8FB",
  },
  content: { flexGrow: 1, justifyContent: "center", padding: 28 },
  brandRow: { alignItems: "center", flexDirection: "row", marginBottom: 28 },
  logo: { borderRadius: 16, height: 58, marginRight: 14, width: 58 },
  brandName: { color: "#18333D", fontSize: 25, fontWeight: "800" },
  eyebrow: { color: "#147D92", fontSize: 12, fontWeight: "700", letterSpacing: 1.5, marginBottom: 10 },
  title: {
    color: "#18333D", fontSize: 34, fontWeight: "800", lineHeight: 40, marginBottom: 12,
  },
  subtitle: { color: "#60747D", fontSize: 16, lineHeight: 24, marginBottom: 34 },
  form: { gap: 14 },
  label: { color: "#49616A", fontSize: 11, fontWeight: "700", letterSpacing: 1.1 },
  input: { backgroundColor: "#FFFFFF", borderColor: "#D6E2E7", borderRadius: 12, borderWidth: 1, color: "#18333D", fontSize: 16, height: 54, marginBottom: 8, paddingHorizontal: 16 },
  error: { color: "#B83A45", fontSize: 13, lineHeight: 19 },
  button: { alignItems: "center", backgroundColor: "#147D92", borderRadius: 12, height: 54, justifyContent: "center", marginTop: 8 },
  buttonPressed: { backgroundColor: "#0E6475" },
  buttonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
  footer: { color: "#8A9AA1", fontSize: 12, marginTop: 34, textAlign: "center" },
});