import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNFS from 'react-native-fs';
type InvoiceItem = {
  id: string;
  description: string;
  amount: number;
  quantity: number;
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

export const generateInvoicePDF = async (data: InvoiceData): Promise<string|null|undefined> => {
  const html = generateInvoiceHTML(data);
  
  try {
    const options = {
      html,
      fileName: `Invoice_${data.invoiceNumber}`,
      directory: 'Documents',
    };

    const file = await RNHTMLtoPDF.convert(options);
    console.log(file.filePath);
    return file.filePath;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};