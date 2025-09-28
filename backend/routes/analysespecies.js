import express from "express";
const router = express.Router();

const speciesData = {
  "scomberomorus guttatus": {
    "files": {
      "otholith": ["C:\\GitHub\\CodeNerds-SIH2025\\data\\Comgut_99_216mm_04-08-18_STATION38_MEDITS_R.png"],
      "image": ["C:\\GitHub\\CodeNerds-SIH2025\\data\\Indian_Kingfish.jpg"],
      "fasta_sequence": ["C:\\GitHub\\CodeNerds-SIH2025\\data\\GCA_038419695.1.fasta"]
    },
    "description": "The Indian king mackerel (Scomberomorus guttatus) is a large, fast-swimming predatory fish found in the warm coastal waters of the Indian Ocean and western Pacific. It has a long, streamlined silvery body with bluish-green back and distinctive wavy vertical bands. Highly prized as seafood across South Asia, it is known as Surmai in India and is valued both commercially and recreationally."
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