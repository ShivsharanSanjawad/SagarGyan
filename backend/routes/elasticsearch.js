import express from "express";
import { Client } from "@elastic/elasticsearch";

const router = express.Router();

// Elasticsearch client
const esClient = new Client({
  node: process.env.ELASTIC_NODE,
  auth: {
    username: process.env.ELASTIC_USER,
    password: process.env.ELASTIC_PASSWORD,
  },
  tls: { rejectUnauthorized: false },
});

// Health check
router.get("/elasticsearch/health", async (req, res) => {
  try {
    const health = await esClient.cluster.health();
    res.json(health);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Search endpoint (all indexes, all fields, keyword-aware)
router.get("/elasticsearch", async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: "Query parameter 'q' is required" });

  try {
    const result = await esClient.search({
      index: "*", // search all indexes
      query: {
        bool: {
          should: [
            {
              multi_match: {
                query: q,
                fields: ["*"],       // search all fields
                type: "best_fields",
                operator: "or",      // allow partial matches
                minimum_should_match: "50%" // 50% of keywords must match
              },
            },
            {
              match_phrase: {
                description: { query: q, boost: 2 } // exact phrase boost
              }
            }
          ]
        }
      }
    });

    res.json(result.hits.hits.map(hit => hit._source));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
