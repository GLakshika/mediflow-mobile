import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import { ActivityIndicator, Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { register } from "../services/api";

type RegisterScreenProps = { navigation: { replace: (screen: string) => void; navigate: (screen: string) => void } };

export default function RegisterScreen({ navigation }: RegisterScreenProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async () => {
    const normalizedEmail = email.trim();
    if (!name.trim() || !normalizedEmail || !password || !confirmPassword) {
      setError("Complete all fields to create your account.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }
    setError("");
    setIsSubmitting(true);
    try {
      const response = await register({ name: name.trim(), email: normalizedEmail, password, role: "PATIENT" });
      const token = response.token ?? response.accessToken;
      if (token) {
        await SecureStore.setItemAsync("mediflow.authToken", token);
        navigation.replace("PatientDashboard");
      } else {
        navigation.replace("Login");
      }
    } catch (requestError: any) {
      setError(requestError?.response?.data?.message ?? "We could not create your account. Please try again.");
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
        <Text style={styles.eyebrow}>GET STARTED</Text>
        <Text style={styles.title}>Your care starts here.</Text>
        <Text style={styles.subtitle}>Create your account to keep your appointments and care information together.</Text>
        <View style={styles.form}>
          <Text style={styles.label}>FULL NAME</Text>
          <TextInput autoCapitalize="words" onChangeText={setName} placeholder="Your full name" placeholderTextColor="#8795A1" style={styles.input} value={name} />
          <Text style={styles.label}>EMAIL ADDRESS</Text>
          <TextInput autoCapitalize="none" autoComplete="email" keyboardType="email-address" onChangeText={setEmail} placeholder="you@example.com" placeholderTextColor="#8795A1" style={styles.input} value={email} />
          <Text style={styles.label}>PASSWORD</Text>
          <TextInput autoCapitalize="none" autoComplete="password-new" onChangeText={setPassword} placeholder="Create a password" placeholderTextColor="#8795A1" secureTextEntry style={styles.input} value={password} />
          <Text style={styles.label}>CONFIRM PASSWORD</Text>
          <TextInput autoCapitalize="none" onChangeText={setConfirmPassword} placeholder="Repeat your password" placeholderTextColor="#8795A1" secureTextEntry style={styles.input} value={confirmPassword} />
          {!!error && <Text style={styles.error}>{error}</Text>}
          <Pressable disabled={isSubmitting} onPress={handleRegister} style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}>
            {isSubmitting ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>Create account</Text>}
          </Pressable>
        </View>
        <Pressable onPress={() => navigation.navigate("Login")} style={styles.loginLink}>
          <Text style={styles.loginPrompt}>Already have an account? </Text>
          <Text style={styles.loginText}>Sign in</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F4F8FB" },
  content: { flexGrow: 1, justifyContent: "center", padding: 28 },
  brandRow: { alignItems: "center", flexDirection: "row", marginBottom: 24 },
  logo: { borderRadius: 16, height: 54, marginRight: 14, width: 54 },
  brandName: { color: "#18333D", fontSize: 32, fontWeight: "800" },
  eyebrow: { color: "#147D92", fontSize: 12, fontWeight: "700", letterSpacing: 1.5, marginBottom: 10 },
  title: { color: "#18333D", fontSize: 25, fontWeight: "800", lineHeight: 38, marginBottom: 12 },
  subtitle: { color: "#60747D", fontSize: 15, lineHeight: 23, marginBottom: 26 },
  form: { gap: 10 },
  label: { color: "#49616A", fontSize: 11, fontWeight: "700", letterSpacing: 1.1 },
  input: { backgroundColor: "#FFFFFF", borderColor: "#D6E2E7", borderRadius: 12, borderWidth: 1, color: "#18333D", fontSize: 16, height: 52, marginBottom: 6, paddingHorizontal: 16 },
  error: { color: "#B83A45", fontSize: 13, lineHeight: 19 },
  button: { alignItems: "center", backgroundColor: "#147D92", borderRadius: 12, height: 54, justifyContent: "center", marginTop: 8 },
  buttonPressed: { backgroundColor: "#0E6475" },
  buttonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
  loginLink: { alignSelf: "center", flexDirection: "row", marginTop: 22 },
  loginPrompt: { color: "#60747D", fontSize: 13 },
  loginText: { color: "#147D92", fontSize: 13, fontWeight: "700" },
});
