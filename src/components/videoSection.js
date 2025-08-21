"use client";

import he from "he";
import { useRef, useEffect, useState } from "react";
import { fetchWpPage, extractAttributeBlocks, getValue } from "@/utils/wpApi";

export default function VideoSection() {
  const videoRef = useRef(null);
  const [linkText, setLinkText] = useState("See What We're About");
  const [svgPath, setSvgPath] = useState("M0-1.79v800L600,395L0-1.79z"); // default play button

  useEffect(() => {
    if (videoRef.current) videoRef.current.loop = true;
  }, []);

  useEffect(() => {
    async function loadWPContent() {
      try {
        const page = await fetchWpPage(5909); // your WP page ID
        if (!page?.content_html) return;

        const extracted = extractAttributeBlocks(page.content_html);

        const textFromWP = getValue("link_text", extracted, 3);
        setLinkText(textFromWP)
        // if (textFromWP) {
        //   setLinkText(he.decode(textFromWP));
        // }
      } catch (err) {
        console.error("Failed to load WP content:", err);
      }
    }

    loadWPContent();
  }, []);

  return (
    <section className="relative w-full h-[80vh] min-h-[600px] overflow-hidden group">
      {/* Video */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-120"
      >
        <source src="/salientvideo.mp4" type="video/mp4" />
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center max-w-[1200px] mx-auto px-6 sm:px-8">
        {/* Circle Button */}
        <button className="transition-transform duration-300 hover:scale-110 mb-4 p-6 rounded-full border-2 border-white group cursor-pointer">
          <svg
            className="w-5 h-5 text-white transition-colors duration-300"
            viewBox="0 0 400 800"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path fill="currentColor" d={svgPath} />
          </svg>
        </button>

        {/* Title */}
        <h2 className="text-4xl sm:text-5xl md:text-5xl font-bold text-white text-center">
          {linkText}
        </h2>
      </div>
    </section>
  );
}
