import React from "react";
import AuthForm from "../components/AuthForm";
import { NavigationProps } from "../types/navigation";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../types/navigation"; // Make sure this import path is correct

type LoginScreenRouteProp = RouteProp<RootStackParamList, "Login">;

type Props = {
  navigation: NavigationProps;
  route: LoginScreenRouteProp;
};

const LoginScreen: React.FC<Props> = ({ navigation, route }) => {
  const returnScreen = route.params?.returnScreen || "Home";
  return (
    <AuthForm
      isLogin={true}
      navigation={navigation}
      returnScreen={returnScreen ? returnScreen : "Home"}
    />
  );
};

export default LoginScreen;
