/**
 * clustering.js
 * -----------------------------------------------------------------------
 * Groups a document's chunk embeddings into topic clusters and picks one
 * real chunk per cluster to represent it. This replaces query-based
 * retrieval entirely - there is no synthetic "query" here, so nothing is
 * being scored for relevance against an invented string. Instead we let
 * the document's own embedding geometry tell us what its distinct
 * topics/sections are, and pick a genuine chunk closest to the center of
 * each one.
 *
 * Implementation: spherical k-means (cosine-similarity based, since our
 * embeddings are unit-normalized) with k-means++ seeding for stable,
 * well-spread starting centroids.
 * -----------------------------------------------------------------------
 */

const { cosineSimilarity } = require("./vectorMath");

function meanVector(vectors) {
  const dim = vectors[0].length;
  const mean = new Array(dim).fill(0);
  for (const v of vectors) {
    for (let i = 0; i < dim; i++) mean[i] += v[i];
  }
  for (let i = 0; i < dim; i++) mean[i] /= vectors.length;
  return mean;
}

function normalize(vector) {
  const magnitude = Math.sqrt(vector.reduce((sum, v) => sum + v * v, 0)) || 1;
  return vector.map((v) => v / magnitude);
}

/**
 * k-means++ seeding: pick the first centroid randomly, then each
 * subsequent one with probability proportional to its squared distance
 * from the nearest centroid already chosen. This spreads the initial
 * centroids across the embedding space instead of risking several
 * starting points landing in the same topic cluster.
 */
function seedCentroids(points, k, rng = Math.random) {
  const centroids = [points[Math.floor(rng() * points.length)].embedding];

  while (centroids.length < k) {
    const distances = points.map((p) => {
      const maxSim = Math.max(...centroids.map((c) => cosineSimilarity(p.embedding, c))); // ... is spread opeator . coverts the [2,4,2,4] to (2,4,2,4) . max doesnt undestand the array 
      const dist= Math.max(1 - maxSim, 0); // "distance" for unit vectors
      return dist*dist;
    });

    const total = distances.reduce((sum, d) => sum + d, 0);

    if (total === 0) {
      // Every point is already identical to a chosen centroid - just fall
      // back to picking any point so we still reach k centroids.
      centroids.push(points[Math.floor(rng() * points.length)].embedding);
      continue;
    }

    let r = rng() * total;
    let chosenIndex = distances.length - 1;
    for (let i = 0; i < distances.length; i++) {
      r -= distances[i];
      if (r <= 0) {
        chosenIndex = i;
        break;
      }
    }
    centroids.push(points[chosenIndex].embedding);
  }

  return centroids;
}

/**
 * Cluster chunks by embedding similarity and return one representative
 * chunk per cluster (the chunk closest to that cluster's centroid).
 *
 * @param {Array<{chunkIndex:number, text:string, embedding:number[]}>} chunks
 * @param {number} k - target number of clusters/representatives
 * @param {object} opts
 * @returns {Array<{representative: object, members: object[]}>}
 */
function clusterChunks(chunks, k, opts = {}) {
  const maxIterations = opts.maxIterations ?? 25;

  // Nothing to compress - every chunk is its own "cluster".
  if (chunks.length <= k) {
    return chunks.map((c) => ({ representative: c, members: [c] }));
  }

  let centroids = seedCentroids(chunks, k);
  let assignments = new Array(chunks.length).fill(-1);

  for (let iter = 0; iter < maxIterations; iter++) {
    // --- assignment step: each chunk joins its nearest centroid ---
    const newAssignments = chunks.map((chunk) => {
      let best = 0;
      let bestSim = -Infinity;
      for (let c = 0; c < centroids.length; c++) {
        const sim = cosineSimilarity(chunk.embedding, centroids[c]);
        if (sim > bestSim) {
          bestSim = sim;
          best = c;
        }
      }
      return best;
    });

    const changed = newAssignments.some((a, i) => a !== assignments[i]);
    assignments = newAssignments;

    if (!changed && iter > 0) break;

    // --- update step: recompute each centroid as the mean of its members ---
    centroids = centroids.map((oldCentroid, c) => {
      const members = chunks.filter((_, i) => assignments[i] === c);

      if (members.length === 0) {
        // Empty cluster: re-seed it on the chunk currently worst-represented
        // by its assigned centroid, so it doesn't just vanish.
        let worstIndex = 0;
        let worstSim = Infinity;
        chunks.forEach((chunk, i) => {
          const sim = cosineSimilarity(chunk.embedding, centroids[assignments[i]]);
          if (sim < worstSim) {
            worstSim = sim;
            worstIndex = i;
          }
        });
        return chunks[worstIndex].embedding;
      }

      return normalize(meanVector(members.map((m) => m.embedding)));
    });
  }

  // --- pick a representative per final cluster: the chunk closest to its centroid ---
  const clusters = centroids
    .map((centroid, c) => {
      const members = chunks.filter((_, i) => assignments[i] === c);
      if (members.length === 0) return null;

      let representative = members[0];
      let bestSim = -Infinity;
      for (const member of members) {
        const sim = cosineSimilarity(member.embedding, centroid);
        if (sim > bestSim) {
          bestSim = sim;
          representative = member;
        }
      }

      return { representative, members };
    })
    .filter(Boolean);

  return clusters;
}

module.exports = { clusterChunks };
