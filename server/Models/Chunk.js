const mongoose = require("mongoose");

/**
 * Stores the chunks + embeddings generated for one uploaded document
 * (one "docId" per /generate-questions call). This is the "vector store"
 * for the RAG pipeline - deliberately just MongoDB rather than a
 * dedicated vector DB, since a single document's chunk count (tens to a
 * few hundred) is small enough that in-app cosine similarity is fast.
 *
 * A TTL index auto-deletes chunks a couple of hours after creation so the
 * collection doesn't grow forever - they're only needed transiently while
 * a quiz is being generated (and briefly after, in case of retries).
 */
const ChunkSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true
  },
  docId: {
    type: String,
    required: true,
    index: true
  },
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
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 60 * 2 // TTL: auto-delete 2 hours after creation
  }
});

ChunkSchema.index({ docId: 1, chunkIndex: 1 });

module.exports = mongoose.model("Chunk", ChunkSchema);
