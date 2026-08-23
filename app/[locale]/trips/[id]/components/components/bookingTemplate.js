// مهم: القالب لازم يكون نص داخل backticks
export const bookingTemplateSource = String.raw`
<div style="background:#f9f9f9;border-radius:12px;padding:16px;font-family:sans-serif;color:#333;line-height:1.6;">
  <h3 style="margin-bottom:12px;">🧾 Booking Summary</h3>
  <p style="margin:6px 0;">🏷️ <strong>Tour:</strong> {{tourName}}</p>
  <p style="margin:6px 0;">👤 <strong>Adults:</strong> {{participants}} &nbsp;&nbsp; 👶 <strong>Children:</strong> {{childrenCount}}</p>
  <p style="margin:6px 0;">📅 <strong>Check-in:</strong> {{checkIn}}</p>
  <p style="margin:6px 0;">📅 <strong>Check-out:</strong> {{checkOut}}</p>
  <p style="margin:6px 0;">💵 <strong>Price per adult:</strong> ${{checkInPrice}}</p>
  <p style="margin:6px 0;">💰 <strong>Total:</strong> ${{total}}</p>
  <hr style="border:none;border-top:1px solid #ddd;margin:12px 0;" />
  <p style="margin-top:8px;">✅ Please confirm availability and assist the guest.</p>
</div>
`;
