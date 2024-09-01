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
type FirebaseTimestamp = {
  seconds: number;
  nanoseconds: number;
};

export const generateInvoiceHTML = (data: InvoiceData): string => {
  const formatDate = (date: Date | string | any | FirebaseTimestamp) => {
    console.log(typeof date, date);
    if (typeof date === "string") {
      console.log("Converting string to date", date);
      return date;
    }
    if (typeof date === "object") {
      const object_date = new Date(date.seconds * 1000);
      return object_date.toLocaleDateString();
    }
    return date.toLocaleDateString();
  };
  const itemsHTML = data.items
    .map(
      (item) => `
        <tr>
          <td>${item.description}</td>
          <td style="text-align: right;">$${item.amount}</td>
        </tr>
      `
    )
    .join("");

  return `
    <html>
      <head>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            margin: 0; 
            padding: 20px; 
            background-color: #f4f4f9; 
            color: #333; 
          }
          h1 {
            color: #333;
            margin-bottom: 20px;
          }
          h3 {
            margin-bottom: 5px;
            color: #555;
          }
          p {
            margin: 5px 0;
          }
          table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-top: 20px;
          }
          th, td { 
            border: 1px solid #ddd; 
            padding: 12px; 
            text-align: left; 
          }
          th { 
            background-color: #333; 
            color: white; 
          }
          td {
            background-color: #fff;
          }
          .flex-container {
            display: flex; 
            justify-content: space-between; 
            margin-top: 20px;
          }
          .flex-container div {
            width: 48%;
          }
          .total-section {
            text-align: right; 
            margin-top: 20px; 
            padding: 10px; 
            background-color: #eaeaea; 
          }
          .footer {
            margin-top: 20px;
            padding: 10px;
            background-color: #eaeaea;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <h1>INVOICE</h1>
        <p><strong>Invoice :</strong> #${data.invoiceNumber}</p>
        <p><strong>Date:</strong> ${formatDate(data.invoiceDate)}</p>
        <p><strong>Due Date:</strong> ${formatDate(data.dueDate)}</p>
        
        <div class="flex-container">
          <div>
            <h3>Bill To:</h3>
            <p><strong>Name : </strong> ${data.billTo.name}</p>
            <p><strong>Address : </strong> ${data.billTo.address}</p>
            <p><strong>City,State,Zip : </strong>${data.billTo.cityStateZip}</p>
            <p><strong>Phone : </strong> ${data.billTo.phone}</p>
          </div>
          <div>
            <h3>From:</h3>
            <p><strong>Name : </strong>${data.from.name}</p>
            <p><strong>Address : </strong>${data.from.address}</p>
            <p><strong>City,State,Zip : </strong>${data.from.cityStateZip}</p>
            <p><strong>Phone : </strong> ${data.from.phone}</p>
          </div>
        </div>
        
        <table>
          <tr>
            <th>Description</th>
            <th style="text-align: right;">Amount</th>
          </tr>
          ${itemsHTML}
        </table>
        
        <div class="total-section">
          <p><strong>Subtotal:</strong> $${data.subtotal.toFixed(2)}</p>
          <p><strong>GST:</strong> $${data.gstAmount.toFixed(2)}</p>
          <p><strong>Total:</strong> $${data.totalAmount.toFixed(2)}</p>
        </div>
        
        <p class="footer"><strong>Status:</strong> ${data.status}</p>
      </body>
    </html>
  `;
};
