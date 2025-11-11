"use client";
import { useState } from "react";

const SOURCE = [
  [6, 1],
  [4, 3],
  [5, 1],
  [3, 4],
  [1, 1],
  [3, 4],
  [2, 2],
];

export default function Page() {
  const [tiles, setTiles] = useState(
    SOURCE.map((t, i) => ({ id: i, top: t[0], bottom: t[1] }))
  );

  const original = SOURCE.map((t, i) => ({ id: i, top: t[0], bottom: t[1] }));

  function flip(id: number) {
    setTiles((prev) =>
      prev.map((tile) =>
        tile.id === id ? { ...tile, top: tile.bottom, bottom: tile.top } : tile
      )
    );
  }

  function sortAsc() {
    setTiles((prev) =>
      [...prev].sort((a, b) => a.top + a.bottom - (b.top + b.bottom))
    );
  }

  function sortDesc() {
    setTiles((prev) =>
      [...prev].sort((a, b) => b.top + b.bottom - (a.top + a.bottom))
    );
  }

  function resetAll() {
    setTiles(original);
  }

  const doubles = SOURCE.filter(([a, b]) => a === b);

  return (
    <div className="min-h-dvh bg-neutral-50 p-6 md:p-10">
      <header className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-neutral-900">
            Domino Cards
          </h1>

          <p className="text-neutral-600">Source: {JSON.stringify(SOURCE)}</p>
        </div>

        <div className="flex gap-4 mt-4">
          <button
            onClick={sortAsc}
            className="rounded-2xl border border-neutral-300 bg-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-neutral-50 text-black"
          >
            Sort Asc
          </button>
          <button
            onClick={sortDesc}
            className="rounded-2xl border border-neutral-300 bg-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-neutral-50 text-black"
          >
            Sort Desc
          </button>
          <button
            onClick={resetAll}
            className="rounded-2xl border border-neutral-300 bg-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-neutral-50 text-black"
          >
            Reset
          </button>
        </div>
      </header>

      <h2 className="mb-2 text-lg font-semibold text-neutral-900">Doubles:</h2>

      {doubles.length > 0 ? (
        doubles.map((d, i) => (
          <p key={i} className="text-neutral-600">
            [{d[0]}, {d[1]}]
          </p>
        ))
      ) : (
        <p className="text-neutral-600">No doubles found</p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
        {tiles.map((tile) => (
          <DominoCard key={tile.id} tile={tile} flip={() => flip(tile.id)} />
        ))}
      </div>
    </div>
  );
}

function DominoCard({
  tile,
  flip,
}: {
  tile: { id: number; top: number; bottom: number };
  flip: () => void;
}) {
  const sum = tile.top + tile.bottom;

  const [flipped, setFlipped] = useState(false);

  function handleFlip() {
    setFlipped(!flipped);
    flip();
  }

  return (
    <div className="flex flex-col items-center">
      <div className="w-24 h-36 border-2 border-black rounded-lg perspective">
        <div>
          <div className="absolute inset-0 text-black bg-white rounded-lg flex flex-col items-center justify-center backface-hidden">
            <div className="text-2xl">{tile.top}</div>
            <div className="my-1 w-3/4 h-px bg-black" />
            <div className="text-2xl">{tile.bottom}</div>
          </div>

          <div className="absolute inset-0 text-black bg-gray-100 rounded-lg flex flex-col items-center justify-center rotate-y-180 backface-hidden">
            <div className="text-2xl">{tile.bottom}</div>
            <div className="my-1 w-3/4 h-px bg-black" />
            <div className="text-2xl">{tile.top}</div>
          </div>
        </div>
      </div>

      <button
        onClick={handleFlip}
        className="mt-2 px-3 py-1 bg-blue-600 text-white rounded text-sm"
      >
        Flip
      </button>

      <p className="text-sm mt-1 text-neutral-600">Sum: {sum}</p>
    </div>
  );
}
