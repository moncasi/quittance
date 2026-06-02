import { useState } from "react";

const champsInitiaux = {
  bailleurNom: "",
  bailleurAdresse: "",
  locataireNom: "",
  logementAdresse: "",
  loyer: "",
  charges: "",
  periode: "",
  lieu: "",
  date: new Date().toLocaleDateString("fr-FR"),
};

export default function App() {
  const [form, setForm] = useState(champsInitiaux);
  const [erreur, setErreur] = useState("");
  const [chargement, setChargement] = useState(false);

  const maj = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const total =
    (parseFloat(form.loyer) || 0) + (parseFloat(form.charges) || 0);

  const generer = async (e) => {
    e.preventDefault();
    setErreur("");

    if (!form.bailleurNom || !form.locataireNom) {
      setErreur("Le nom du bailleur et du locataire sont obligatoires.");
      return;
    }

    setChargement(true);
    try {
      const res = await fetch("/api/quittance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Erreur lors de la génération.");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `quittance_${form.periode || "loyer"}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setErreur(err.message);
    } finally {
      setChargement(false);
    }
  };

  return (
    <main className="container">
      <h1>Quittance de loyer</h1>
      <p className="sous-titre">
        Remplissez le formulaire pour générer une quittance au format PDF.
      </p>

      <form onSubmit={generer}>
        <fieldset>
          <legend>Bailleur</legend>
          <label>
            Nom du bailleur *
            <input name="bailleurNom" value={form.bailleurNom} onChange={maj} />
          </label>
          <label>
            Adresse du bailleur
            <input
              name="bailleurAdresse"
              value={form.bailleurAdresse}
              onChange={maj}
            />
          </label>
        </fieldset>

        <fieldset>
          <legend>Locataire</legend>
          <label>
            Nom du locataire *
            <input
              name="locataireNom"
              value={form.locataireNom}
              onChange={maj}
            />
          </label>
        </fieldset>

        <fieldset>
          <legend>Logement</legend>
          <label>
            Adresse du logement loué
            <input
              name="logementAdresse"
              value={form.logementAdresse}
              onChange={maj}
            />
          </label>
        </fieldset>

        <fieldset>
          <legend>Montants &amp; période</legend>
          <div className="ligne">
            <label>
              Loyer (€)
              <input
                name="loyer"
                type="number"
                min="0"
                step="0.01"
                value={form.loyer}
                onChange={maj}
              />
            </label>
            <label>
              Charges (€)
              <input
                name="charges"
                type="number"
                min="0"
                step="0.01"
                value={form.charges}
                onChange={maj}
              />
            </label>
          </div>
          <p className="total">Total : {total.toFixed(2)} €</p>
          <label>
            Période (ex : Janvier 2026)
            <input name="periode" value={form.periode} onChange={maj} />
          </label>
        </fieldset>

        <fieldset>
          <legend>Lieu &amp; date</legend>
          <div className="ligne">
            <label>
              Fait à
              <input name="lieu" value={form.lieu} onChange={maj} />
            </label>
            <label>
              Date
              <input name="date" value={form.date} onChange={maj} />
            </label>
          </div>
        </fieldset>

        {erreur && <p className="erreur">{erreur}</p>}

        <button type="submit" disabled={chargement}>
          {chargement ? "Génération…" : "Générer la quittance"}
        </button>
      </form>
    </main>
  );
}
