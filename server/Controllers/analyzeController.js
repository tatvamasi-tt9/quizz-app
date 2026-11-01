const crypto = require("crypto");
const { chunkText } = require("../utils/textChunker");
const { embedBatch } = require("../utils/geminiEmbeddings");
const { clusterChunks } = require("../utils/clustering");
const ClusterModel = require("../Models/Cluster");

/**
 * Analyze document and return cluster information with topic names
 * Route handler: POST /analyze-document
 */
const analyzeDocument = async (req, res) => {
  try {
    const { input_text } = req.body;

    if (!input_text || input_text.trim().length < 20) {
      return res.status(400).json({ error: "Input text is too short" });
    }

    // ---------- 1. CHUNKING ----------
    const chunks = chunkText(input_text, {
      chunkSize: 1000,
      overlap: 150,
      minChunkLength: 200
    });

    if (chunks.length === 0) {
      return res.status(400).json({ error: "Could not extract any content to work with" });
    }

    const docId = crypto.randomUUID();

    // ---------- 2. EMBEDDING ----------
    const embeddings = await embedBatch(chunks, "RETRIEVAL_DOCUMENT");

    const chunkRecords = chunks.map((text, i) => ({
      chunkIndex: i,
      text,
      embedding: embeddings[i]
    }));

    // ---------- 3. CLUSTERING + TOPIC NAMING ----------
    // Target number of topic clusters
    const k = Math.min(16, Math.max(8, Math.ceil(chunks.length / 10)));

    await clusterChunks(chunkRecords, k, {
      userId: req.userId,
      sourceDocId: docId
    });

    // ---------- 4. FETCH SAVED CLUSTERS FROM MONGODB ----------
    const savedClusters = await ClusterModel.find({ sourceDocId: docId }).sort({ clusterId: 1 });

    // ---------- 5. FORMAT RESPONSE ----------
    const clusterSummary = savedClusters.map((cluster) => ({
      clusterId: cluster.clusterId,
      topicName: cluster.topicName,
      chunkCount: cluster.chunks.length,
      representativeSnippet: cluster.chunks[0].text.substring(0, 150) + "..."
    }));

    return res.status(200).json({
      docId,
      clusters: clusterSummary
    });

  } catch (err) {
    console.error("Document analysis error:", err);

    if (!res.headersSent) {
      return res.status(err.status || 500).json({ error: err.message });
    }
  }
};

module.exports = { analyzeDocument };
