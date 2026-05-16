import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type OrderUpdateEmailInput = {
  to: string;
  customerName: string;
  orderNumber: string;
  orderStatus: string;
  courierName?: string | null;
  trackingNumber?: string | null;
  trackingUrl?: string | null;
  adminNote?: string | null;
};

function formatStatus(status: string) {
  return status
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function escapeHtml(value?: string | null) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function sendOrderUpdateEmail({
  to,
  customerName,
  orderNumber,
  orderStatus,
  courierName,
  trackingNumber,
  trackingUrl,
  adminNote,
}: OrderUpdateEmailInput) {
  const BRAND_RED = "#CE0028";
  const SOFT_RED = "#ff3b5c";
  const HARD_RED = "#7a0019";

  const LOGO_WHITE = "https://bltdif.in/images/Logo-white.png";

  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY missing. Skipping order update email.");
    return { success: false, error: "RESEND_API_KEY missing" };
  }

  if (!to) {
    console.warn("Customer email missing. Skipping order update email.");
    return { success: false, error: "Customer email missing" };
  }

  const safeCustomerName = escapeHtml(customerName || "there");
  const safeOrderNumber = escapeHtml(orderNumber);
  const safeOrderStatus = escapeHtml(formatStatus(orderStatus));
  const safeCourierName = escapeHtml(courierName);
  const safeTrackingNumber = escapeHtml(trackingNumber);
  const safeTrackingUrl = escapeHtml(trackingUrl);
  const safeAdminNote = escapeHtml(adminNote);

  const hasShippingInfo = courierName || trackingNumber || trackingUrl;

  const { data, error } = await resend.emails.send({
    from: process.env.ORDER_EMAIL_FROM || "BLTDIF <support@bltdif.in>",
    to: [to],
    subject: `BLTDIF Order Update - ${safeOrderNumber}`,
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
                      support@bltdif.in
                    </p>

                    <p style="margin:2px 0 0; font-size:13px; color:#ffffff; opacity:0.9;">
                      BLTDIF Order Support
                    </p>
                  </td>

                  <td align="right" valign="top">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="background:rgba(255,255,255,0.18); border-radius:8px; padding:14px 20px;">
                          <p style="margin:0; font-size:13px; color:#ffffff; opacity:0.9; text-transform:uppercase; letter-spacing:1px;">
                            Order Update
                          </p>

                          <p style="margin:4px 0 0; font-size:22px; font-weight:700; color:#ffffff;">
                            #${safeOrderNumber}
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
                Your BLTDIF order status has been updated.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:30px 40px 22px;">
              <p style="margin:0 0 14px; font-size:15px; color:#374151; line-height:1.6;">
                Hi <strong>${safeCustomerName}</strong>,
              </p>

              <p style="margin:0; font-size:15px; color:#374151; line-height:1.6;">
                Your BLTDIF order <strong>#${safeOrderNumber}</strong> has a new update. You can find the latest order and shipping information below.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:0 40px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; border-radius:10px; overflow:hidden; border:1px solid #e5e7eb;">
                <tr>
                  <td style="background:${BRAND_RED}; padding:14px 18px;">
                    <p style="margin:0; color:#ffffff; font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:0.8px;">
                      Current Status
                    </p>
                  </td>
                </tr>

                <tr>
                  <td style="background:#ffffff; padding:22px 18px;">
                    <p style="margin:0; font-size:26px; font-weight:800; color:#111827;">
                      ${safeOrderStatus}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          ${
            hasShippingInfo
              ? `
          <tr>
            <td style="padding:0 40px 24px;">
              <p style="margin:0 0 12px; font-size:13px; font-weight:700; color:#374151; text-transform:uppercase; letter-spacing:0.5px;">
                Shipping Details
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; border-radius:10px; overflow:hidden; border:1px solid #e5e7eb;">
                ${
                  courierName
                    ? `
                <tr>
                  <td style="width:38%; padding:14px 16px; background:#f9fafb; font-size:13px; color:#6b7280; border-bottom:1px solid #e5e7eb;">
                    Courier
                  </td>
                  <td style="padding:14px 16px; font-size:14px; color:#111827; font-weight:600; border-bottom:1px solid #e5e7eb;">
                    ${safeCourierName}
                  </td>
                </tr>
                `
                    : ""
                }

                ${
                  trackingNumber
                    ? `
                <tr>
                  <td style="width:38%; padding:14px 16px; background:#f9fafb; font-size:13px; color:#6b7280; border-bottom:1px solid #e5e7eb;">
                    Tracking Number
                  </td>
                  <td style="padding:14px 16px; font-size:14px; color:#111827; font-weight:600; border-bottom:1px solid #e5e7eb;">
                    ${safeTrackingNumber}
                  </td>
                </tr>
                `
                    : ""
                }

                ${
                  trackingUrl
                    ? `
                <tr>
                  <td colspan="2" style="padding:18px 16px; background:#ffffff;">
                    <a href="${safeTrackingUrl}" target="_blank" style="display:inline-block; background:${BRAND_RED}; color:#ffffff; text-decoration:none; font-size:14px; font-weight:700; padding:12px 18px; border-radius:8px;">
                      Track Your Order
                    </a>
                  </td>
                </tr>
                `
                    : ""
                }
              </table>
            </td>
          </tr>
          `
              : ""
          }

          ${
            adminNote
              ? `
          <tr>
            <td style="padding:0 40px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff1f3; border:1px solid #ffd1d9; border-radius:10px;">
                <tr>
                  <td style="padding:18px;">
                    <p style="margin:0 0 6px; font-size:12px; font-weight:700; color:${BRAND_RED}; text-transform:uppercase; letter-spacing:0.6px;">
                      Note From BLTDIF
                    </p>

                    <p style="margin:0; font-size:14px; color:#374151; line-height:1.6;">
                      ${safeAdminNote}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          `
              : ""
          }

          <tr>
            <td style="padding:4px 40px 34px;">
              <p style="margin:0; font-size:14px; color:#6b7280; line-height:1.6;">
                Thank you for shopping with <strong style="color:#111827;">BLTDIF</strong>. We’ll keep you updated as your order progresses.
              </p>
            </td>
          </tr>

          <tr>
            <td style="background:#111827; padding:22px 40px;">
              <p style="margin:0; color:#d1d5db; font-size:12px; line-height:1.6;">
                This is an automated order update email from BLTDIF. For support, contact us at
                <a href="mailto:support@bltdif.in" style="color:#ffffff; text-decoration:none; font-weight:600;">support@bltdif.in</a>.
              </p>
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

  if (error) {
    console.error("Resend order update email failed:", error);
    return { success: false, error };
  }

  console.log("Order update email sent:", data);
  return { success: true, data };
}