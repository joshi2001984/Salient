"use client";

import Image from "next/image";
import Wrapper from "../components/wrapping/wrapper";
import { getValue } from "@/utils/wpApi";

export default function HeroSection({ bgUrl, texts }) {
  return (
    <section className="relative h-[80vh] md:h-[94vh] flex items-center justify-center px-4 md:px-8 overflow-hidden">
      {bgUrl && (
        <div className="absolute inset-0 -z-10">
          <Image
            src={bgUrl || "/heroimg.jpg"}
            alt="Hero Background"
            fill
            className="object-cover object-bottom md:object-center" 
            priority
          />
        </div>
      )}

      {/* overlay */}
      <div className="absolute inset-0 bg-gray-950 opacity-50" />

      {/* content */}
      <div
        className="absolute w-full px-4 sm:px-6 md:px-8 max-w-[1200px] mx-auto text-center md:text-left"
        style={{ top: "50%", transform: "translateY(-50%)" }}
      >
        <Wrapper delay={0.1}>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.7rem] leading-tight font-bold text-white mb-6 sm:mb-8 max-w-full md:max-w-[600px]">
            {getValue("text_content", texts, 0)}
          </h1>
        </Wrapper>

        <Wrapper delay={0.3} noOverflow>
          <button className="bg-orange-500 hover:bg-orange-600 text-white text-lg sm:text-xl md:text-2xl lg:text-[1.5rem] font-bold py-3 px-6 sm:px-8 md:px-10 rounded-full transition-colors duration-300">
            {getValue("link_text", texts, 0)}
          </button>
        </Wrapper>
      </div>
    </section>
  );
}
