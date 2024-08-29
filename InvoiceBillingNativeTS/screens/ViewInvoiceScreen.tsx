import React, { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import { getAuth } from "firebase/auth";
import { getInvoicesByUserId } from "../services/getInvoiceByUserId";

type ViewInvoiceScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "ViewInvoice"
>;

type Props = {
  navigation: ViewInvoiceScreenNavigationProp;
};
type InvoiceData = {
  invoiceNumber: string;
  invoiceDate: Date;
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
  description: string;
  amount: string;
  userId: string;
};

const ViewInvoiceScreen: React.FC<Props> = ({ navigation }) => {
  //Invoice for particular user
  const [invoiceList, setInvoiceList] = useState<InvoiceData[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        try {
          const invoiceData = await getInvoicesByUserId(user.uid);
          setInvoiceList(invoiceData);
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
