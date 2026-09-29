const API_BASE = process.env.NEXT_PUBLIC_API!;

export type UploadResponse = {
  url: string;
};

export async function uploadImage(
  token: string,
  file: File
): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(`${API_BASE}/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(body?.message ?? "Failed to upload image");
  }

  return body;
}