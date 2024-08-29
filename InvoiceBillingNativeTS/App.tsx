import React, { useEffect, useState } from "react";
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
import { getAuth, onAuthStateChanged, User } from "firebase/auth";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  if (isLoading) {
    // You might want to show a loading screen here
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          <>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={({ navigation }) => ({
                title: "Invoice & Billing",
                headerRight: () => (
                  <TouchableOpacity
                    onPress={() => {
                      auth.signOut();
                    }}
                  >
                    <Text className="text-red-500 font-semibold">Logout</Text>
                  </TouchableOpacity>
                ),
              })}
            />
            <Stack.Screen
              name="CreateInvoice"
              component={CreateInvoiceScreen}
            />
            <Stack.Screen name="ViewInvoice" component={ViewInvoiceScreen} />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={({ navigation }) => ({
                headerRight: () => (
                  <TouchableOpacity
                    onPress={() => navigation.navigate("Signup")}
                  >
                    <Text className="text-green-500 font-semibold">
                      Sign Up
                    </Text>
                  </TouchableOpacity>
                ),
              })}
            />
            <Stack.Screen name="Signup" component={SignupScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
