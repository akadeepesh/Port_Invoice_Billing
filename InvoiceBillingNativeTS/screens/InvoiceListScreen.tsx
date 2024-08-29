import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import { Feather } from "@expo/vector-icons";
import { getAuth } from "firebase/auth";
import { getInvoicesByUserId } from "../services/getInvoiceByUserId";

type InvoiceListScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "InvoiceList"
>;

type Props = {
  navigation: InvoiceListScreenNavigationProp;
};

const InvoiceListScreen: React.FC<Props> = ({ navigation }) => {
  // Sample invoice data (replace with actual data from Firebase later)
  const invoices = [
    {
      id: "1",
      title: "Invoice #001",
      amount: "$2,500.00",
      date: "2024-05-15",
      status: "Paid",
    },
    {
      id: "2",
      title: "Invoice #002",
      amount: "$1,800.00",
      date: "2024-05-20",
      status: "Pending",
    },
    {
      id: "3",
      title: "Invoice #003",
      amount: "$3,200.00",
      date: "2024-05-25",
      status: "Overdue",
    },
  ];

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

  const renderInvoiceItem = ({ item }: { item: (typeof invoices)[0] }) => (
    <TouchableOpacity
      className="bg-white p-4 mb-4 rounded-xl shadow-md"
      onPress={() =>
        navigation.navigate("InvoiceDetail", { invoiceId: item.id })
      }
    >
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-lg font-semibold text-gray-800">
          {item.title}
        </Text>
        <View
          className={`px-2 py-1 rounded-full ${getStatusColor(item.status)}`}
        >
          <Text className="text-white font-medium">{item.status}</Text>
        </View>
      </View>
      <Text className="text-gray-600 mb-2">{item.date}</Text>
      <View className="flex-row justify-between items-center">
        <Text className="text-2xl font-bold text-gray-800">{item.amount}</Text>
        <Feather name="chevron-right" size={24} color="#9CA3AF" />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <StatusBar barStyle="dark-content" backgroundColor="#F3F4F6" />
      <View className="flex-1 px-4 pt-6">
        <Text className="text-3xl font-bold text-gray-800 mb-6">
          Your Invoices
        </Text>
        <FlatList
          data={invoices}
          renderItem={renderInvoiceItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      </View>
      <TouchableOpacity
        className="absolute bottom-6 right-6 bg-blue-500 w-14 h-14 rounded-full items-center justify-center shadow-lg"
        onPress={() => navigation.navigate("CreateInvoice")}
      >
        <Feather name="plus" size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default InvoiceListScreen;
