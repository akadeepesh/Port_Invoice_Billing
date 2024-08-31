import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export type RootStackParamList = {
  Home: undefined;
  Login: { returnScreen?: keyof RootStackParamList };
  Signup: { returnScreen?: keyof RootStackParamList };
  CreateInvoice: undefined;
  InvoiceList: undefined;
  UpdateInvoice: { invoiceId: string | undefined };
  InvoiceDetail: { invoiceId: string };
};

export type NavigationProps = NativeStackNavigationProp<RootStackParamList>;
