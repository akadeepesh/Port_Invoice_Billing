import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../types/navigation";
import { Feather } from "@expo/vector-icons";
import { updateInvoice } from "../services/updateInvoice";
import { getInvoiceById } from "../services/getInvoiceById";

type UpdateInvoiceScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "UpdateInvoice"
>;

type UpdateInvoiceScreenRouteProp = RouteProp<
  RootStackParamList,
  "UpdateInvoice"
>;

type Props = {
  navigation: UpdateInvoiceScreenNavigationProp;
  route: UpdateInvoiceScreenRouteProp;
};

type FirebaseTimestamp = {
  seconds: number;
  nanoseconds: number;
};

type InvoiceItem = {
  id: string;
  description: string;
  amount: string;
};

type InvoiceStatus = "paid" | "pending" | "overdue";

type InvoiceData = {
  invoiceNumber: string;
  invoiceDate: Date;
  dueDate: Date;
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

const UpdateInvoiceScreen: React.FC<Props> = ({ navigation, route }) => {
  const { invoiceId } = route.params;
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (invoiceId) {
      fetchInvoice();
    } else {
      setLoading(false);
    }
  }, [invoiceId]);

  const fetchInvoice = async () => {
    if (!invoiceId) return;

    try {
      const fetchedInvoice = await getInvoiceById(invoiceId);
      setInvoice(fetchedInvoice as any);
    } catch (error) {
      console.error("Error fetching invoice:", error);
      Alert.alert("Error", "Failed to fetch invoice. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const formatDate = (date: Date | string | any) => {
    console.log(typeof date);
    if (typeof date === "string") {
      console.log("Converting string to date", date);
      return date;
    }
    return date.toLocaleDateString();
  };
  const formatAmount = (amount: number | string) => {
    return Number(amount).toFixed(2);
  };

  const handleChange = (name: keyof InvoiceData, value: string | Date) => {
    setInvoice((prev) => {
      if (!prev) return null;
      return { ...prev, [name]: value };
    });
  };
  const renderReadOnlyInvoiceItems = () => (
    <>
      {invoice?.items.map((item, index) => (
        <View
          key={item.id}
          className="flex-row justify-between mb-2 pb-2 border-b border-gray-200"
        >
          <Text className="text-gray-600">{item.description}</Text>
          <Text className="font-medium text-gray-800">
            ${formatAmount(item.amount)}
          </Text>
        </View>
      ))}
      <View className="mt-4 pt-4 flex-row justify-between items-center">
        <Text className="text-lg font-semibold text-gray-800">Subtotal</Text>
        <Text className="text-xl font-bold text-gray-800">
          ${invoice?.subtotal}
        </Text>
      </View>
      <View className="mt-2 flex-row justify-between items-center">
        <Text className="text-lg font-semibold text-gray-800">GST</Text>
        <Text className="text-xl font-bold text-gray-800">
          ${invoice?.gstAmount}
        </Text>
      </View>
      <View className="mt-4 pt-4 border-t border-gray-200 flex-row justify-between items-center">
        <Text className="text-xl font-semibold text-gray-800">Total</Text>
        <Text className="text-2xl font-bold text-blue-600">
          ${invoice?.totalAmount}
        </Text>
      </View>
    </>
  );

  const handleNestedChange = (
    section: "billTo" | "from",
    name: keyof InvoiceData["billTo"],
    value: string
  ) => {
    setInvoice((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [section]: { ...prev[section], [name]: value },
      };
    });
  };

  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  const validateForm = () => {
    if (!invoice) return false;

    if (!invoice.invoiceNumber) {
      Alert.alert("Error", "Please enter an invoice number.");
      return false;
    }
    if (!validatePhoneNumber(invoice.billTo.phone)) {
      Alert.alert(
        "Error",
        "Please enter a valid 10-digit phone number for Bill To."
      );
      return false;
    }
    if (!validatePhoneNumber(invoice.from.phone)) {
      Alert.alert(
        "Error",
        "Please enter a valid 10-digit phone number for From."
      );
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!invoice || !invoiceId) return;

    if (validateForm()) {
      updateInvoice(invoiceId, invoice)
        .then(() => {
          Alert.alert("Success", "Invoice updated successfully!");
          navigation.goBack();
        })
        .catch((err: any) => {
          console.error("Error updating invoice", err);
          Alert.alert("Error", "Failed to update invoice. Please try again.");
        });
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!invoice) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Invoice not found.</Text>
      </View>
    );
  }

  const renderInput = (
    label: string,
    value: string,
    onChangeText: (text: string) => void,
    placeholder: string,
    keyboardType: any = "default"
  ) => (
    <View className="mb-4">
      <Text className="text-gray-600 mb-1">{label}</Text>
      <TextInput
        className="border border-gray-300 rounded-lg px-3 py-2 bg-white"
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
      />
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      <ScrollView className="flex-1 px-6 pt-6">

        <View className="bg-white rounded-xl shadow-md p-6 mb-6">
          {renderInput(
            "Invoice Number",
            invoice.invoiceNumber,
            (value) => handleChange("invoiceNumber", value),
            "Enter invoice number",
            "numeric"
          )}

          <View className="mb-4">
            <Text className="text-gray-600 mb-1">Invoice Date</Text>

            <Text>{formatDate(invoice.invoiceDate)}</Text>
          </View>

          <View className="mb-4">
            <Text className="text-gray-600 mb-1">Due Date</Text>

            <Text>{formatDate(invoice.dueDate)}</Text>
          </View>
        </View>


        <View className="bg-white rounded-xl shadow-md p-6 mb-6">
          <Text className="text-xl font-semibold text-gray-800 mb-4">
            Bill To
          </Text>
          {renderInput(
            "Name",
            invoice.billTo.name,
            (value) => handleNestedChange("billTo", "name", value),
            "Enter name"
          )}
          {renderInput(
            "Address",
            invoice.billTo.address,
            (value) => handleNestedChange("billTo", "address", value),
            "Enter address"
          )}
          {renderInput(
            "City, State, Zip",
            invoice.billTo.cityStateZip,
            (value) => handleNestedChange("billTo", "cityStateZip", value),
            "Enter city, state, zip"
          )}
          {renderInput(
            "Phone",
            invoice.billTo.phone,
            (value) => handleNestedChange("billTo", "phone", value),
            "Enter 10-digit phone number",
            "phone-pad"
          )}
        </View>

        <View className="bg-white rounded-xl shadow-md p-6 mb-6">
          <Text className="text-xl font-semibold text-gray-800 mb-4">From</Text>
          {renderInput(
            "Name",
            invoice.from.name,
            (value) => handleNestedChange("from", "name", value),
            "Enter name"
          )}
          {renderInput(
            "Address",
            invoice.from.address,
            (value) => handleNestedChange("from", "address", value),
            "Enter address"
          )}
          {renderInput(
            "City, State, Zip",
            invoice.from.cityStateZip,
            (value) => handleNestedChange("from", "cityStateZip", value),
            "Enter city, state, zip"
          )}
          {renderInput(
            "Phone",
            invoice.from.phone,
            (value) => handleNestedChange("from", "phone", value),
            "Enter 10-digit phone number",
            "phone-pad"
          )}
        </View>

        <View className="bg-white rounded-xl shadow-md p-6 mb-6">
          <Text className="text-xl font-semibold text-gray-800 mb-4">
            Invoice Items
          </Text>
          {invoice?.items.map((item, index) => (
            <View
              key={item.id}
              className="flex-row justify-between mb-2 pb-2 border-b border-gray-200"
            >
              <Text className="text-gray-600">
                {index + 1}. {item.description}
              </Text>
              <Text className="font-medium text-gray-800">
                ${formatAmount(item.amount)}
              </Text>
            </View>
          ))}
          <View className="mt-4 pt-4 flex-row justify-between items-center">
            <Text className="text-lg font-semibold text-gray-800">
              Subtotal
            </Text>
            <Text className="text-xl font-bold text-gray-800">
              ${invoice?.subtotal}
            </Text>
          </View>
          <View className="mt-2 flex-row justify-between items-center">
            <Text className="text-lg font-semibold text-gray-800">GST</Text>
            <Text className="text-xl font-bold text-gray-800">
              ${invoice?.gstAmount}
            </Text>
          </View>
          <View className="mt-4 pt-4 border-t border-gray-200 flex-row justify-between items-center">
            <Text className="text-xl font-semibold text-gray-800">Total</Text>
            <Text className="text-2xl font-bold text-blue-600">
              ${invoice?.totalAmount}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          className="bg-yellow-500 py-3 px-6 rounded-lg flex-row justify-center items-center mb-12"
          onPress={handleSubmit}
        >
          <Feather
            name="check"
            size={20}
            color="white"
            style={{ marginRight: 8 }}
          />
          <Text className="text-white font-semibold text-lg">
            Update Invoice
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UpdateInvoiceScreen;
