import React, { useEffect } from "react";
import { getAuth } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";

export const withAuthCheck = (WrappedComponent: React.ComponentType<any>) => {
  return (props: any) => {
    const navigation = useNavigation();
    const auth = getAuth();

    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (!user) {
          // Redirect to login if user is not authenticated
          navigation.navigate("Login" as never);
        }
      });

      return () => unsubscribe();
    }, [navigation]);

    return <WrappedComponent {...props} />;
  };
};
