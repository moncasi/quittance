import express from "express";
import cors from "cors";
import { buildQuittancePdf } from "./quittance.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/quittance", (req, res) => {
  const data = req.body || {};

  // Validation minimale
  if (!data.bailleurNom || !data.locataireNom) {
    return res
      .status(400)
      .json({ error: "Le nom du bailleur et du locataire sont obligatoires." });
  }

  const safePeriode = String(data.periode || "quittance").replace(/[^\w-]+/g, "_");
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="quittance_${safePeriode}.pdf"`
  );

  buildQuittancePdf(data, res);
});

app.listen(PORT, () => {
  console.log(`API quittance à l'écoute sur http://localhost:${PORT}`);
});
