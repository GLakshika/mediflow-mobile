// import {
//   NavigationContainer,
// } from "@react-navigation/native";

// import {
//   createNativeStackNavigator,
// } from "@react-navigation/native-stack";

// import LoginScreen from "../screens/LoginScreen";
// import RegisterScreen from "../screens/RegisterScreen";
// import PatientDashboardScreen from "../screens/PatientDashboardScreen";
// import HospitalScreen from "../screens/HospitalScreen";
// import HospitalDetailsScreen from "../screens/HospitalDetailsScreen";
// import AppointmentsScreen from "../screens/AppointmentsScreen";
// import QueueScreen from "../screens/QueueScreen";
// import NotificationsScreen from "../screens/NotificationsScreen";
// import EmergencyScreen from "../screens/EmergencyScreen";

// export type RootStackParamList = {
//   Login: undefined;
//   Register: undefined;
//   PatientDashboard: undefined;
//   Hospitals: undefined;
//   HospitalDetails: {
//     hospitalId: string;
//   };
//   Appointments: undefined;
//   Queue: undefined;
//   Notifications: undefined;
//   Emergency: undefined;
// };

// const Stack =
//   createNativeStackNavigator<RootStackParamList>();

// export default function AppNavigator() {
//   return (
//     <NavigationContainer>

//       <Stack.Navigator
//         initialRouteName="Login"
//       >

//         <Stack.Screen
//           name="Login"
//           component={LoginScreen}
//           options={{
//             headerShown: false,
//           }}
//         />

//         <Stack.Screen
//           name="Register"
//           component={RegisterScreen}
//           options={{
//             title: "Register",
//           }}
//         />

//         <Stack.Screen
//           name="PatientDashboard"
//           component={PatientDashboardScreen}
//           options={{
//             headerShown: false,
//           }}
//         />

//         <Stack.Screen
//           name="Hospitals"
//           component={HospitalScreen}
//           options={{
//             title: "Find Hospitals",
//           }}
//         />

//         <Stack.Screen
//           name="HospitalDetails"
//           component={HospitalDetailsScreen}
//           options={{
//             title: "Hospital Details",
//           }}
//         />

//         <Stack.Screen
//           name="Appointments"
//           component={AppointmentsScreen}
//           options={{
//             title: "My Appointments",
//           }}
//         />

//         <Stack.Screen
//           name="Queue"
//           component={QueueScreen}
//           options={{
//             title: "My Queue",
//           }}
//         />

//         <Stack.Screen
//           name="Notifications"
//           component={NotificationsScreen}
//           options={{
//             title: "Notifications",
//           }}
//         />

//         <Stack.Screen
//           name="Emergency"
//           component={EmergencyScreen}
//           options={{
//             title: "Emergency",
//           }}
//         />

//       </Stack.Navigator>

//     </NavigationContainer>
//   );
// }

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../screens/LoginScreen";
import PatientDashboardScreen from "../screens/PatientDashboardScreen";

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
          name="PatientDashboard"
          component={PatientDashboardScreen}
          options={{ title: "MediFlow" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}