const mongoose = require("mongoose");

const ClusterSchema = new mongoose.Schema({
  clusterId: {
    type: Number,
    required: true
  },
  topicName: {
    type: String,
    required: true,
    default: "Untitled Topic"
  },
  // All chunks that belong to this cluster
  chunks: [
    {
      chunkIndex: {
        type: Number,
        required: true
      },
      text: {
        type: String,
        required: true
      },
      embedding: {
        type: [Number],
        required: true
      }
    }
  ],
  // Reference to the document/quiz this cluster belongs to
  sourceDocId: {
    type: String,
    required: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 7200 // Auto-delete after 2 hours (same as Chunk collection)
  }
});

// Compound index for efficient queries
ClusterSchema.index({ sourceDocId: 1, clusterId: 1 });

const ClusterModel = mongoose.model("Cluster", ClusterSchema);

module.exports = ClusterModel;
