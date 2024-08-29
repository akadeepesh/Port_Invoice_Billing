import React from "react";
import { View, Text } from "react-native";
import { NavigationProps } from "../types/navigation";

type Props = {
  navigation: NavigationProps;
};

const HomeScreen: React.FC<Props> = () => {
  return (
    <View className="flex-1 justify-center items-center bg-gray-100">
      <Text className="text-2xl font-bold mb-6">Welcome to Our App</Text>
      <Text className="text-lg text-gray-600 text-center px-4">
        This is the main screen of your application. Use the buttons in the top
        right to log in or sign up.
      </Text>
    </View>
  );
};

export default HomeScreen;
