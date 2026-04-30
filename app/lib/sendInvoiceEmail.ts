import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type InvoiceItem = {
  productName: string;
  sizeLabel?: string | null;
  color?: string | null;
  quantity: number;
  unitPrice: any;
  totalPrice: any;
};

type InvoiceOrder = {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string | null;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  totalAmount: any;
  subtotalAmount: any;
  shippingAmount: any;
  discountAmount: any;
  taxAmount: any;
  currencyCode: string;
  items: InvoiceItem[];
};

export async function sendInvoiceEmail(order: InvoiceOrder) {
  const itemsHtml = order.items
    .map(
      (item) => `
        <tr>
          <td style="padding:12px;border-bottom:1px solid #eee;">
            <strong>${item.productName}</strong><br/>
            <span style="color:#666;font-size:13px;">
              ${item.sizeLabel ? `Size: ${item.sizeLabel}` : ""}
              ${item.color ? ` | Color: ${item.color}` : ""}
            </span>
          </td>
          <td style="padding:12px;border-bottom:1px solid #eee;text-align:center;">
            ${item.quantity}
          </td>
          <td style="padding:12px;border-bottom:1px solid #eee;text-align:right;">
            ${order.currencyCode} ${item.unitPrice}
          </td>
          <td style="padding:12px;border-bottom:1px solid #eee;text-align:right;">
            ${order.currencyCode} ${item.totalPrice}
          </td>
        </tr>
      `
    )
    .join("");

  await resend.emails.send({
    from: "BLTDIF <support@bltdif.in>",
    to: order.customerEmail,
    subject: `Your BLTDIF Invoice - ${order.orderNumber}`,
    html: `
      <div style="margin:0;padding:0;background:#f6f6f6;font-family:Arial,Helvetica,sans-serif;color:#111;">
        <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
          <tr>
            <td align="center">
              <table width="100%" cellpadding="0" cellspacing="0" style="max-width:680px;background:#fff;border:1px solid #eee;">
                <tr>
                  <td style="padding:28px 32px;border-bottom:1px solid #eee;">
                    <p style="margin:0;color:#CE0028;font-size:12px;letter-spacing:2px;font-weight:bold;">BLTDIF INVOICE</p>
                    <h1 style="margin:10px 0 0;font-size:28px;">Thank you for your order</h1>
                    <p style="margin:10px 0 0;color:#666;font-size:14px;">Your order has been successfully placed.</p>
                  </td>
                </tr>

                <tr>
                  <td style="padding:24px 32px;">
                    <p style="margin:0 0 8px;font-size:14px;"><strong>Order Number:</strong> ${order.orderNumber}</p>
                    <p style="margin:0 0 8px;font-size:14px;"><strong>Name:</strong> ${order.customerName}</p>
                    <p style="margin:0 0 8px;font-size:14px;"><strong>Email:</strong> ${order.customerEmail}</p>
                    <p style="margin:0;font-size:14px;"><strong>Phone:</strong> ${order.customerPhone || ""}</p>
                  </td>
                </tr>

                <tr>
                  <td style="padding:0 32px 24px;">
                    <h2 style="margin:0 0 12px;font-size:18px;">Shipping Address</h2>
                    <p style="margin:0;color:#555;font-size:14px;line-height:1.7;">
                      ${order.addressLine1}<br/>
                      ${order.addressLine2 ? `${order.addressLine2}<br/>` : ""}
                      ${order.city}, ${order.state} ${order.zipCode}<br/>
                      ${order.country}
                    </p>
                  </td>
                </tr>

                <tr>
                  <td style="padding:0 32px 24px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #eee;">
                      <thead>
                        <tr style="background:#111;color:#fff;">
                          <th align="left" style="padding:12px;font-size:13px;">Item</th>
                          <th align="center" style="padding:12px;font-size:13px;">Qty</th>
                          <th align="right" style="padding:12px;font-size:13px;">Price</th>
                          <th align="right" style="padding:12px;font-size:13px;">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${itemsHtml}
                      </tbody>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style="padding:0 32px 32px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:6px 0;color:#666;">Subtotal</td>
                        <td align="right">${order.currencyCode} ${order.subtotalAmount}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;color:#666;">Shipping</td>
                        <td align="right">${order.currencyCode} ${order.shippingAmount}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;color:#666;">Tax</td>
                        <td align="right">${order.currencyCode} ${order.taxAmount}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;color:#666;">Discount</td>
                        <td align="right">- ${order.currencyCode} ${order.discountAmount}</td>
                      </tr>
                      <tr>
                        <td style="padding-top:14px;border-top:1px solid #eee;font-size:18px;font-weight:bold;">Total</td>
                        <td align="right" style="padding-top:14px;border-top:1px solid #eee;font-size:18px;font-weight:bold;">
                          ${order.currencyCode} ${order.totalAmount}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style="padding:20px 32px;background:#111;color:#fff;font-size:13px;">
                    BLTDIF · Thank you for shopping with us.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </div>
    `,
  });
}