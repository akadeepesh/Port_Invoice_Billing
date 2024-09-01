import { generateInvoiceHTML } from "./generateInvoiceHTML";
import { printToFileAsync } from "expo-print";
import { shareAsync } from "expo-sharing";
type InvoiceStatus = "paid" | "pending" | "overdue";

type InvoiceItem = {
  id: string;
  description: string;
  amount: string;
};

type InvoiceData = {
  id: string;
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

export const generateInvoicePDF = async (data: InvoiceData): Promise<void> => {

  const html = generateInvoiceHTML(data);


  const file = await printToFileAsync({ html: html, base64: false });
  await shareAsync(file.uri);
};
