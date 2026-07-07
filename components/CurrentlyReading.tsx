"use client";

import { useEffect, useState, useTransition } from "react";
import type {
  CurrentlyReading as CurrentlyReadingRecord,
  ReadingStatus,
} from "@prisma/client";
import type { BookResult } from "@/lib/openLibrary";
import {
  searchBooksAction,
  setCurrentlyReadingBook,
  setReadingStatus,
} from "@/app/actions";

const STATUS_OPTIONS: { value: ReadingStatus; label: string }[] = [
  { value: "READING", label: "Reading" },
  { value: "PAUSED", label: "Paused" },
  { value: "COMPLETED", label: "Completed" },
];

export default function CurrentlyReading({
  reading,
}: {
  reading: CurrentlyReadingRecord | null;
}) {
  const [searching, setSearching] = useState(!reading?.title);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<BookResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [, startTransition] = useTransition();

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      return;
    }
    setLoading(true);
    const handle = setTimeout(() => {
      searchBooksAction(trimmed)
        .then(setResults)
        .finally(() => setLoading(false));
    }, 350);
    return () => clearTimeout(handle);
  }, [query]);

  function pickBook(book: BookResult) {
    startTransition(() =>
      setCurrentlyReadingBook({
        title: book.title,
        author: book.author,
        coverUrl: book.coverUrl,
      })
    );
    setSearching(false);
    setQuery("");
    setResults([]);
  }

  return (
    <div className="rounded-lg border border-ink/10 bg-cream/60 p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">📖 Currently reading</h2>
        {!searching && reading?.title && (
          <button
            onClick={() => setSearching(true)}
            className="text-xs text-lavender hover:text-ink/70"
          >
            Change
          </button>
        )}
      </div>

      {searching ? (
        <div className="flex flex-col gap-2">
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a book…"
            className="w-full text-sm px-2 py-1.5 rounded border border-ink/10 bg-cream focus:outline-none"
          />
          {loading && <p className="text-xs text-ink/30">Searching…</p>}
          {results.length > 0 && (
            <ul className="flex flex-col gap-1 max-h-56 overflow-y-auto">
              {results.map((book) => (
                <li key={book.key}>
                  <button
                    onClick={() => pickBook(book)}
                    className="w-full flex items-center gap-2 text-left p-1.5 rounded hover:bg-lavender/10"
                  >
                    {book.coverUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={book.coverUrl}
                        alt=""
                        className="w-8 h-11 object-cover rounded shrink-0 bg-ink/5"
                      />
                    ) : (
                      <div className="w-8 h-11 rounded shrink-0 bg-ink/5" />
                    )}
                    <span className="flex flex-col min-w-0">
                      <span className="text-sm truncate">{book.title}</span>
                      <span className="text-xs text-ink/40 truncate">
                        {book.author}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          {reading?.title && (
            <button
              onClick={() => {
                setSearching(false);
                setQuery("");
                setResults([]);
              }}
              className="text-xs text-ink/40 hover:text-ink/70 self-start"
            >
              Cancel
            </button>
          )}
        </div>
      ) : (
        <div className="flex gap-3">
          {reading?.coverUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={reading.coverUrl}
              alt=""
              className="w-14 h-20 object-cover rounded shrink-0 bg-ink/5"
            />
          ) : (
            <div className="w-14 h-20 rounded shrink-0 bg-ink/5" />
          )}
          <div className="flex flex-col gap-2 flex-1 min-w-0">
            <div>
              <p className="text-sm font-medium truncate">{reading?.title}</p>
              <p className="text-xs text-ink/40 truncate">{reading?.author}</p>
            </div>
            <div className="flex gap-1">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() =>
                    startTransition(() => setReadingStatus(opt.value))
                  }
                  className={`text-xs px-2 py-1 rounded-full transition-colors ${
                    reading?.status === opt.value
                      ? "bg-lavender text-white"
                      : "bg-ink/5 text-ink/50 hover:bg-ink/10"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
