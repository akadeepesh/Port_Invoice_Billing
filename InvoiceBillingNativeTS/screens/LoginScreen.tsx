import React from "react";
import AuthForm from "../components/AuthForm";
import { NavigationProps } from "../types/navigation";

type Props = {
  navigation: NavigationProps;
};

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  return <AuthForm isLogin={true} navigation={navigation} />;
};

export default LoginScreen;
