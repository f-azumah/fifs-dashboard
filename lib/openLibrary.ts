export type BookResult = {
  key: string;
  title: string;
  author: string;
  coverUrl: string | null;
};

type OpenLibraryDoc = {
  key: string;
  title: string;
  author_name?: string[];
  cover_i?: number;
};

export async function searchBooks(query: string): Promise<BookResult[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(
    trimmed
  )}&limit=8&fields=key,title,author_name,cover_i`;

  const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
  if (!res.ok) return [];

  const data = (await res.json()) as { docs?: OpenLibraryDoc[] };

  return (data.docs ?? []).map((doc) => ({
    key: doc.key,
    title: doc.title,
    author: doc.author_name?.[0] ?? "Unknown author",
    coverUrl: doc.cover_i
      ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
      : null,
  }));
}
