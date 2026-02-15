import { embed, embedMany } from "ai";
import { google } from "@ai-sdk/google";

export async function generateEmbedding(text: string): Promise<number[]> {
  const input = text.replaceAll("\n", " ");

  const { embedding } = await embed({
    model: google.embedding("gemini-embedding-001"),
    value: input,
  });

  return embedding;
}

export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  const inputs = texts.map((text) => text.replaceAll("\n", ""));
  const { embeddings } = await embedMany({
    model: google.embedding("gemini-embedding-001"),
    values: inputs,
  });

  return embeddings;
}
