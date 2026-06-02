import { buildQuittancePdf } from "./quittance.js";
import { createWriteStream, statSync, unlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const out = join(tmpdir(), `quittance-test-${Date.now()}.pdf`);
const stream = createWriteStream(out);

stream.on("finish", () => {
  const size = statSync(out).size;
  unlinkSync(out);
  if (size < 500) {
    console.error(`Échec : PDF trop petit (${size} octets)`);
    process.exit(1);
  }
  console.log(`OK : PDF généré (${size} octets)`);
});

buildQuittancePdf(
  {
    bailleurNom: "Jean Dupont",
    bailleurAdresse: "1 rue de Paris, 75001 Paris",
    locataireNom: "Marie Martin",
    logementAdresse: "5 av. des Fleurs, 75002 Paris",
    loyer: 800,
    charges: 50,
    periode: "Janvier 2026",
    lieu: "Paris",
    date: "31/01/2026",
  },
  stream
);
