import React from "react";
import "./global.css";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TouchableOpacity, Text } from "react-native";
import { RootStackParamList } from "./types/navigation";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import CreateInvoiceScreen from "./screens/CreateInvoiceScreen";
import ViewInvoiceScreen from "./screens/ViewInvoiceScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={({ navigation }) => ({
            title: "Invoice & Billing",
            headerRight: () => (
              <>
                <TouchableOpacity
                  onPress={() => navigation.navigate("Login")}
                  className="mr-4"
                >
                  <Text className="text-blue-500 font-semibold">Login</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
                  <Text className="text-green-500 font-semibold">Sign Up</Text>
                </TouchableOpacity>
              </>
            ),
          })}
        />
        <Stack.Screen name="CreateInvoice" component={CreateInvoiceScreen} />
        <Stack.Screen name="ViewInvoice" component={ViewInvoiceScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
