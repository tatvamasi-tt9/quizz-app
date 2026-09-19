/**
 * textChunker.js
 * -----------------------------------------------------------------------
 * Splits a big blob of text into smaller, overlapping, sentence-aware
 * chunks so each chunk:
 *   - is small enough to embed cleanly (well under the embedding model's
 *     ~2048 token input limit)
 *   - stays semantically coherent (we try to break on sentence boundaries,
 *     not mid-sentence)
 *   - overlaps a little with its neighbour so we don't lose context that
 *     straddles a chunk boundary (e.g. "...as shown in Fig 2. | This proves
 *     that...")
 * -----------------------------------------------------------------------
 */

const DEFAULT_CHUNK_SIZE = 1000; // characters
const DEFAULT_OVERLAP = 150; // characters
const DEFAULT_MIN_CHUNK_LENGTH = 200; // characters
const DEFAULT_MAX_CHUNKS = 300; // hard safety cap on very large documents

/**
 * Naive but effective sentence splitter. Keeps the terminal punctuation
 * attached to the sentence it belongs to.
 */
function splitIntoSentences(text) {
  const matches = text.match(/[^.!?]+[.!?]+(\s+|$)|[^.!?]+$/g);
  return matches && matches.length > 0 ? matches : [text];
}

/**
 * chunkText
 * @param {string} text - raw input text (already extracted from pdf/image/link/manual entry)
 * @param {object} opts
 * @returns {string[]} array of chunk strings, in original document order
 */
function chunkText(text, opts = {}) {
  const chunkSize = opts.chunkSize || DEFAULT_CHUNK_SIZE;
  const overlap = opts.overlap ?? DEFAULT_OVERLAP;
  const minChunkLength = opts.minChunkLength ?? DEFAULT_MIN_CHUNK_LENGTH;
  const maxChunks = opts.maxChunks ?? DEFAULT_MAX_CHUNKS;

  const cleaned = (text || "").replace(/\s+/g, " ").trim();

  if (!cleaned) return [];
  if (cleaned.length <= chunkSize) return [cleaned];

  const sentences = splitIntoSentences(cleaned);

  const rawChunks = [];
  let current = "";

  for (const sentence of sentences) {
    if (current.length > 0 && (current.length + sentence.length) > chunkSize) {
      rawChunks.push(current.trim());
      // Seed the next chunk with the tail of the previous one for overlap continuity
      const tail = current.slice(Math.max(0, current.length - overlap));
      current = tail + sentence;
    } else {
      current += sentence;
    }
  }
  if (current.trim().length > 0) {
    rawChunks.push(current.trim());
  }

  // Merge any tiny trailing/orphan chunk into its predecessor so we don't
  // end up embedding near-empty fragments.
  const chunks = [];
  for (const chunk of rawChunks) {
    if (chunk.length < minChunkLength && chunks.length > 0) {
      chunks[chunks.length - 1] = `${chunks[chunks.length - 1]} ${chunk}`.trim();
    } else {
      chunks.push(chunk);
    }
  }

  // Safety cap: extremely large documents shouldn't blow up embedding costs/time.
  // Evenly sample across the document rather than just chopping off the tail,
  // so we still keep coverage of the whole source.
  if (chunks.length > maxChunks) {
    const step = chunks.length / maxChunks;
    const sampled = [];
    for (let i = 0; i < maxChunks; i++) {
      sampled.push(chunks[Math.floor(i * step)]);
    }
    return sampled;
  }

  return chunks;
}

module.exports = { chunkText, DEFAULT_CHUNK_SIZE, DEFAULT_OVERLAP, DEFAULT_MAX_CHUNKS };
