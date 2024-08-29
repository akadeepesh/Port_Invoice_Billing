import React, { useState, useEffect } from "react";
import "./global.css";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TouchableOpacity, Text, ActivityIndicator, View } from "react-native";
import { RootStackParamList } from "./types/navigation";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import CreateInvoiceScreen from "./screens/CreateInvoiceScreen";
import InvoiceListScreen from "./screens/InvoiceListScreen";
import InvoiceDetailScreen from "./screens/InvoiceDetailScreen";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { withAuthCheck } from "./withAuthCheck";

const ProtectedCreateInvoiceScreen = withAuthCheck(CreateInvoiceScreen);
const ProtectedInvoiceListScreen = withAuthCheck(InvoiceListScreen);
const ProtectedInvoiceDetailScreen = withAuthCheck(InvoiceDetailScreen);

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

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
                {user ? (
                  <TouchableOpacity
                    onPress={() => getAuth().signOut()}
                    className="mr-4"
                  >
                    <Text className="text-red-500 font-semibold">Logout</Text>
                  </TouchableOpacity>
                ) : (
                  <>
                    <TouchableOpacity
                      onPress={() => navigation.navigate("Login")}
                      className="mr-4"
                    >
                      <Text className="text-blue-500 font-semibold">Login</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => navigation.navigate("Signup")}
                    >
                      <Text className="text-green-500 font-semibold">
                        Sign Up
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
              </>
            ),
          })}
        />
        <Stack.Screen
          name="CreateInvoice"
          component={ProtectedCreateInvoiceScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="InvoiceList"
          component={ProtectedInvoiceListScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="InvoiceDetail"
          component={ProtectedInvoiceDetailScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
