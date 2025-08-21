"use client";

import { useState, useEffect } from "react";
import Wrapper from "../components/wrapping/wrapper";
import { fetchWpPage, extractAttributeBlocks, getValue } from "@/utils/wpApi";

export default function BrandsSection() {
  const [texts, setTexts] = useState([]); 
  const [logos, setLogos] = useState([]); 
  const [loading, setLoading] = useState(true);

useEffect(() => {
  async function loadData() {
    try {
      setLoading(true);
      const page = await fetchWpPage(5909); 
      if (page?.content_html) {
        const extracted = extractAttributeBlocks(page.content_html);
        setTexts(extracted);

        // Take logos from index 55 to 64
        const logosArray = extracted
          .slice(55, 65)
          .map(item => {
            const url = item.value?.replace(/\\/g, ""); // remove escaped slashes
            return url || "/salient.png";              // fallback URL
          });

        setLogos(logosArray);
      }
    } catch (err) {
      console.error("Error fetching Brands section:", err);

      // fallback in case of network failure
      setLogos(Array(10).fill("/salient.png"));
    } finally {
      setLoading(false);
    }
  }

  loadData();
}, []);

  if (loading) return <p className="text-center py-10">Loading...</p>;

  return (
    <Wrapper delay={0.6} noOverflow>
      <section className="px-6 py-16 bg-white mt-[5rem] mb-[2rem]">
      
        <div className="max-w-6xl mx-auto mb-20 ">
          <h2 className="text-3xl lg:text-[2.8rem] sm:text-4xl font-bold text-black text-left max-w-[550px] ">
            {getValue("text_content", texts, 6) || "We've worked with some of the biggest brands"}
          </h2>
        </div>

        
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-5 gap-x-8 gap-y-8">
          {logos.map((url, index) => (
            <Wrapper key={index} delay={0.1 * index} noOverflow>
              <div className="flex items-center justify-center bg-transparent shadow-none hover:scale-105 transition-transform duration-300">
                <img
                  src={url}
                  alt={`Brand logo ${index + 1}`}
                  className="max-h-18 w-auto object-contain"
                />
              </div>
            </Wrapper>
          ))}
        </div>
      </section>
    </Wrapper>
  );
}
