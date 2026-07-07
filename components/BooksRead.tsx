import type { BookLog } from "@prisma/client";

export default function BooksRead({ books }: { books: BookLog[] }) {
  return (
    <div className="rounded-lg border border-ink/10 bg-cream/60 p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-ink/40">
          📚 Books read
        </h2>
        <span className="text-xs text-ink/40">
          {books.length} book{books.length === 1 ? "" : "s"}
        </span>
      </div>
      <ul className="flex flex-col gap-2">
        {books.map((book) => (
          <li key={book.id} className="flex items-center gap-2 text-sm">
            {book.coverUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={book.coverUrl}
                alt=""
                className="w-6 h-9 object-cover rounded shrink-0 bg-ink/5"
              />
            ) : (
              <div className="w-6 h-9 rounded shrink-0 bg-ink/5" />
            )}
            <span className="flex flex-col min-w-0">
              <span className="truncate">{book.title}</span>
              {book.author && (
                <span className="text-xs text-ink/40 truncate">{book.author}</span>
              )}
            </span>
          </li>
        ))}
        {books.length === 0 && (
          <li className="text-xs text-ink/30">
            No books finished yet — mark one complete to see it here.
          </li>
        )}
      </ul>
    </div>
  );
}
