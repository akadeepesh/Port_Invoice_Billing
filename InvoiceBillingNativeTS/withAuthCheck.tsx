import React, { useState, useEffect } from "react";
import { getAuth, User } from "firebase/auth";
import { useNavigation, useRoute } from "@react-navigation/native";
import { View, ActivityIndicator } from "react-native";
import {
  NavigationProps,
  RootStackParamList,
} from "../InvoiceBillingNativeTS/types/navigation";

export const withAuthCheck = (WrappedComponent: React.ComponentType<any>) => {
  return (props: any) => {
    const navigation = useNavigation<NavigationProps>();
    const route = useRoute();
    const auth = getAuth();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((currentUser) => {
        setUser(currentUser);
        setLoading(false);

        if (!currentUser) {
          // Redirect to login if user is not authenticated
          navigation.navigate("Login", {
            returnScreen: route.name as keyof RootStackParamList,
            ...route.params,
          });
        }
      });

      return () => unsubscribe();
    }, [navigation, route.name, route.params]);

    if (loading) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" />
        </View>
      );
    }

    if (!user) {
      // Return null while redirecting
      return null;
    }

    return <WrappedComponent {...props} />;
  };
};
