"use client";

import { useRef, useMemo, useCallback } from "react";
import { motion } from "motion/react";
import DottedMap from "dotted-map";

interface MapProps {
  dots?: Array<{
    start: { lat: number; lng: number; label?: string };
    end: { lat: number; lng: number; label?: string };
  }>;
  lineColor?: string;
  isDarkMode?: boolean;
}

export function WorldMap({
  dots = [],
  lineColor = "#0ea5e9",
  isDarkMode = true,
}: MapProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  // Memoize the projection function
  const projectPoint = useCallback((lat: number, lng: number) => {
    const x = (lng + 180) * (800 / 360);
    const y = (90 - lat) * (400 / 180);
    return { x, y };
  }, []);

  // Memoize the map instance and SVG generation
  const { svgMap, projectedDots } = useMemo(() => {
    const map = new DottedMap({ height: 100, grid: "diagonal" });

    const svgMap = map.getSVG({
      radius: 0.22,
      color: isDarkMode ? "#FFFFFF40" : "#00000040",
      shape: "circle",
      backgroundColor: isDarkMode ? "#0a0a0a" : "#ffffff",
    });

    // Pre-calculate all projections to avoid repeated calculations
    const projectedDots = dots.map((dot) => ({
      start: projectPoint(dot.start.lat, dot.start.lng),
      end: projectPoint(dot.end.lat, dot.end.lng),
      original: dot,
    }));

    return { svgMap, projectedDots };
  }, [dots, isDarkMode, projectPoint]);

  // Memoize the curved path creation
  const createCurvedPath = useCallback(
    (start: { x: number; y: number }, end: { x: number; y: number }) => {
      const midX = (start.x + end.x) / 2;
      const midY = Math.min(start.y, end.y) - 50;
      return `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`;
    },
    []
  );

  return (
    <div className="w-full aspect-[2/1] bg-black rounded-lg  relative font-sans">
      <img
        src={`data:image/svg+xml;utf8,${encodeURIComponent(svgMap)}`}
        className="h-full w-full [mask-image:linear-gradient(to_bottom,transparent,white_10%,white_90%,transparent)] pointer-events-none select-none"
        alt="world map"
        height="495"
        width="1056"
        draggable={false}
      />
      <svg
        ref={svgRef}
        viewBox="0 0 800 400"
        className="w-full h-full absolute inset-0 pointer-events-none select-none"
      >
        {projectedDots.map((dot, i) => (
          <g key={`path-group-${i}`}>
            <motion.path
              d={createCurvedPath(dot.start, dot.end)}
              fill="none"
              stroke="url(#path-gradient)"
              strokeWidth="1"
              initial={{
                pathLength: 0,
              }}
              animate={{
                pathLength: 1,
              }}
              transition={{
                duration: 0.8,
                delay: 0.2 * i,
                ease: "easeOut",
              }}
            />
          </g>
        ))}

        <defs>
          <linearGradient id="path-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="5%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="95%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>

        {projectedDots.map((dot, i) => (
          <g key={`points-group-${i}`}>
            {/* Start point */}
            <circle cx={dot.start.x} cy={dot.start.y} r="2" fill={lineColor} />
            <circle
              cx={dot.start.x}
              cy={dot.start.y}
              r="2"
              fill={lineColor}
              opacity="0.3"
            >
              <animate
                attributeName="r"
                from="2"
                to="6"
                dur="2s"
                begin={`${0.5 + i * 0.3}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                from="0.3"
                to="0"
                dur="2s"
                begin={`${0.5 + i * 0.3}s`}
                repeatCount="indefinite"
              />
            </circle>
            {/* End point */}
            <circle cx={dot.end.x} cy={dot.end.y} r="2" fill={lineColor} />
            <circle
              cx={dot.end.x}
              cy={dot.end.y}
              r="2"
              fill={lineColor}
              opacity="0.3"
            >
              <animate
                attributeName="r"
                from="2"
                to="6"
                dur="2s"
                begin={`${0.8 + i * 0.3}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                from="0.3"
                to="0"
                dur="2s"
                begin={`${0.8 + i * 0.3}s`}
                repeatCount="indefinite"
              />
            </circle>
          </g>
        ))}
      </svg>
    </div>
  );
}
