import React from "react";
import { View, Text } from "react-native";
import { NavigationProps } from "../types/navigation";

type Props = {
  navigation: NavigationProps;
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
