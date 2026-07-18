"use client";

import Image from "next/image";
import toast from "react-hot-toast";
import { montserrat } from "@/app/home/landing-fonts";
import { MATERIAL_SWATCHES, type MaterialSwatch } from "@/lib/artisanShowcase";

const TILE_SPANS = ["col-span-8", "col-span-4", "col-span-4", "col-span-8"];

function MaterialTile({ material, spanClassName }: { material: MaterialSwatch; spanClassName: string }) {
  return (
    <div className={`relative row-span-1 h-full overflow-hidden rounded-2xl ${spanClassName}`}>
      <Image src={material.image} alt={material.name} fill className="object-cover" />
      <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 hover:opacity-100">
        <span className="rounded-full bg-black/60 px-6 py-2 text-2xl font-semibold text-white">{material.name}</span>
      </div>
    </div>
  );
}

export default function MaterialShowcaseSection() {
  return (
    <section className="w-full bg-gradient-to-b from-[#121212] via-[#606060] to-[#666] py-[120px]">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-16 px-16">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex flex-1 flex-col gap-4">
            <h2 className={`${montserrat.className} text-[40px] font-semibold text-white`}>The Texture of Quality</h2>
            <p className="max-w-[672px] text-lg text-white/50">
              Our procurement process begins at the source. From the veins of Tuscan quarries to the sustainable
              teak forests of Southeast Asia, we select materials that age with dignity.
            </p>
          </div>
          <div className="flex flex-1 justify-end">
            <button
              type="button"
              onClick={() => toast.success("More material stories are on the way.")}
              className="rounded-xl border border-white px-4 py-3.5 text-lg text-white transition-colors hover:bg-white/10"
            >
              View all
            </button>
          </div>
        </div>

        <div className="grid h-[800px] grid-cols-12 grid-rows-2 gap-4">
          {MATERIAL_SWATCHES.map((material, index) => (
            <MaterialTile key={material.id} material={material} spanClassName={TILE_SPANS[index]} />
          ))}
        </div>
      </div>
    </section>
  );
}
