import PDFDocument from "pdfkit";

const EUR = (n) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
    Number(n) || 0
  );

/**
 * Génère le PDF d'une quittance de loyer et l'écrit dans le flux fourni.
 * @param {object} data - données de la quittance
 * @param {NodeJS.WritableStream} stream - flux de sortie (réponse HTTP)
 */
export function buildQuittancePdf(data, stream) {
  const {
    bailleurNom = "",
    bailleurAdresse = "",
    locataireNom = "",
    logementAdresse = "",
    loyer = 0,
    charges = 0,
    periode = "",
    lieu = "",
    date = "",
  } = data;

  const total = (Number(loyer) || 0) + (Number(charges) || 0);

  const doc = new PDFDocument({ size: "A4", margin: 56 });
  doc.pipe(stream);

  // En-tête
  doc.fontSize(20).font("Helvetica-Bold").text("QUITTANCE DE LOYER", { align: "center" });
  doc.moveDown(0.5);
  if (periode) {
    doc.fontSize(12).font("Helvetica").text(`Période : ${periode}`, { align: "center" });
  }
  doc.moveDown(1.5);

  // Bailleur
  doc.fontSize(11).font("Helvetica-Bold").text("Bailleur");
  doc.font("Helvetica").text(bailleurNom);
  if (bailleurAdresse) doc.text(bailleurAdresse);
  doc.moveDown(1);

  // Locataire
  doc.font("Helvetica-Bold").text("Locataire");
  doc.font("Helvetica").text(locataireNom);
  doc.moveDown(1);

  // Logement
  doc.font("Helvetica-Bold").text("Logement loué");
  doc.font("Helvetica").text(logementAdresse);
  doc.moveDown(1.5);

  // Corps
  doc
    .font("Helvetica")
    .text(
      `Je soussigné(e) ${bailleurNom || "—"}, bailleur du logement désigné ci-dessus, ` +
        `déclare avoir reçu de ${locataireNom || "—"}, locataire, la somme de ` +
        `${EUR(total)} au titre du loyer et des charges pour la période : ${periode || "—"}.`,
      { align: "justify" }
    );
  doc.moveDown(1);

  // Détail
  const detailY = doc.y;
  doc.font("Helvetica-Bold").text("Détail :", 56, detailY);
  doc.font("Helvetica");
  doc.text(`Loyer : ${EUR(loyer)}`, 80);
  doc.text(`Charges : ${EUR(charges)}`, 80);
  doc.font("Helvetica-Bold").text(`Total payé : ${EUR(total)}`, 80);
  doc.moveDown(2);

  // Mention
  doc
    .font("Helvetica")
    .fontSize(10)
    .text(
      "Cette quittance annule tous les reçus qui auraient pu être établis " +
        "antérieurement en cas de paiement partiel du montant du présent terme. " +
        "Elle est à conserver pendant trois ans par le locataire.",
      { align: "justify" }
    );
  doc.moveDown(3);

  // Lieu / date / signature
  doc.fontSize(11).text(`Fait à ${lieu || "—"}, le ${date || "—"}`, { align: "right" });
  doc.moveDown(2);
  doc.text("Signature du bailleur :", { align: "right" });

  doc.end();
}
