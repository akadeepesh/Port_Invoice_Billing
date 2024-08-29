import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Signup: undefined;
  CreateInvoice: undefined;
  InvoiceList: undefined;
  InvoiceDetail: { invoiceId: string };
};

export type NavigationProps = NativeStackNavigationProp<RootStackParamList>;
