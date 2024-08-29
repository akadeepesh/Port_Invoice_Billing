// types/navigation.ts
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Signup: undefined;
};

export type NavigationProps = NativeStackNavigationProp<RootStackParamList>;
