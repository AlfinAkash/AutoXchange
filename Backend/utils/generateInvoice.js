const PDFDocument = require('pdfkit');
const axios = require('axios');

const formatCurrency = (value) => {
  if (typeof value !== 'number') return 'N/A';
  return `Rs. ${value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
};

// Helper function to add footer at fixed position without line breaks
function addFooter(doc) {
  const pageWidth = doc.page.width;
  const pageHeight = doc.page.height;
  const marginRight = doc.page.margins.right || 40;
  const marginBottom = 40; // space from bottom edge

  doc.font('Helvetica').fontSize(9).fillColor('gray');

  const footerText = 'Mavepizon Technologies, Pollachi | Phone: 9344019009';

  // Measure text width to align it correctly at right margin
  const textWidth = doc.widthOfString(footerText);

  // x position to start text so it ends at pageWidth - marginRight
  const x = pageWidth - marginRight - textWidth;
  const y = pageHeight - marginBottom;

  doc.text(footerText, x, y, {
    lineBreak: false,
  });
}



const generateInvoice = async (sale, purchase, res) => {
  try {
    const doc = new PDFDocument({ size: 'A4', margin: 40 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename=invoice-${sale._id}.pdf`);
    doc.pipe(res);

    // --- ADD LOGO ---
    const logoUrl = "https://i.ibb.co/Wvz3d8Nm/Screenshot-2025-08-09-150231.png";
    try {
      const response = await axios.get(logoUrl, { responseType: 'arraybuffer' });
      const imageBuffer = Buffer.from(response.data);
      doc.image(imageBuffer, doc.page.width - 120, 40, { width: 80, height: 80 });
    } catch (err) {
      console.warn('Logo fetch failed:', err.message);
    }

    const pageWidth = doc.page.width;

    // --- HEADER ---
    doc.font('Helvetica-Bold').fontSize(20).fillColor('#004080')
      .text('Invoice', 0, 20, { width: pageWidth, align: 'center' });

    doc.font('Helvetica-Bold').fontSize(22).fillColor('#004080')
      .text('AutoXchange', 40, 60);

    doc.font('Helvetica').fontSize(10).fillColor('#000')
      .text('35/1, Raja Mill, Near ATSC Theatre,', 40, 90)
      .text('Municipal Office Road, Bazaar-642001', 40, 104);

    doc.font('Helvetica-Bold').fontSize(10).fillColor('#000')
      .text('GSTIN : 33AGCPN7565M1ZY', 40, 120);

    // --- BUYER & VEHICLE DETAILS ---
    const sectionTop = 140;
    doc.rect(40, sectionTop, doc.page.width - 80, 26).fill('#004080');
    doc.font('Helvetica-Bold').fontSize(13).fillColor('white')
      .text('Buyer & Vehicle Details', 55, sectionTop + 7);
    doc.fillColor('#000');

    const colLabels = 55, colValues = 140, rightColLabels = 315, rightColValues = 400;
    const startY = sectionTop + 38, rowH = 18;

    const detailsLeft = [
      ['Buyer Name', sale.buyerName],
      ['Aadhar No', sale.aadharNumber],
      ['Phone', sale.phone],
      ['Address Proof', sale.addressProof],
    ];

    const detailsRight = [
      ['Vehicle No', sale.vehicleNumber],
      ['Sale Date', sale.saleDate ? new Date(sale.saleDate).toLocaleDateString('en-IN') : 'N/A'],
      ['Model', purchase?.model || 'N/A'],
      ['Brand', purchase?.brand || 'N/A'],
    ];

    detailsLeft.forEach(([label, value], i) => {
      doc.font('Helvetica-Bold').fontSize(11)
        .text(label + ':', colLabels, startY + i * rowH, { width: 85 });
      doc.font('Helvetica').fontSize(11)
        .text(value || 'N/A', colValues, startY + i * rowH, { width: 160 });
    });

   detailsRight.forEach(([label, value], i) => {
  doc.font('Helvetica-Bold').fontSize(11)
    .text(label + ':', rightColLabels, startY + i * rowH, { width: 85, align: 'right' });
  doc.font('Helvetica').fontSize(11)
    .text(value || 'N/A', rightColValues, startY + i * rowH, { width: 160, align: 'left' });
});

    // --- SALE DETAILS TABLE ---
    const tableY = startY + Math.max(detailsLeft.length, detailsRight.length) * rowH + 20;
    const colSpaces = [55, 320, 460];
    const colWidths = [245, 130, 90];

    doc.rect(40, tableY, doc.page.width - 80, 21).fill('#004080');
    doc.fillColor('white').font('Helvetica-Bold').fontSize(11)
      .text('Description', colSpaces[0], tableY + 5, { width: colWidths[0] })
      .text('Value', colSpaces[1], tableY + 5, { width: colWidths[1], align: 'center' })
      .text('Amount', colSpaces[2], tableY + 5, { width: colWidths[2], align: 'right' });

    let rowY = tableY + 21;
    const fields = [
      ['Selling Amount', '-', formatCurrency(sale.sellingAmount)],
      ['Advance Amount', '-', formatCurrency(sale.advanceAmount)],
      ['Finance Amount', '-', formatCurrency(sale.financeAmount)],
      ['Finance Name', sale.finance ? (sale.financeName || 'N/A') : 'No Finance', '-'],
      ['Battery Brand', sale.batteryBrand || 'N/A', '-'],
      ['Tyre Brand', sale.tyreBrand || 'N/A', '-'],
    ];
    fields.forEach((field, idx) => {
      doc.rect(40, rowY, doc.page.width - 80, 18)
        .fill(idx % 2 === 0 ? '#f4f7fa' : '#fff');
      doc.fillColor('#000').font('Helvetica').fontSize(10)
        .text(field[0], colSpaces[0], rowY + 5, { width: colWidths[0] })
        .text(field[1], colSpaces[1], rowY + 5, { width: colWidths[1], align: 'center' })
        .text(field[2], colSpaces[2], rowY + 5, { width: colWidths[2], align: 'right' });
      rowY += 18;
    });

    // Add footer after finishing page content
    addFooter(doc);

    doc.end();

  } catch (err) {
    console.error('Error generating invoice:', err);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Error generating invoice' });
    }
  }
};

module.exports = generateInvoice;
