import React from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../types/navigation";
import { Feather } from "@expo/vector-icons";

type InvoiceDetailScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "InvoiceDetail"
>;

type InvoiceDetailScreenRouteProp = RouteProp<
  RootStackParamList,
  "InvoiceDetail"
>;

type Props = {
  navigation: InvoiceDetailScreenNavigationProp;
  route: InvoiceDetailScreenRouteProp;
};

const InvoiceDetailScreen: React.FC<Props> = ({ route }) => {
  const { invoiceId } = route.params;

  // Fetch invoice details based on invoiceId (replace with actual data from Firebase later)
  const invoice = {
    invoiceNumber: invoiceId,
    invoiceDate: "2024-05-15",
    dueDate: "2024-06-15",
    status: "Pending",
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
    items: [
      { description: "Web Development", amount: 2000 },
      { description: "UI/UX Design", amount: 500 },
    ],
    total: 2500,
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "overdue":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      <ScrollView className="flex-1 p-6">
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-3xl font-bold text-gray-800">Invoice</Text>
          <View
            className={`px-3 py-1 rounded-full ${getStatusColor(
              invoice.status
            )}`}
          >
            <Text className="text-white font-medium">{invoice.status}</Text>
          </View>
        </View>

        <View className="bg-white rounded-xl shadow-md p-6 mb-6">
          <Text className="text-xl font-semibold text-gray-800 mb-4">
            Invoice Details
          </Text>
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600">Invoice Number:</Text>
            <Text className="font-medium text-gray-800">
              {invoice.invoiceNumber}
            </Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600">Invoice Date:</Text>
            <Text className="font-medium text-gray-800">
              {invoice.invoiceDate}
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-600">Due Date:</Text>
            <Text className="font-medium text-gray-800">{invoice.dueDate}</Text>
          </View>
        </View>

        <View className="bg-white rounded-xl shadow-md p-6 mb-6">
          <Text className="text-xl font-semibold text-gray-800 mb-4">
            Bill To
          </Text>
          <Text className="font-medium text-gray-800">
            {invoice.billTo.name}
          </Text>
          <Text className="text-gray-600">{invoice.billTo.address}</Text>
          <Text className="text-gray-600">{invoice.billTo.cityStateZip}</Text>
          <Text className="text-gray-600">Phone: {invoice.billTo.phone}</Text>
        </View>

        <View className="bg-white rounded-xl shadow-md p-6 mb-6">
          <Text className="text-xl font-semibold text-gray-800 mb-4">From</Text>
          <Text className="font-medium text-gray-800">{invoice.from.name}</Text>
          <Text className="text-gray-600">{invoice.from.address}</Text>
          <Text className="text-gray-600">{invoice.from.cityStateZip}</Text>
          <Text className="text-gray-600">Phone: {invoice.from.phone}</Text>
        </View>

        <View className="bg-white rounded-xl shadow-md p-6 mb-6">
          <Text className="text-xl font-semibold text-gray-800 mb-4">
            Invoice Items
          </Text>
          {invoice.items.map((item, index) => (
            <View key={index} className="flex-row justify-between mb-2">
              <Text className="text-gray-600">{item.description}</Text>
              <Text className="font-medium text-gray-800">
                ${item.amount.toFixed(2)}
              </Text>
            </View>
          ))}
          <View className="border-t border-gray-200 mt-4 pt-4 flex-row justify-between">
            <Text className="text-lg font-semibold text-gray-800">Total</Text>
            <Text className="text-lg font-bold text-gray-800">
              ${invoice.total.toFixed(2)}
            </Text>
          </View>
        </View>
      </ScrollView>
      <View className="bg-white py-4 px-6 shadow-lg">
        <TouchableOpacity className="bg-blue-500 py-3 px-6 rounded-lg flex-row justify-center items-center">
          <Feather
            name="download"
            size={20}
            color="white"
            style={{ marginRight: 8 }}
          />
          <Text className="text-white font-semibold text-lg">
            Download Invoice
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default InvoiceDetailScreen;
