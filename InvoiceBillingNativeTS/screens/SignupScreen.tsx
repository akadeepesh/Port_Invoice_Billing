import React from "react";
import AuthForm from "../components/AuthForm";
import { NavigationProps } from "../types/navigation";

type Props = {
  navigation: NavigationProps;
};

const SignupScreen: React.FC<Props> = ({ navigation }) => {
  return <AuthForm isLogin={false} navigation={navigation} />;
};

export default SignupScreen;
