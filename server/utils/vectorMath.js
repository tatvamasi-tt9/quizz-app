/**
 * vectorMath.js
 * -----------------------------------------------------------------------
 * Minimal vector math for in-app vector search. No external vector DB
 * (Pinecone/Weaviate/Atlas Vector Search) is required - for a single
 * uploaded document's worth of chunks (tens to a few hundred vectors),
 * plain in-memory cosine similarity is fast and dependency-free.
 * -----------------------------------------------------------------------
 */

function dot(a, b) {
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    sum += a[i] * b[i];
  }
  return sum;
}

/**
 * Cosine similarity. Assumes both vectors are already unit-normalized
 * (geminiEmbeddings.js normalizes on the way out), in which case cosine
 * similarity reduces to a plain dot product.
 */
function cosineSimilarity(a, b) {
  return dot(a, b);
}

module.exports = { dot, cosineSimilarity };
