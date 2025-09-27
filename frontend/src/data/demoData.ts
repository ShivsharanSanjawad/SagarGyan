// demoData.ts — hardcoded demo results for two otolith vouchers
export const demoOtoliths: Record<string, any> = {
  "CMLREOTL00026.jpg": {
    otolithId: "CMLRE/OTL/00026",
    metadata: {
      scientificName: "Ostracoberx dorygenys",
      submittedBy: "Aneesh Kumar KV, CMLRE",
      platform: "Sagar Sampada",
      stationId: "SS34904",
      locality: "Off South Andaman",
      collectionDate: "2016-04-06",
      decimalLatitude: 9.625483333,
      decimalLongitude: 92.73631667,
      collectionDepth_m: 362,
      stationDepth_m: 362,
      collectionMethod: "Deep sea trawling",
      lifeStage: "Adult",
      sex: "Not Known",
      habitat: "Nektonic",
      source: "CMLRE / IndOBIS",
      license: "Refer to IndOBIS record URL",
    },
    image: {
      filename: "CMLREOTL00026.jpg",
      previewUrl: "/CMLREOTL00026.jpg",
    },
    morphometrics: {
      length_mm: 2.35,
      width_mm: 1.75,
      area_mm2: 3.2,
      circularity: 0.68,
      notes: "Demo/calibrated to scale bar for presentation",
    },
    hierarchy: [
      { rank: "Superclass", name: "Osteichthyes", conditional: 0.995, cumulative: 0.995, score: 995 },
      { rank: "Phylum", name: "Chordata", conditional: 0.999, cumulative: 0.994, score: 994 },
      { rank: "Class", name: "Actinopteri", conditional: 0.987, cumulative: 0.981, score: 981 },
      { rank: "Order", name: "Perciformes", conditional: 0.96, cumulative: 0.942, score: 942 },
      { rank: "Family", name: "Mugilidae", conditional: 0.945, cumulative: 0.893, score: 893 },
      { rank: "Genus", name: "Ostracoberx", conditional: 0.91, cumulative: 0.812, score: 812 },
      { rank: "Species", name: "Ostracoberx dorygenys", conditional: 0.9, cumulative: 0.731, score: 731 },
    ],
    provenance: {
      dwcaUrl: "https://indobis.in/otodetails/?otolithID=CMLRE/OTL/00026",
      voucherUrl: "https://indobis.in/otodetails/?otolithID=CMLRE/OTL/00026",
    },
    interpretation: {
      topCall: "Ostracoberx dorygenys",
      topScore: 731,
    },
  },

  "CMLREOTL00018.jpg": {
    otolithId: "CMLRE/OTL/00018",
    metadata: {
      scientificName: "Nemipterus japonicus",
      submittedBy: "Aneesh Kumar KV, CMLRE",
      platform: "Sagar Sampada",
      stationId: "SS37208",
      locality: "Off Allapuzha",
      collectionDate: "2018-03-04",
      decimalLatitude: 9.39485,
      decimalLongitude: 75.91491667,
      collectionDepth_m: 87,
      stationDepth_m: 87,
      collectionMethod: "Deep sea trawling",
      lifeStage: "Adult",
      sex: "Not Known",
      habitat: "Nektonic",
      source: "CMLRE / IndOBIS",
      license: "Refer to IndOBIS record URL",
    },
    image: {
      filename: "CMLREOTL00018.jpg",
      previewUrl: "/CMLREOTL00018.jpg",
    },
    morphometrics: {
      length_mm: 2.1,
      width_mm: 1.6,
      area_mm2: 2.9,
      circularity: 0.71,
      notes: "Demo/calibrated to scale bar for presentation",
    },
    hierarchy: [
      { rank: "Superclass", name: "Osteichthyes", conditional: 0.992, cumulative: 0.992, score: 992 },
      { rank: "Phylum", name: "Chordata", conditional: 0.998, cumulative: 0.990, score: 990 },
      { rank: "Class", name: "Actinopteri", conditional: 0.982, cumulative: 0.972, score: 972 },
      { rank: "Order", name: "Perciformes", conditional: 0.955, cumulative: 0.929, score: 929 },
      { rank: "Family", name: "Nemipteridae", conditional: 0.94, cumulative: 0.873, score: 873 },
      { rank: "Genus", name: "Nemipterus", conditional: 0.92, cumulative: 0.803, score: 803 },
      { rank: "Species", name: "Nemipterus japonicus", conditional: 0.89, cumulative: 0.714, score: 714 },
    ],
    provenance: {
      dwcaUrl: "https://indobis.in/otodetails/?otolithID=CMLRE/OTL/00018",
      voucherUrl: "https://indobis.in/otodetails/?otolithID=CMLRE/OTL/00018",
    },
    interpretation: {
      topCall: "Nemipterus japonicus",
      topScore: 714,
    },
  },
}

export default demoOtoliths
