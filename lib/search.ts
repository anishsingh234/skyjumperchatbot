// src/lib/search.ts
import { index } from "@/lib/pinecone";
import { generateEmbedding } from "@/lib/embedding";

/**
 * Search for similar documents using Pinecone cosine similarity
 */
export async function searchDocuments(
  query: string,
  limit: number = 5,
  threshold: number = 0.7
) {
  // 1️⃣ Generate embedding for query
  const queryVector = await generateEmbedding(query);

  // 2️⃣ Query Pinecone
  const result = await index.query({
    vector: queryVector,
    topK: limit,
    includeMetadata: true,
  });

  // 3️⃣ Filter + normalize response
  const matches =
    result.matches
      ?.filter(
        (match) =>
          typeof match.score === "number" && match.score >= threshold
      )
      .map((match) => ({
        id: match.id,
        content: match.metadata?.text as string,
        similarity: match.score, // cosine similarity
        source: match.metadata?.source,
        chunkIndex: match.metadata?.chunkIndex,
      })) ?? [];

  return matches;
}
