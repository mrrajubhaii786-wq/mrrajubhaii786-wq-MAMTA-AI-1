// src/memory/VectorMemory.ts

export interface MemoryNode {
  text: string;
  embedding: number[];
  timestamp: number;
}

let memory: MemoryNode[] = [];

// Helper to compute cosine similarity between two vectors of any length
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length || vecA.length === 0) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Smart local TF-IDF style vectorizer as fallback
export function getLocalEmbedding(text: string): number[] {
  const words = text.toLowerCase().match(/\b\w{3,}\b/g) || [];
  const uniqueWords = Array.from(new Set(words));
  const hashSize = 256; // 256-dimension vector
  const vector = new Array(hashSize).fill(0);
  
  words.forEach(word => {
    let hash = 0;
    for (let i = 0; i < word.length; i++) {
      hash = (hash << 5) - hash + word.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }
    const index = Math.abs(hash) % hashSize;
    vector[index] += 1;
  });
  
  // Normalize vector to unit length
  const sumSq = vector.reduce((sum, v) => sum + v * v, 0);
  if (sumSq > 0) {
    const len = Math.sqrt(sumSq);
    for (let i = 0; i < hashSize; i++) {
      vector[i] /= len;
    }
  }
  return vector;
}

// Fetch embeddings securely from our backend server
async function fetchEmbedding(text: string): Promise<number[]> {
  try {
    const res = await fetch("/api/embeddings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text })
    });
    if (res.ok) {
      const data = await res.json();
      if (data.embedding && Array.isArray(data.embedding)) {
        return data.embedding;
      }
    }
  } catch (err) {
    console.warn("⚠️ [VectorMemory] Fallback to local vectorizer:", err);
  }
  return getLocalEmbedding(text);
}

export async function storeMemory(text: string): Promise<void> {
  if (!text || !text.trim()) return;
  const embedding = await fetchEmbedding(text);
  memory.push({
    text,
    embedding,
    timestamp: Date.now()
  });
  console.log(`🧠 [VectorMemory] New memory vectorized and stored: "${text.substring(0, 40)}..."`);
}

export async function searchMemory(query: string): Promise<{ text: string; score: number } | null> {
  if (memory.length === 0 || !query) return null;
  const qEmbed = await fetchEmbedding(query);
  
  const scored = memory.map(m => ({
    text: m.text,
    score: cosineSimilarity(m.embedding, qEmbed)
  }));
  
  scored.sort((a, b) => b.score - a.score);
  return scored[0] || null;
}

export function clearMemory(): void {
  memory = [];
}
