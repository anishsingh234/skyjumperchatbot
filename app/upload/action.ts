"use server";

import { PDFParse } from "pdf-parse";
import { createRequire } from "node:module";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { index } from "@/lib/pinecone";
import { generateEmbeddings } from "@/lib/embedding";
import { chunkContent } from "@/lib/chunking";

const require = createRequire(import.meta.url);

declare global {
  var pdfjsWorker: { WorkerMessageHandler?: unknown } | undefined;
}

let pdfWorkerSetupPromise: Promise<void> | null = null;

async function configurePdfWorker() {
  if (!pdfWorkerSetupPromise) {
    pdfWorkerSetupPromise = (async () => {
      const pdfParseEntry = require.resolve("pdf-parse");
      const pdfParseRoot = path.dirname(path.dirname(path.dirname(path.dirname(pdfParseEntry))));
      const workerPath = path.join(pdfParseRoot, "dist", "worker", "pdf.worker.mjs");
      const workerModule = await import(pathToFileURL(workerPath).href);

      globalThis.pdfjsWorker = workerModule;
      PDFParse.setWorker(pathToFileURL(workerPath).href);
    })();
  }

  await pdfWorkerSetupPromise;
}

export async function processPdfFile(formData: FormData) {
  try {
    const file = formData.get("pdf") as File | null;

    if (!file) {
      return {
        success: false,
        error: "No file uploaded",
      };
    }

    // Convert File to Buffer/Uint8Array
    const bytes = await file.arrayBuffer();
    const data = new Uint8Array(bytes);

    await configurePdfWorker();

    let parsedText = "";
    const parser = new PDFParse({ data });

    try {
      const result = await parser.getText();
      parsedText = result.text;
    } finally {
      await parser.destroy();
    }

    if (!parsedText || parsedText.trim().length === 0) {
      return {
        success: false,
        error: "No text found in PDF",
      };
    }

    // 1️⃣ Chunk
    const chunks = await chunkContent(parsedText);

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
    const message = error instanceof Error ? error.message : "Unknown PDF parsing error";
    console.error("PDF processing error:", error);
    return {
      success: false,
      error: `Failed to process PDF: ${message}`,
    };
  }
}
