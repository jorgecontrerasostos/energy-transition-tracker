"use client";

import { useEffect, useRef } from "react";
import * as Plot from "@observablehq/plot";
import * as topojson from "topojson-client";
import world from "world-atlas/countries-110m.json";

type RenewableData = {
  area: string;
  iso_3_code: string;
  renewables_pct_generation: number | null;
};

// Map your data's country names to the map's names
const NAME_MAPPING: Record<string, string> = {
  "Viet Nam": "Vietnam",
  "Bosnia Herzegovina": "Bosnia and Herz.",
  "North Macedonia": "Macedonia",
  "Philippines (the)": "Philippines",
  "Dominican Republic (the)": "Dominican Rep.",
  "Russian Federation (the)": "Russia",
  "Iran (Islamic Republic of)": "Iran",
};

export default function ChoroplethMap() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadAndRender() {
      // Load renewable data
      const response = await fetch("/data/renewable_share_2024.json");
      const renewableData: RenewableData[] = await response.json();

      // Convert TopoJSON to GeoJSON
      const countries = topojson.feature(
        world as unknown as TopoJSON.Topology,
        world.objects.countries as TopoJSON.GeometryCollection
      );

      // Create lookup by country name (using mapped names where needed)
      const renewableByName = new Map(
        renewableData.map(d => [
          NAME_MAPPING[d.area] || d.area,
          d.renewables_pct_generation
        ])
      );

      // Check which names match/don't match (using mapped names)
      const mapNames = (countries as any).features.map((f: any) => f.properties.name);
      const dataNames = new Set(renewableData.map(d => NAME_MAPPING[d.area] || d.area));

      // Countries in your data that don't match the map
      const unmatchedFromData = renewableData
        .map(d => ({ original: d.area, mapped: NAME_MAPPING[d.area] || d.area }))
        .filter(({ mapped }) => !mapNames.includes(mapped));

      // Countries in the map that don't have data (should be gray)
      const countriesWithoutData = mapNames.filter((name: string) => !dataNames.has(name));

      console.log("Your data countries NOT found in map:", unmatchedFromData);
      console.log("Map countries WITHOUT data (should be gray):", countriesWithoutData);
      console.log("Total countries with data:", dataNames.size);
      console.log("Total map countries:", mapNames.length);

      const plot = Plot.plot({
        width: 960,
        height: 500,
        projection: "equirectangular",
        color: {
          scheme: "RdYlGn",
          domain: [0, 100],
          label: "Renewable %",
          legend: true,
          unknown: "#d3d3d3"  // Light gray for countries without data
        },
        marks: [
          Plot.geo(countries, {
            fill: (d: any) => renewableByName.get(d.properties.name) ?? null,
            stroke: "#fff",
            strokeWidth: 0.5
          })
        ]
      });

      if (containerRef.current) {
        containerRef.current.appendChild(plot);
      }
    }

    loadAndRender();

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, []);

  return <div ref={containerRef} />;
}
