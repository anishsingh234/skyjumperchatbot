"use server";

import { PDFParse } from "pdf-parse";
import { index } from "@/lib/pinecone";
import { generateEmbeddings } from "@/lib/embedding";
import { chunkContent } from "@/lib/chunking";

export async function processPdfFile(formData: FormData) {
  try {
    const file = formData.get("pdf") as File | null;

    if (!file) {
      return {
        success: false,
        error: "No file uploaded",
      };
    }

    // Convert File to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // ✅ Same working parsing method
    const parser = new PDFParse({ data: buffer });
    const data = await parser.getText();

    if (!data.text || data.text.trim().length === 0) {
      return {
        success: false,
        error: "No text found in PDF",
      };
    }

    // 1️⃣ Chunk
    const chunks = await chunkContent(data.text);

    // 2️⃣ Generate embeddings
    const embeddings = await generateEmbeddings(chunks);

    if (embeddings.length !== chunks.length) {
      return {
        success: false,
        error: "Embedding generation mismatch",
      };
    }

    const timestamp = Date.now();

    // 3️⃣ Prepare Pinecone vectors
    const vectors = chunks.map((chunk, i) => ({
      id: `pdf-${timestamp}-${i}`,
      values: embeddings[i],
      metadata: {
        text: chunk,
        source: file.name,
        chunkIndex: i,
      },
    }));

    // 4️⃣ Batch upsert (safe for large PDFs)
    const batchSize = 100;
    for (let i = 0; i < vectors.length; i += batchSize) {
      await index.upsert({
        records: vectors.slice(i, i + batchSize),
      });
    }

    return {
      success: true,
      message: `Created ${vectors.length} searchable chunks`,
    };

  } catch (error) {
    console.error("PDF processing error:", error);
    return {
      success: false,
      error: "Failed to process PDF",
    };
  }
}
