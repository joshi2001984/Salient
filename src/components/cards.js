"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { fetchWpPage, extractAttributeBlocks, getValue, fetchWpImageById } from "@/utils/wpApi";

export default function Card() {
  const [cards, setCards] = useState([]);
  const [heading, setHeading] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(null); // 👈 for mobile toggle

  useEffect(() => {
    async function loadCards() {
      setLoading(true);
      try {
        const page = await fetchWpPage(5909);
        if (!page?.content_html) return;

        const extracted = extractAttributeBlocks(page.content_html);

        // Section heading
        setHeading(getValue("text_content", extracted, 2));

        const h2Titles = extracted
          .filter(item => item.type === "h2")
          .map(item => item.value);

        const hoverContent = getValue("hover_content", extracted, 0);

        const imageIndices = [0, 1, 2, 3];
        const images = await Promise.all(
          imageIndices.map(async idx => {
            const imageId = getValue("image_url", extracted, idx);
            if (!imageId) return "/default.jpg";
            const imgData = await fetchWpImageById(imageId);
            return imgData?.url || "/default.jpg";
          })
        );

        const dynamicCards = h2Titles.map((title, index) => ({
          title,
          desc: hoverContent,
          image: images[index] || "/default.jpg"
        }));

        setCards(dynamicCards);
      } catch (err) {
        console.error("Failed to load cards:", err);
      } finally {
        setLoading(false);
      }
    }

    loadCards();
  }, []);

  if (loading) return <p className="text-center py-10">Loading cards...</p>;

  return (
    <section className="w-full bg-white py-16">
      <div className="max-w-[90%] mx-auto">
        <div className="flex justify-center">
          <h2 className="text-center text-3xl md:text-4xl lg:text-[3.2rem] font-bold mb-10 text-black max-w-[800px]">
            {heading}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {cards.map((card, index) => {
            const isActive = activeIndex === index; 

            return (
              <div
                key={index}
                className="relative h-[500px] overflow-hidden shadow-lg cursor-pointer group"
                onClick={() =>
                  setActiveIndex(isActive ? null : index)
                }
              >
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className={`object-cover transform transition-transform duration-[6000ms] ease-in-out 
                    ${isActive ? "scale-110" : "group-hover:scale-110"}`}
                />
                <div
                  className={`absolute bottom-0 left-0 w-full h-[50%] bg-gradient-to-t from-orange-500/80 to-transparent 
                    transition-opacity duration-500
                    ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                />
                <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-6">
                  <div
                    className={`transform transition-transform duration-1000 
                      ${isActive ? "-translate-y-[5rem]" : "group-hover:-translate-y-[5rem]"}`}
                  >
                    <h3 className="text-white text-2xl md:text-3xl lg:text-[2.4rem] font-bold">
                      {card.title}
                    </h3>
                  </div>
                  <p
                    className={`transition-all duration-500 mt-4 text-lg md:text-xl text-white
                      ${isActive
                        ? "opacity-100 translate-y-[-2rem]"
                        : "opacity-0 group-hover:opacity-100 group-hover:translate-y-[-2rem]"}`}
                  >
                    {card.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
