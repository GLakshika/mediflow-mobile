import { useEffect } from "react";
import { Text, View } from "react-native";
import api from "../services/api";

export default function Index() {
  useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await api.get("/health");
        console.log("Backend response:", response.data);
      } catch (error) {
        console.error("Backend connection failed:", error);
      }
    };

    testConnection();
  }, []);

  return (
    <View>
      <Text>MediFlow Mobile</Text>
    </View>
  );
}