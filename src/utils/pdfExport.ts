import { jsPDF } from 'jspdf';
import { Trip, WeightUnit } from '../types/travel';

export function exportTripToPDF(trip: Trip, weightUnit: WeightUnit = 'LBS') {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  let y = margin;

  // Helper for adding new page with header/footer
  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - 18) {
      doc.addPage();
      y = margin + 6;
      drawSubHeader();
    }
  };

  const drawSubHeader = () => {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(140, 140, 150);
    doc.text(`Gate Ready Packing Checklist — ${trip.name}`, margin, y - 2);
    doc.setDrawColor(230, 230, 240);
    doc.setLineWidth(0.3);
    doc.line(margin, y, margin + contentWidth, y);
    y += 6;
  };

  // --- TOP BANNER (Purple Brand Header) ---
  doc.setFillColor(109, 40, 217); // #6d28d9 deep purple
  doc.roundedRect(margin, y, contentWidth, 26, 3, 3, 'F');

  // App Title & Logo text
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text('GATE READY', margin + 6, y + 9);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(233, 213, 255);
  doc.text('Smart Travel Packing & Baggage Guide', margin + 6, y + 15);

  // Pro badge in top right
  doc.setFillColor(245, 158, 11); // Amber
  doc.roundedRect(margin + contentWidth - 36, y + 6, 30, 6, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text('PRO PACKING LIST', margin + contentWidth - 34, y + 10.2);

  // Export date
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(216, 180, 254);
  const dateStr = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  doc.text(`Exported: ${dateStr}`, margin + contentWidth - 36, y + 19);

  y += 32;

  // --- TRIP DETAILS CARD ---
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, y, contentWidth, 22, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(30, 41, 59);
  doc.text(trip.name, margin + 4, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);

  const travelDetail = [
    `Mode: ${trip.travelType}`,
    trip.companyName ? `Carrier: ${trip.companyName}` : '',
    trip.departureDate ? `Departure: ${trip.departureDate}${trip.departureTime ? ` at ${trip.departureTime}` : ''}` : '',
    `Bags: ${trip.bags.length}`
  ].filter(Boolean).join('   |   ');

  doc.text(travelDetail, margin + 4, y + 12);

  if (trip.familyMembers && trip.familyMembers.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.text('Travelers: ', margin + 4, y + 17.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(trip.familyMembers.join(', '), margin + 22, y + 17.5);
  }

  y += 28;

  // Overall Statistics Bar
  const totalItems = trip.bags.reduce((acc, b) => acc + b.items.length, 0);
  const packedItems = trip.bags.reduce(
    (acc, b) => acc + b.items.filter((i) => i.isPacked).length,
    0
  );
  const pct = totalItems > 0 ? Math.round((packedItems / totalItems) * 100) : 0;

  doc.setFillColor(243, 232, 255);
  doc.roundedRect(margin, y, contentWidth, 9, 1.5, 1.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(109, 40, 217);
  doc.text(
    `Pack Progress: ${packedItems} of ${totalItems} items packed (${pct}%) across ${trip.bags.length} bags`,
    margin + 4,
    y + 6
  );

  y += 14;

  // --- BAGGAGE SECTIONS ---
  trip.bags.forEach((bag, bagIdx) => {
    checkPageBreak(25);

    // Bag Header Box
    const bagTypeLabel =
      bag.type === 'PERSONAL'
        ? 'Personal Item'
        : bag.type === 'CARRY_ON'
        ? 'Carry-On Bag'
        : 'Checked Bag';

    doc.setFillColor(237, 233, 254); // Light purple fill
    doc.setDrawColor(196, 181, 253);
    doc.roundedRect(margin, y, contentWidth, 8, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(76, 29, 149);
    doc.text(
      `Bag #${bagIdx + 1}: ${bag.label} (${bagTypeLabel})`,
      margin + 3,
      y + 5.5
    );

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(109, 40, 217);
    const assignedStr = bag.assignedTo ? `Assigned to: ${bag.assignedTo}` : '';
    const weightStr = bag.maxWeightLimitLbs ? `Limit: ${bag.maxWeightLimitLbs} ${weightUnit}` : '';
    const metaStr = [assignedStr, weightStr].filter(Boolean).join('  •  ');
    doc.text(metaStr, margin + contentWidth - 3, y + 5.5, { align: 'right' });

    y += 11;

    // Items Table Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text('STATUS', margin + 3, y);
    doc.text('ITEM NAME', margin + 20, y);
    doc.text('QTY', margin + 90, y);
    doc.text('LOCATION / POUCH', margin + 105, y);
    doc.text('PACKED FOR', margin + 145, y);

    y += 2.5;
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.2);
    doc.line(margin, y, margin + contentWidth, y);
    y += 4;

    if (bag.items.length === 0) {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text('No items currently added to this bag.', margin + 20, y + 1);
      y += 8;
    } else {
      bag.items.forEach((item) => {
        checkPageBreak(8);

        // Checkbox square
        doc.setDrawColor(148, 163, 184);
        doc.setLineWidth(0.3);
        doc.rect(margin + 4, y - 3, 3.5, 3.5);

        if (item.isPacked) {
          doc.setFillColor(16, 185, 129); // green check
          doc.rect(margin + 4.5, y - 2.5, 2.5, 2.5, 'F');
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(6.5);
          doc.setTextColor(255, 255, 255);
        }

        // Item Name
        doc.setFont('helvetica', item.isPacked ? 'normal' : 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(item.isPacked ? 100 : 30, item.isPacked ? 116 : 41, item.isPacked ? 139 : 59);
        doc.text(item.name, margin + 20, y);

        // Quantity
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(71, 85, 105);
        doc.text(`x${item.quantity}`, margin + 90, y);

        // Location
        doc.text(item.location || '—', margin + 105, y);

        // Packed For
        doc.text(item.packedFor || '—', margin + 145, y);

        y += 6;
      });
    }

    y += 5;
  });

  // --- PRE-TRIP & DAY-OF REMINDERS SECTION ---
  if (trip.departureReminders && trip.departureReminders.length > 0) {
    checkPageBreak(30);

    doc.setFillColor(254, 243, 199); // Light amber
    doc.setDrawColor(251, 191, 36);
    doc.roundedRect(margin, y, contentWidth, 8, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(146, 64, 14);
    doc.text('Smart Departure & Day-of Travel Reminders', margin + 3, y + 5.5);

    y += 12;

    trip.departureReminders.forEach((rem) => {
      checkPageBreak(7);

      // Checkbox
      doc.setDrawColor(180, 83, 9);
      doc.setLineWidth(0.3);
      doc.rect(margin + 4, y - 3, 3.5, 3.5);

      if (rem.completed) {
        doc.setFillColor(245, 158, 11);
        doc.rect(margin + 4.5, y - 2.5, 2.5, 2.5, 'F');
      }

      // Tag
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(rem.category === 'DAY_OF' ? 220 : 120, rem.category === 'DAY_OF' ? 38 : 53, rem.category === 'DAY_OF' ? 38 : 140);
      doc.text(rem.category === 'DAY_OF' ? '[DAY OF]' : '[PRE-TRIP]', margin + 12, y);

      // Title
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(30, 41, 59);
      doc.text(rem.title, margin + 30, y);

      y += 6;
    });

    y += 5;
  }

  // --- GATE READY CHECKLIST SECTION ---
  if (trip.gateChecklist && trip.gateChecklist.length > 0) {
    checkPageBreak(25);

    doc.setFillColor(241, 245, 249);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(margin, y, contentWidth, 8, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    doc.text('Gate Ready Pre-Departure Checklist', margin + 3, y + 5.5);

    y += 12;

    trip.gateChecklist.forEach((chk) => {
      checkPageBreak(7);

      doc.setDrawColor(100, 116, 139);
      doc.setLineWidth(0.3);
      doc.rect(margin + 4, y - 3, 3.5, 3.5);

      if (chk.completed) {
        doc.setFillColor(16, 185, 129);
        doc.rect(margin + 4.5, y - 2.5, 2.5, 2.5, 'F');
      }

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(30, 41, 59);
      doc.text(chk.text, margin + 14, y);

      y += 6;
    });
  }

  // --- PAGE NUMBERS FOOTER ---
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.5);
    doc.setTextColor(156, 163, 175);
    doc.text(
      `Gate Ready Travel Companion  •  Page ${i} of ${pageCount}`,
      pageWidth / 2,
      pageHeight - 8,
      { align: 'center' }
    );
  }

  // Save the PDF
  const safeFilename = `${trip.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-packing-list.pdf`;
  doc.save(safeFilename);
}
