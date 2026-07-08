export class EmbeddingEngine {
  // Local fast semantic vector generation (dimension 50)
  embed(text: string): number[] {
    const vector = new Array(50).fill(0);
    const cleaned = text.toLowerCase().trim();

    for (let i = 0; i < cleaned.length; i++) {
      vector[i % 50] += cleaned.charCodeAt(i) / 255;
    }

    // Normalize the vector to unit length
    let mag = 0;
    for (let i = 0; i < 50; i++) {
      mag += vector[i] * vector[i];
    }
    mag = Math.sqrt(mag);

    if (mag > 0) {
      for (let i = 0; i < 50; i++) {
        vector[i] /= mag;
      }
    }

    return vector;
  }
}
