import * as MailComposer from 'expo-mail-composer';
import { printToFileAsync } from 'expo-print';
import { generateInvoiceHTML } from './generateInvoiceHTML';
import { getAuth } from 'firebase/auth';
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

export const sendInvoiceByEmail = async (invoiceData : InvoiceData) => {
    const auth = getAuth();
    const email = auth?.currentUser?.email;
    console.log(email);
    const html = generateInvoiceHTML(invoiceData);
    const file = await printToFileAsync({ html: html, base64: false });
    
    };
