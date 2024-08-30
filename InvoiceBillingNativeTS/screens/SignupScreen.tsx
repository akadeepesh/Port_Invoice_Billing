import React from "react";
import AuthForm from "../components/AuthForm";
import { NavigationProps } from "../types/navigation";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../types/navigation"; // Make sure this import path is correct

type SignupScreenRouteProp = RouteProp<RootStackParamList, "Signup">;

type Props = {
  navigation: NavigationProps;
  route: SignupScreenRouteProp;
};

const SignupScreen: React.FC<Props> = ({ navigation, route }) => {
  const returnScreen = route.params?.returnScreen || "Home";
  return (
    <AuthForm
      isLogin={false}
      navigation={navigation}
      returnScreen={returnScreen ? returnScreen : "Home"}
    />
  );
};

export default SignupScreen;
