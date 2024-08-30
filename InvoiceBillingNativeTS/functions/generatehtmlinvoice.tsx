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
const generateInvoiceHTML = (data: InvoiceData): string => {
  const itemsHTML = data.items
    .map(
      (item) => `
    <tr>
      <td>${item.description}</td>
      
      <td>$${item.amount.toFixed(2)}</td>
      
    </tr>
  `
    )
    .join("");

  return `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
        </style>
      </head>
      <body>
        <h1>INVOICE</h1>
        <p><strong>Invoice #:</strong> ${data.invoiceNumber}</p>
        <p><strong>Date:</strong> ${data.invoiceDate.toLocaleDateString()}</p>
        <p><strong>Due Date:</strong> ${data.dueDate.toLocaleDateString()}</p>
        
        <div style="display: flex; justify-content: space-between;">
          <div>
            <h3>Bill To:</h3>
            <p>${data.billTo.name}<br>
               ${data.billTo.address}<br>
               ${data.billTo.cityStateZip}<br>
               Phone: ${data.billTo.phone}</p>
          </div>
          <div>
            <h3>From:</h3>
            <p>${data.from.name}<br>
               ${data.from.address}<br>
               ${data.from.cityStateZip}<br>
               Phone: ${data.from.phone}</p>
          </div>
        </div>
        
        <table>
          <tr>
            <th>Description</th>
            <th>Quantity</th>
            <th>Unit Price</th>
            <th>Amount</th>
          </tr>
          ${itemsHTML}
        </table>
        
        <div style="text-align: right; margin-top: 20px;">
          <p><strong>Subtotal:</strong> $${data.subtotal.toFixed(2)}</p>
          <p><strong>GST:</strong> $${data.gstAmount.toFixed(2)}</p>
          <p><strong>Total:</strong> $${data.totalAmount.toFixed(2)}</p>
        </div>
        
        <p><strong>Status:</strong> ${data.status}</p>
      </body>
    </html>
  `;
};
