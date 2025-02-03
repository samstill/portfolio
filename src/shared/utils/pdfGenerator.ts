import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Ticket } from '../../domain/entities/Ticket';

const createTicketPDF = async (ticket: Ticket): Promise<Blob> => {
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '-9999px';
  container.style.width = '595px'; // A4 width in pixels at 72 DPI

  container.innerHTML = `
    <div style="
      font-family: 'Helvetica', Arial, sans-serif;
      padding: 40px;
      background: white;
      color: #333;
      position: relative;
      line-height: 1.6;
    ">
      <!-- Header with Logo Area -->
      <div style="
        text-align: center;
        margin-bottom: 30px;
        padding-bottom: 20px;
        border-bottom: 2px solid #f0f0f0;
      ">
        <div style="
          font-size: 28px;
          font-weight: bold;
          color: #1a1a1a;
          margin-bottom: 5px;
        ">E-TICKET</div>
        <div style="color: #666; font-size: 14px;">harshitpadha.me</div>
      </div>

      <!-- Event Title -->
      <div style="
        text-align: center;
        margin-bottom: 30px;
      ">
        <h1 style="
          font-size: 24px;
          color: #1a1a1a;
          margin: 0;
          font-weight: 600;
        ">${ticket.eventDetails.title}</h1>
      </div>

      <!-- Main Content Grid -->
      <div style="
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 40px;
        margin-bottom: 30px;
      ">
        <!-- Left Column - Event Details -->
        <div>
          <div style="margin-bottom: 20px;">
            <div style="font-size: 12px; color: #666; margin-bottom: 4px;">DATE & TIME</div>
            <div style="font-size: 16px;">${new Date(ticket.eventDetails.date).toLocaleString()}</div>
          </div>

          <div style="margin-bottom: 20px;">
            <div style="font-size: 12px; color: #666; margin-bottom: 4px;">LOCATION</div>
            <div style="font-size: 16px;">${ticket.eventDetails.location}</div>
          </div>

          <div style="margin-bottom: 20px;">
            <div style="font-size: 12px; color: #666; margin-bottom: 4px;">TICKET NUMBER</div>
            <div style="font-size: 16px; font-family: monospace;">${ticket.ticketNumber}</div>
          </div>

          <div style="margin-bottom: 20px;">
            <div style="font-size: 12px; color: #666; margin-bottom: 4px;">VALIDATIONS</div>
            <div style="font-size: 16px;">
              <span style="color: #4a6cf7; font-weight: bold;">${ticket.validationsRemaining}</span> remaining of ${ticket.quantity} total
            </div>
          </div>

          <div style="margin-bottom: 20px;">
            <div style="font-size: 12px; color: #666; margin-bottom: 4px;">STATUS</div>
            <div style="
              display: inline-block;
              padding: 4px 12px;
              border-radius: 12px;
              font-size: 14px;
              background: ${ticket.status === 'valid' ? '#e8f5e9' : '#ffebee'};
              color: ${ticket.status === 'valid' ? '#2e7d32' : '#c62828'};
            ">${ticket.status.toUpperCase()}</div>
          </div>
        </div>

        <!-- Right Column - QR Code -->
        <div style="
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        ">
          <div style="
            background: white;
            padding: 15px;
            border-radius: 12px;
            box-shadow: 0 2px 12px rgba(0,0,0,0.1);
          ">
            <img src="${ticket.qrCode}" style="width: 180px; height: 180px;" />
          </div>
          <div style="
            margin-top: 10px;
            font-size: 12px;
            color: #666;
            text-align: center;
          ">Scan to verify ticket</div>
        </div>
      </div>

      <!-- Purchase Information -->
      <div style="
        margin-bottom: 30px;
        padding: 20px;
        background: #f8f9fa;
        border-radius: 12px;
      ">
        <div style="font-size: 14px; color: #666; margin-bottom: 10px;">PURCHASE INFORMATION</div>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; font-size: 14px;">
          <div>
            <div style="color: #666;">Purchase Date</div>
            <div>${new Date(ticket.purchasedAt).toLocaleString()}</div>
          </div>
          <div>
            <div style="color: #666;">Transaction ID</div>
            <div style="font-family: monospace;">${ticket.transactionId}</div>
          </div>
          <div>
            <div style="color: #666;">Amount Paid</div>
            <div>₹${ticket.amountPaid}</div>
          </div>
          <div>
            <div style="color: #666;">Payment Mode</div>
            <div>${ticket.paymentMode}</div>
          </div>
        </div>
      </div>

      <!-- Refund Policy -->
      <div style="
        font-size: 12px;
        color: #666;
        padding: 20px;
        background: #f8f9fa;
        border-radius: 12px;
        margin-bottom: 20px;
      ">
        <div style="font-weight: bold; margin-bottom: 10px; color: #333;">Refund Policy</div>
        <ul style="
          margin: 0;
          padding-left: 20px;
          list-style-type: disc;
        ">
          <li>Full refund available up to 24 hours before the event</li>
          <li>50% refund available between 24 hours and 12 hours before the event</li>
          <li>No refunds available within 12 hours of the event</li>
          <li>Refund requests must be submitted through the platform</li>
          <li>Processing time for refunds: 5-7 business days</li>
        </ul>
      </div>

      <!-- Footer -->
      <div style="
        margin-top: 30px;
        padding-top: 20px;
        border-top: 2px solid #f0f0f0;
        text-align: center;
        font-size: 12px;
        color: #666;
      ">
        <div style="margin-bottom: 5px;">Generated on ${new Date().toLocaleString()}</div>
        <div>This is an electronically generated document. No signature required.</div>
        <div style="margin-top: 10px;">
          For support: support@harshitpadha.me | www.harshitpadha.me
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      logging: false,
      useCORS: true,
      backgroundColor: '#ffffff'
    });

    const pdf = new jsPDF({
      format: 'a4',
      unit: 'px'
    });

    const imgData = canvas.toDataURL('image/png');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

    return pdf.output('blob');
  } finally {
    document.body.removeChild(container);
  }
};

export default createTicketPDF; 