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
  FlatList,
  ActivityIndicator,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../types/navigation";
import DateTimePicker from "@react-native-community/datetimepicker";
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

const GST_RATE = 0.08; // 8% GST

const UpdateInvoiceScreen: React.FC<Props> = ({ navigation, route }) => {
  const { invoiceId } = route.params;
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [newItem, setNewItem] = useState<InvoiceItem>({
    id: "",
    description: "",
    amount: "",
  });

  useEffect(() => {
    if (invoiceId) {
      fetchInvoice();
    } else {
      setLoading(false);
    }
  }, [invoiceId]);

  useEffect(() => {
    if (invoice) {
      calculateTotals();
    }
  }, [invoice?.items]);

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

  const calculateTotals = () => {
    if (!invoice) return;

    const subtotal = invoice.items.reduce(
      (total, item) => total + parseFloat(item.amount || "0"),
      0
    );
    const gstAmount = subtotal * GST_RATE;
    const totalAmount = subtotal + gstAmount;

    setInvoice((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        subtotal,
        gstAmount,
        totalAmount,
      };
    });
  };

  const handleChange = (name: keyof InvoiceData, value: string | Date) => {
    setInvoice((prev) => {
      if (!prev) return null;
      return { ...prev, [name]: value };
    });
  };

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

  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    setShowDatePicker(false);
    if (selectedDate && invoice) {
      handleChange("invoiceDate", selectedDate);
      const newDueDate = new Date(selectedDate);
      newDueDate.setDate(newDueDate.getDate() + 30);
      handleChange("dueDate", newDueDate);
    }
  };

  const handleAddItem = () => {
    if (newItem.description && newItem.amount && invoice) {
      setInvoice((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          items: [...prev.items, { ...newItem, id: Date.now().toString() }],
        };
      });
      setNewItem({ id: "", description: "", amount: "" });
    } else {
      Alert.alert(
        "Error",
        "Please enter both description and amount for the item."
      );
    }
  };

  const handleRemoveItem = (id: string) => {
    setInvoice((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        items: prev.items.filter((item) => item.id !== id),
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
    if (invoice.items.length === 0) {
      Alert.alert("Error", "Please add at least one item to the invoice.");
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

  const renderItemInput = () => (
    <View className="mb-4 bg-gray-100 p-4 rounded-lg">
      <Text className="text-lg font-semibold mb-2">Add New Item</Text>
      {renderInput(
        "Description",
        newItem.description,
        (value) => setNewItem((prev) => ({ ...prev, description: value })),
        "Enter item description"
      )}
      {renderInput(
        "Amount",
        newItem.amount,
        (value) => setNewItem((prev) => ({ ...prev, amount: value })),
        "Enter item amount",
        "numeric"
      )}
      <TouchableOpacity
        className="bg-green-500 py-2 px-4 rounded-lg flex-row justify-center items-center mt-2"
        onPress={handleAddItem}
      >
        <Feather
          name="plus"
          size={20}
          color="white"
          style={{ marginRight: 8 }}
        />
        <Text className="text-white font-semibold">Add Item</Text>
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({ item }: { item: InvoiceItem }) => (
    <View className="flex-row justify-between items-center bg-white p-4 rounded-lg mb-2 shadow-sm">
      <View className="flex-1 mr-4">
        <Text className="font-semibold">{item.description}</Text>
        <Text className="text-gray-600">${item.amount}</Text>
      </View>
      <TouchableOpacity
        className="bg-red-500 p-2 rounded-full"
        onPress={() => handleRemoveItem(item.id)}
      >
        <Feather name="trash-2" size={16} color="white" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      <ScrollView className="flex-1 px-6 pt-6">
        <Text className="text-3xl font-bold text-gray-800 mb-6">
          Update Invoice
        </Text>

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
            <TouchableOpacity
              className="border border-gray-300 rounded-lg px-3 py-2 bg-white flex-row justify-between items-center"
              onPress={() => setShowDatePicker(true)}
            >
              <Text>{invoice.invoiceDate.toLocaleDateString()}</Text>
              <Feather name="calendar" size={20} color="#4B5563" />
            </TouchableOpacity>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={invoice.invoiceDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
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
          <FlatList
            data={invoice.items}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={
              <Text className="text-gray-500 italic">No items added yet.</Text>
            }
            className="mb-4"
          />
          {renderItemInput()}
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
