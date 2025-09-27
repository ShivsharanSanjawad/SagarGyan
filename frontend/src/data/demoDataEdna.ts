// data/demoDataEdna.ts
// Demo eDNA results (hardcoded)

const demoDataEdna: Record<string, any> = {
  demo_edna_fasta: {
    sampleId: "EDNA_DEMO_001",
    markerGene: "16S rRNA",
    query: {
      accession: "NR_119296.1",
      length: 1450,
      description: "Bartonella bacilliformis strain ATCC 35685 16S ribosomal RNA, partial sequence",
      fastaSnippet: `>NR_119296.1 Bartonella bacilliformis strain ATCC 35685 16S ribosomal RNA, partial sequence
AACGAACGCTGGCGGCAGGCTTAACACATGCAAGTCGAGCGCACTCTTTTTGAGTGAGCGGCAGACGGGTGAGTAACGCG
TGGGAATCTACCCATCTCTACGGAATAACACAGAGAAATTTGTGCTAATACCGTATNCNTCCTTCGGGAGAAAGATTTAT
CGGAGATGGATGAGCCCGCGTTGGATTAGCTAGTTGGTGAGGTAACGGCCCACCAAGGCGACGATCCATAGCTGGTCTGA
... (truncated for demo) ...`,
    },
    topHit: {
      accession: "NR_119296.1",
      species: "Bartonella bacilliformis",
      description: "strain ATCC 35685",
      identityPct: 99.2,
      evalue: 1e-80,
      score: 1450,
    },
    hits: [
      {
        accession: "NR_119296.1",
        species: "Bartonella bacilliformis",
        identityPct: 99.2,
        evalue: 1e-80,
        score: 1450,
      },
      {
        accession: "PR2_001",
        species: "Bartonella sp. (PR2 ref)",
        identityPct: 97.5,
        evalue: 2e-70,
        score: 1330,
      },
      {
        accession: "GBIF_87654",
        species: "Bartonella bacilliformis (GBIF ref)",
        identityPct: 96.8,
        evalue: 4e-68,
        score: 1302,
      },
    ],
    stats: {
      totalReads: 50000,
      assignedReads: 48650,
      unassignedReads: 1350,
      runtimeSec: 12.4,
    },
    links: {
      ncbi: "https://www.ncbi.nlm.nih.gov/nuccore/NR_119296.1",
      pr2: "https://pr2-database.org/",
      gbif: "https://www.gbif.org/species/87654",
    },
    visualization: {
      pieChart: [
        { taxon: "Bartonella bacilliformis", pct: 85 },
        { taxon: "Unassigned", pct: 15 },
      ],
    },
  },
}

export default demoDataEdna
