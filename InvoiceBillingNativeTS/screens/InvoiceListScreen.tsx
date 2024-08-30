import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
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

type InvoiceStatus = "paid" | "pending" | "overdue";

type FirebaseTimestamp = {
  seconds: number;
  nanoseconds: number;
};

type InvoiceItem = {
  id: string;
  description: string;
  amount: string;
};

type InvoiceData = {
  id: string;
  invoiceNumber: string;
  invoiceDate: FirebaseTimestamp;
  dueDate: FirebaseTimestamp;
  billTo: {
    name: string;
    address: string;
    cityStateZip: string;
    phone: string;
  };
  from: {
    name: string;
    address: string;
    cityStateZip: string;
    phone: string;
  };
  items: InvoiceItem[];
  subtotal: number;
  gstAmount: number;
  totalAmount: number;
  userId: string;
  status: InvoiceStatus;
};

const InvoiceListScreen: React.FC<Props> = ({ navigation }) => {
  const [invoices, setInvoices] = useState<InvoiceData[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const formatDate = (timestamp: FirebaseTimestamp) => {
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString();
  };

  const formatAmount = (amount: number | string) => {
    return Number(amount).toFixed(2);
  };

  useEffect(() => {
    const fetchInvoices = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        try {
          const invoiceData = await getInvoicesByUserId(user.uid);
          setInvoices(invoiceData as InvoiceData[]);
        } catch (err) {
          console.error("Error fetching invoices:", err);
          setError("Failed to fetch invoices");
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
        setError("No user logged in");
      }
    };

    fetchInvoices();
  }, []);

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

  const renderInvoiceItem = ({ item }: { item: InvoiceData }) => (
    <TouchableOpacity
      className="bg-white p-6 mb-4 rounded-xl shadow-md"
      onPress={() =>
        navigation.navigate("InvoiceDetail", { invoiceId: item.id })
      }
    >
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-xl font-semibold text-gray-800">
          {item.invoiceNumber}
        </Text>
        <View
          className={`px-3 py-1 rounded-full ${getStatusColor(item.status)}`}
        >
          <Text className="text-white font-medium">{item.status}</Text>
        </View>
      </View>
      <Text className="text-gray-600 mb-3">
        Due: {formatDate(item.dueDate)}
      </Text>
      <View className="flex-row justify-between items-center">
        <View>
          <Text className="text-gray-600">Total Amount</Text>
          <Text className="text-2xl font-bold text-gray-800">
            ${formatAmount(item.totalAmount)}
          </Text>
        </View>
        <Feather name="chevron-right" size={24} color="#9CA3AF" />
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <Text className="text-xl text-red-500">{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <StatusBar barStyle="dark-content" backgroundColor="#F3F4F6" />
      <View className="flex-1 px-4 pt-6">
        <Text className="text-3xl font-bold text-gray-800 mb-6">
          Your Invoices
        </Text>
        {invoices && invoices.length > 0 ? (
          <FlatList
            data={invoices}
            renderItem={renderInvoiceItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View className="flex-1 justify-center items-center">
            <Text className="text-xl text-gray-500">No invoices found</Text>
          </View>
        )}
      </View>
      <TouchableOpacity
        className="absolute bottom-6 right-6 bg-indigo-600 w-16 h-16 rounded-full items-center justify-center shadow-lg"
        onPress={() => navigation.navigate("CreateInvoice")}
      >
        <Feather name="plus" size={30} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default InvoiceListScreen;
