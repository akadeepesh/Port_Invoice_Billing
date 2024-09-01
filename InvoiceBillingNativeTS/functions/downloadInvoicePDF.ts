import * as FileSystem from "expo-file-system";
import { Platform } from "react-native";
import { printToFileAsync } from "expo-print";
import { generateInvoiceHTML } from "./generateInvoiceHTML";

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

export const downloadInvoicePDF = async (
  invoice: InvoiceData
): Promise<string> => {
  try {
    // Generate HTML
    const html = generateInvoiceHTML(invoice);

    // Generate PDF file
    const file = await printToFileAsync({ html: html, base64: false });

    let downloadPath: string;

    if (Platform.OS === "android") {
      // On Android, save to the Downloads directory
      downloadPath =
        FileSystem.cacheDirectory + `invoice_${invoice.invoiceNumber}.pdf`;
      await FileSystem.copyAsync({
        from: file.uri,
        to: downloadPath,
      });

      // Move file to the downloads directory
      const downloadDir = FileSystem.documentDirectory + "Download/";
      await FileSystem.makeDirectoryAsync(downloadDir, { intermediates: true });
      const newPath = downloadDir + `invoice_${invoice.invoiceNumber}.pdf`;
      await FileSystem.moveAsync({
        from: downloadPath,
        to: newPath,
      });

      downloadPath = newPath;
    } else if (Platform.OS === "ios") {
      // For iOS, save to the app's documents directory
      downloadPath =
        FileSystem.documentDirectory + `invoice_${invoice.invoiceNumber}.pdf`;
      await FileSystem.moveAsync({
        from: file.uri,
        to: downloadPath,
      });
    } else {
      throw new Error("Unsupported platform");
    }

    console.log("File saved successfully:", downloadPath);
    return downloadPath;
  } catch (error) {
    console.error("Error downloading file:", error);
    throw error;
  }
};
