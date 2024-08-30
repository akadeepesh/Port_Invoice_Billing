const { default: db } = require("../firebase");
import { doc, getDoc } from "firebase/firestore";

export async function getInvoiceById(invoiceId) {
  try {
    const invoiceRef = doc(db, "invoices", invoiceId);
    const invoiceSnap = await getDoc(invoiceRef);

    if (invoiceSnap.exists()) {
      const invoiceData = invoiceSnap.data();
      const invoice = {
        id: invoiceSnap.id, // This is the document ID
        ...invoiceData, // Spread the rest of the document data
      };
      console.log("Invoice data:", invoice);
      return invoice;
    } else {
      console.log("No such invoice!");
      return null;
    }
  } catch (error) {
    console.error("Error getting invoice:", error);
    throw error;
  }
}

// Usage example
// getInvoiceById("ABC123") // Assuming 'ABC123' is a valid document ID
//   .then((invoice) => {
//     if (invoice) {
//       console.log("Retrieved invoice:", invoice);
//       console.log("Invoice ID:", invoice.id);
//       // Access other fields like invoice.amount, invoice.date, etc.
//     } else {
//       console.log("Invoice not found");
//     }
//   })
//   .catch((error) => {
//     console.error("Error:", error);
//   });
