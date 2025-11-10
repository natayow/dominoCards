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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Domino Cards</h1>

      <p>Source: {JSON.stringify(SOURCE)}</p>

      <div className="flex gap-4 mt-4">
        <button
          onClick={sortAsc}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Sort Asc
        </button>
        <button
          onClick={sortDesc}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Sort Desc
        </button>
        <button
          onClick={resetAll}
          className="px-4 py-2 bg-gray-500 text-white rounded"
        >
          Reset
        </button>
      </div>

      <h2 className="mt-6 font-semibold text-lg">Doubles:</h2>

      {doubles.length > 0 ? (
        doubles.map((d, i) => (
          <p key={i} className="text-sm">
            [{d[0]}, {d[1]}]
          </p>
        ))
      ) : (
        <p>No doubles found</p>
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
        <div
          className={`relative w-full h-full transition-transform duration-500 preserve-3d ${
            flipped ? "rotate-y-180" : ""
          }`}
        >
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

      <p className="text-sm mt-1">Sum: {sum}</p>
    </div>
  );
}
