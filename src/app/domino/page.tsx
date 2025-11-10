"use client";
import React, { useMemo, useState } from "react";

const INITIAL_SOURCE: [number, number][] = [
  [6, 1],
  [4, 3],
  [5, 1],
  [3, 4],
  [1, 1],
  [3, 4],
  [1, 2],
];

const PIP_MAP: Record<number, number[]> = {
  0: [],
  1: [5],
  2: [1, 9],
  3: [1, 5, 9],
  4: [1, 3, 7, 9],
  5: [1, 3, 5, 7, 9],
  6: [1, 3, 4, 6, 7, 9],
};

interface Tile {
  id: string;
  top: number;
  bottom: number;
}

type SortMode = "asc" | "desc" | null;

export default function DominoPage() {
  const initialTiles = useMemo<Tile[]>(
    () =>
      INITIAL_SOURCE.map(([top, bottom], i) => ({ id: `t-${i}`, top, bottom })),
    []
  );

  const [tiles, setTiles] = useState<Tile[]>(initialTiles);
  const [sortMode, setSortMode] = useState<SortMode>(null);

  const doubles = useMemo(() => {
    return INITIAL_SOURCE.filter(([a, b]) => a === b);
  }, []);

  const sum = (t: Tile) => t.top + t.bottom;

  const sortedTiles = useMemo(() => {
    if (!sortMode) return tiles;
    const sorted = [...tiles].sort((a, b) => sum(a) - sum(b));
    return sortMode === "asc" ? sorted : sorted.reverse();
  }, [tiles, sortMode]);

  function flip(id: string) {
    setTiles((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, top: t.bottom, bottom: t.top } : t
      )
    );
  }

  function sortAsc() {
    setSortMode("asc");
  }

  function sortDesc() {
    setSortMode("desc");
  }

  function resetAll() {
    setTiles(initialTiles);
    setSortMode(null);
  }

  return (
    <main className="min-h-dvh bg-neutral-50 p-6 md:p-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-neutral-900">
              Dominoes Playground
            </h1>
            <p className="text-neutral-600">
              Source:{" "}
              <code className="text-neutral-800">
                {JSON.stringify(INITIAL_SOURCE)}
              </code>
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={sortAsc}
              className="rounded-2xl border border-neutral-300 bg-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-neutral-50 text-black"
            >
              Sort Asc (by sum)
            </button>
            <button
              onClick={sortDesc}
              className="rounded-2xl border border-neutral-300 bg-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-neutral-50 text-black"
            >
              Sort Desc (by sum)
            </button>
            <button
              onClick={resetAll}
              className="rounded-2xl border border-neutral-300 bg-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-neutral-50 text-black"
            >
              Reset
            </button>
          </div>
        </header>

        <section className="mb-8">
          <h2 className="mb-2 text-lg font-semibold text-neutral-900">
            Doubles
          </h2>
          {doubles.length === 0 ? (
            <p className="text-neutral-600">No doubles in source.</p>
          ) : (
            <ul className="flex flex-wrap gap-2">
              {doubles.map(([a, b], i) => (
                <li
                  key={`dbl-${i}`}
                  className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-3 py-1 text-sm text-neutral-800 shadow-sm"
                >
                  <span className="font-mono">
                    [{a},{b}]
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {sortedTiles.map((t) => (
            <DominoCard key={t.id} tile={t} onFlip={() => flip(t.id)} />
          ))}
        </section>
      </div>
    </main>
  );
}

function DominoCard({ tile, onFlip }: { tile: Tile; onFlip: () => void }) {
  const total = tile.top + tile.bottom;
  const isDouble = tile.top === tile.bottom;

  return (
    <div className="group relative rounded-3xl bg-white p-3 shadow-sm ring-1 ring-neutral-200 transition-all hover:shadow-md">
      <div className="absolute right-3 top-3 flex items-center gap-2">
        <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600">
          sum: {total}
        </span>
        {isDouble && (
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
            double
          </span>
        )}
      </div>

      <div className="mx-auto mt-6 w-40 select-none">
        <DominoHalf value={tile.top} rounded="rounded-t-2xl" />
        <div className="h-[2px] w-full bg-neutral-200" />
        <DominoHalf value={tile.bottom} rounded="rounded-b-2xl" />
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-neutral-600">
          <span className="font-mono">
            [{tile.top},{tile.bottom}]
          </span>
        </div>
        <button
          onClick={onFlip}
          className="rounded-xl border border-neutral-300 bg-white px-3 py-1 text-sm font-medium text-neutral-800 shadow-sm transition-colors hover:bg-neutral-50"
        >
          Flip
        </button>
      </div>
    </div>
  );
}

function DominoHalf({ value, rounded }: { value: number; rounded: string }) {
  const pips = PIP_MAP[value] || [];

  return (
    <div
      className={`relative h-28 w-full ${rounded} border border-neutral-300 bg-neutral-50`}
    >
      <div className="grid h-full w-full grid-cols-3 grid-rows-3 p-3">
        {Array.from({ length: 9 }, (_, i) => i + 1).map((pos) => (
          <div key={pos} className="flex items-center justify-center">
            <span
              className={`block h-2.5 w-2.5 rounded-full ${
                pips.includes(pos) ? "bg-neutral-900" : "bg-transparent"
              }`}
            />
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute left-2 top-2 text-xs font-semibold text-neutral-500">
        {value}
      </div>
      <div className="pointer-events-none absolute bottom-2 right-2 rotate-180 text-xs font-semibold text-neutral-500">
        {value}
      </div>
    </div>
  );
}
