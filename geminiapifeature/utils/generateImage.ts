// utils/generateImage.ts

export async function generateImage(prompt: string): Promise<string | null> {
  try {
    const res = await fetch("/api/generate-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();
    return data.imageUrl || null;
  } catch (err) {
    console.error("Image generation failed:", err);
    return null;
  }
}
