import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AppointmentsScreen from "../screens/AppointmentsScreen";
import EmergencyScreen from "../screens/EmergencyScreen";
import HospitalScreen from "../screens/HospitalScreen";
import HospitalDetailsScreen from "../screens/HospitalDetailsScreen";
import LoginScreen from "../screens/LoginScreen";
import NotificationsScreen from "../screens/NotificationsScreen";
import PatientDashboardScreen from "../screens/PatientDashboardScreen";
import QueueScreen from "../screens/QueueScreen";
import RegisterScreen from "../screens/RegisterScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PatientDashboard"
          component={PatientDashboardScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Hospitals" component={HospitalScreen} options={{ title: "Find hospitals" }} />
        <Stack.Screen name="HospitalDetails" component={HospitalDetailsScreen} options={{ title: "Hospital details" }} />
        <Stack.Screen name="Appointments" component={AppointmentsScreen} options={{ title: "My appointments" }} />
        <Stack.Screen name="Queue" component={QueueScreen} options={{ title: "My queue" }} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ title: "Notifications" }} />
        <Stack.Screen name="Emergency" component={EmergencyScreen} options={{ title: "Emergency" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}