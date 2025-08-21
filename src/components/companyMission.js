"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Wrapper from "./wrapping/wrapper";
import { getValue, fetchWpImageByValue } from "@/utils/wpApi";

export default function CompanyMission({ texts }) {
  const [missionImage, setMissionImage] = useState({ url: "/missionsection.jpg", alt: "" });

  useEffect(() => {
    async function loadImage() {
      if (!texts?.length) return;


      // const IMAGE_INDEX = 1; 
      const imageVal = getValue("background_image", texts, 1);
      if (imageVal) {
        const imgData = await fetchWpImageByValue(imageVal);
        setMissionImage(imgData || { url: "/missionsection.jpg", alt: "" });
      }
    }

    loadImage();
  }, [texts]);

  if (!texts?.length) return null;

  return (
    <Wrapper delay={0.3} noOverflow>
      <section className="w-full bg-white mt-20 mb-20 px-4 sm:px-6 max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Text Section */}
        <div className="flex flex-col justify-center">
          <Wrapper delay={0.4} noOverflow>
            <h2 className="text-3xl md:text-4xl lg:text-[2.8rem] font-bold leading-snug text-black">
              {getValue("text_content", texts, 3)}
            </h2>
          </Wrapper>

          <Wrapper delay={0.5} noOverflow>
            <div className="mt-6">
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 list-disc list-outside pl-6 lg:text-[1.1rem] font-medium text-gray-800">
                {texts
                  .filter(item => item.type === "li")
                  .map((liItem, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {liItem.value}
                    </li>
                  ))}
              </ul>
            </div>
          </Wrapper>

          <Wrapper delay={0.6} noOverflow>
            <a
              href={getValue("link_url", texts, 2) || "#team"}
              className="mt-8 inline-block text-orange-500 font-semibold "
            >
              {getValue("link_text", texts, 2)}
            </a>
          </Wrapper>
        </div>

        {/* Dynamic Image Section */}
        <Wrapper delay={0.7} className="overflow-visible" noOverflow>
          <div className="relative w-full h-[300px] md:h-[400px]">
            <Image
              src={missionImage.url}
              alt={missionImage.alt || "Mission Image"}
              fill
              className="object-contain md:object-cover"
            />
          </div>
        </Wrapper>
      </section>
    </Wrapper>
  );
}
