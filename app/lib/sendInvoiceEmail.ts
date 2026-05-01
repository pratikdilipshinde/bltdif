import { Resend } from "resend";
import { Prisma } from "@prisma/client";

const resend = new Resend(process.env.RESEND_API_KEY);

type AmountValue = number | string | Prisma.Decimal;

type InvoiceItem = {
  productName: string;
  sizeLabel?: string | null;
  color?: string | null;
  quantity: number;
  unitPrice: AmountValue;
  totalPrice: AmountValue;
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
  subtotalAmount: AmountValue;
  shippingAmount: AmountValue;
  discountAmount: AmountValue;
  totalAmount: AmountValue;
  currencyCode: string;
  items: InvoiceItem[];
};

function formatAmount(value: AmountValue) {
  return Number(value.toString()).toFixed(2);
}

function isPositiveAmount(value: AmountValue) {
  return Number(value.toString()) > 0;
}

export async function sendInvoiceEmail(order: InvoiceOrder) {
  const BRAND_RED = "#CE0028";
  const SOFT_RED = "#ff3b5c";
  const HARD_RED = "#7a0019";

  const LOGO_WHITE = "https://bltdif.in/images/Logo-white.png";
  const BD_WATERMARK = "https://bltdif.in/images/BD-logo.png";

  const itemRows = order.items
    .map(
      (item, i) => `
        <tr style="background:${i % 2 === 0 ? "#f9fafb" : "#ffffff"}">
          <td style="padding:12px 16px; font-size:14px; color:#374151;">
            ${item.productName}
            ${
              item.sizeLabel || item.color
                ? `<br/><span style="font-size:12px; color:#6b7280;">
                    ${item.sizeLabel ? `Size: ${item.sizeLabel}` : ""}
                    ${item.color ? ` ${item.sizeLabel ? "|" : ""} Color: ${item.color}` : ""}
                  </span>`
                : ""
            }
          </td>
          <td style="padding:12px 16px; font-size:14px; color:#374151; text-align:center;">
            ${item.quantity}
          </td>
          <td style="padding:12px 16px; font-size:14px; color:#374151; text-align:right;">
            ${order.currencyCode} ${formatAmount(item.unitPrice)}
          </td>
          <td style="padding:12px 16px; font-size:14px; color:#374151; text-align:right; font-weight:600;">
            ${order.currencyCode} ${formatAmount(item.totalPrice)}
          </td>
        </tr>`
    )
    .join("");

  await resend.emails.send({
    from: "BLTDIF <support@bltdif.in>",
    to: order.customerEmail,
    subject: `Invoice #${order.orderNumber}`,
    html: `
<!DOCTYPE html>
<html lang="en">
<body style="margin:0; padding:0; background:#f3f4f6; font-family:'Segoe UI', Arial, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6; padding:40px 12px;">
    <tr>
      <td align="center">

        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:700px; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <tr>
            <td style="background:linear-gradient(135deg, ${HARD_RED} 0%, ${BRAND_RED} 45%, ${SOFT_RED} 100%); padding:36px 40px; color:#ffffff;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="left" valign="top">
                    <img src="${LOGO_WHITE}" alt="BLTDIF" style="width:200px; max-width:100%; display:block; margin-bottom:10px;" />

                    <p style="margin:4px 0 0; font-size:13px; color:#ffffff; opacity:0.9;">
                      support@bltdif.in | +91 98765 43210
                    </p>

                    <p style="margin:2px 0 0; font-size:13px; color:#ffffff; opacity:0.9;">
                      Mumbai, Maharashtra, India
                    </p>
                  </td>

                  <td align="right" valign="top">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="background:rgba(255,255,255,0.18); border-radius:8px; padding:14px 20px;">
                          <p style="margin:0; font-size:13px; color:#ffffff; opacity:0.9; text-transform:uppercase; letter-spacing:1px;">
                            Invoice
                          </p>

                          <p style="margin:4px 0 0; font-size:22px; font-weight:700; color:#ffffff;">
                            #${order.orderNumber}
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="background:#fff1f3; padding:10px 40px; border-bottom:1px solid #ffd1d9;">
              <p style="margin:0; font-size:13px; color:${BRAND_RED}; font-weight:600;">
                ✅ Payment Confirmed — Thank you for your order!
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 40px; border-bottom:1px solid #e5e7eb;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="left" valign="top" style="padding-right:20px;">
                    <p style="margin:0 0 4px; font-size:11px; text-transform:uppercase; letter-spacing:1px; color:#9ca3af;">
                      Bill To
                    </p>

                    <p style="margin:0; font-size:15px; font-weight:600; color:#111827;">
                      ${order.customerName}
                    </p>

                    <p style="margin:2px 0 0; font-size:13px; color:#6b7280;">
                      ${order.customerEmail}
                    </p>

                    ${
                      order.customerPhone
                        ? `<p style="margin:2px 0 0; font-size:13px; color:#6b7280;">${order.customerPhone}</p>`
                        : ""
                    }

                    <p style="margin:6px 0 0; font-size:13px; color:#6b7280; max-width:200px; line-height:1.5;">
                      ${order.addressLine1}<br/>
                      ${order.addressLine2 ? `${order.addressLine2}<br/>` : ""}
                      ${order.city}, ${order.state} ${order.zipCode}<br/>
                      ${order.country}
                    </p>
                  </td>

                  <td align="right" valign="top">
                    <p style="margin:0 0 4px; font-size:11px; text-transform:uppercase; letter-spacing:1px; color:#9ca3af;">
                      Order Details
                    </p>

                    <p style="margin:0; font-size:13px; color:#374151;">
                      <span style="color:#9ca3af;">Order:</span> #${order.orderNumber}
                    </p>

                    <p style="margin:4px 0 0; font-size:13px; color:#374151;">
                      <span style="color:#9ca3af;">Payment:</span> Confirmed
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 40px 0;">
              <p style="margin:0 0 12px; font-size:13px; font-weight:600; color:#374151; text-transform:uppercase; letter-spacing:0.5px;">
                Order Items
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; border-radius:8px; overflow:hidden; border:1px solid #e5e7eb;">
                <thead>
                  <tr style="background:${BRAND_RED}; color:#ffffff;">
                    <th style="padding:12px 16px; text-align:left; font-size:12px; text-transform:uppercase; letter-spacing:0.5px;">Product</th>
                    <th style="padding:12px 16px; text-align:center; font-size:12px; text-transform:uppercase; letter-spacing:0.5px;">Qty</th>
                    <th style="padding:12px 16px; text-align:right; font-size:12px; text-transform:uppercase; letter-spacing:0.5px;">Price</th>
                    <th style="padding:12px 16px; text-align:right; font-size:12px; text-transform:uppercase; letter-spacing:0.5px;">Total</th>
                  </tr>
                </thead>

                <tbody>
                  ${itemRows}
                </tbody>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:20px 40px 28px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td></td>

                  <td width="260" align="right">
                    <table width="260" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:8px 0; border-bottom:1px solid #f3f4f6; font-size:14px; color:#6b7280;" align="left">
                          Subtotal
                        </td>
                        <td style="padding:8px 0; border-bottom:1px solid #f3f4f6; font-size:14px; color:#374151;" align="right">
                          ${order.currencyCode} ${formatAmount(order.subtotalAmount)}
                        </td>
                      </tr>

                      <tr>
                        <td style="padding:8px 0; border-bottom:1px solid #f3f4f6; font-size:14px; color:${BRAND_RED};" align="left">
                          Discount
                        </td>
                        <td style="padding:8px 0; border-bottom:1px solid #f3f4f6; font-size:14px; color:${BRAND_RED};" align="right">
                          -${order.currencyCode} ${formatAmount(order.discountAmount)}
                        </td>
                      </tr>

                      <tr>
                        <td style="padding:8px 0; border-bottom:1px solid #f3f4f6; font-size:14px; color:#6b7280;" align="left">
                          Shipping
                        </td>
                        <td style="padding:8px 0; border-bottom:1px solid #f3f4f6; font-size:14px; color:#374151;" align="right">
                          ${
                            isPositiveAmount(order.shippingAmount)
                              ? `${order.currencyCode} ${formatAmount(order.shippingAmount)}`
                              : "FREE"
                          }
                        </td>
                      </tr>

                      <tr>
                        <td colspan="2" style="padding-top:8px;">
                          <table width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND_RED}; border-radius:8px;">
                            <tr>
                              <td style="padding:12px 16px; font-size:15px; font-weight:700; color:#ffffff;" align="left">
                                Total
                              </td>
                              <td style="padding:12px 16px; font-size:18px; font-weight:700; color:#ffffff;" align="right">
                                ${order.currencyCode} ${formatAmount(order.totalAmount)}
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="position:relative; background:#f9fafb; padding:24px 40px; text-align:center; border-top:1px solid #e5e7eb; overflow:hidden;">
              <img src="${BD_WATERMARK}" alt="" style="position:absolute; left:50%; top:50%; transform:translate(-50%,-50%); width:200px; opacity:0.06;" />

              <div style="position:relative; z-index:2;">
                <p style="margin:0; font-size:14px; color:#374151; font-weight:600;">
                  Thank you for shopping with us! 🎉
                </p>

                <p style="margin:6px 0 0; font-size:12px; color:#9ca3af;">
                  Questions? Reply to this email or contact us at support@bltdif.in
                </p>

                <p style="margin:12px 0 0; font-size:11px; color:#d1d5db;">
                  This is an auto-generated invoice. Please keep it for your records.
                </p>
              </div>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
    `,
  });
}