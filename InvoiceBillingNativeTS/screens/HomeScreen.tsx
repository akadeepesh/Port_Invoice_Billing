import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Home"
>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View className="flex-1 justify-center items-center bg-gray-100">
      <Text className="text-2xl font-bold mb-6">Welcome to Our App</Text>
      <Text className="text-lg text-gray-600 text-center px-4 mb-6">
        This is the main screen of your application. Use the buttons below to
        create or view invoices.
      </Text>
      <TouchableOpacity
        className="bg-blue-500 py-2 px-4 rounded-md mb-4"
        onPress={() => navigation.navigate("CreateInvoice")}
      >
        <Text className="text-white font-semibold">Create Invoice</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="bg-green-500 py-2 px-4 rounded-md"
        onPress={() => navigation.navigate("ViewInvoice")}
      >
        <Text className="text-white font-semibold">View Invoice</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;
