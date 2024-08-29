import React from "react";
import { View, Text } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";

type ViewInvoiceScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "ViewInvoice"
>;

type Props = {
  navigation: ViewInvoiceScreenNavigationProp;
};

const ViewInvoiceScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View className="flex-1 justify-center items-center bg-gray-100">
      <Text className="text-2xl font-bold">View Invoice</Text>
      <Text className="text-lg text-gray-600 mt-4">
        This is the View Invoice screen. We'll add functionality here later.
      </Text>
    </View>
  );
};

export default ViewInvoiceScreen;
