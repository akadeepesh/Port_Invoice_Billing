import React from "react";
import { View, Text, ScrollView } from "react-native";
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
  // Sample invoice data
  const invoice = {
    invoiceNumber: "1",
    invoiceDate: "2023-05-15",
    billTo: {
      name: "John Doe",
      address: "123 Main St",
      cityStateZip: "Anytown, ST 12345",
      phone: "9999999999",
    },
    from: {
      name: "Your Company",
      address: "456 Business Ave",
      cityStateZip: "Cityville, ST 67890",
      phone: "1111111111",
    },
    description: "Web Development Services",
    amount: "2,500.00",
  };

  return (
    <ScrollView className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold text-center mb-6">INVOICE</Text>

      <View className="flex-row mb-4">
        <Text className="font-bold w-1/3">INVOICE #:</Text>
        <Text className="flex-1">{invoice.invoiceNumber}</Text>
      </View>

      <View className="flex-row mb-4">
        <Text className="font-bold w-1/3">INVOICE DATE:</Text>
        <Text className="flex-1">{invoice.invoiceDate}</Text>
      </View>

      <View className="mb-6">
        <Text className="font-bold mb-2">BILL TO:</Text>
        <Text>{invoice.billTo.name}</Text>
        <Text>{invoice.billTo.address}</Text>
        <Text>{invoice.billTo.cityStateZip}</Text>
        <Text>Phone: {invoice.billTo.phone}</Text>
      </View>

      <View className="mb-6">
        <Text className="font-bold mb-2">FROM:</Text>
        <Text>{invoice.from.name}</Text>
        <Text>{invoice.from.address}</Text>
        <Text>{invoice.from.cityStateZip}</Text>
        <Text>Phone: {invoice.from.phone}</Text>
      </View>

      <View className="border border-gray-300 mb-6">
        <View className="flex-row bg-gray-100">
          <Text className="font-bold flex-2 p-2 border-r border-gray-300">
            Description
          </Text>
          <Text className="font-bold flex-1 p-2">Amount</Text>
        </View>
        <View className="flex-row">
          <Text className="flex-2 p-2 border-r border-gray-300">
            {invoice.description}
          </Text>
          <Text className="flex-1 p-2">${invoice.amount}</Text>
        </View>
      </View>

      <View className="flex-row justify-end mb-4">
        <Text className="font-bold mr-4">TOTAL</Text>
        <Text className="font-bold">${invoice.amount}</Text>
      </View>
    </ScrollView>
  );
};

export default ViewInvoiceScreen;
