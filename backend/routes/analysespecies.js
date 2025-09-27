import express from "express";
const router = express.Router();

const speciesData = {
  "mullus_barbatus": {
    "files": {
      "otholith": ["C:\\GitHub\\CodeNerds-SIH2025\\data\\Mulbar_99_216mm_04-08-18_STATION38_MEDITS_R.png"],
      "image": ["C:\\GitHub\\CodeNerds-SIH2025\\data\\Mullus-barbatus-barbatus-2-724x449.jpg"],
      "fasta_sequence": ["C:\\GitHub\\CodeNerds-SIH2025\\data\\NR_119296.fasta"]
    },
    "description": "Mullus barbatus, commonly known as the red mullet, is a small demersal fish found in the Mediterranean Sea and eastern North Atlantic. It feeds on benthic invertebrates and is valued commercially for its meat."
  }
};

router.post('/analysespecies', (req, res) => {
  let { species } = req.body;

  if (!species) {
    return res.status(400).json({ error: "Species name is required" });
  }

  species = species.toLowerCase().replace(/\s+/g, "_");

  const data = speciesData[species] || {
    "files": {
      "Otholith": [],
      "Image": [],
      "Fasta_Sequence": []
    },
    "description": ""
  };

  res.json({ species, ...data });
});

const PORT = 3000;

export default router