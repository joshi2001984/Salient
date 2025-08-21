"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { fetchWpPage, extractAttributeBlocks, getValue, fetchWpImageByValue } from "@/utils/wpApi";
import Wrapper from "../components/wrapping/wrapper";

export default function SecondSection() {
  const [texts, setTexts] = useState([]);
  const [sectionImage, setSectionImage] = useState({ url: "/section2.jpg", alt: "" });
  const [feedbackImg, setFeedbachImg] = useState({ url: "/philimg.jpg", alt: "image of Phil Martinez" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const page = await fetchWpPage(5909);
        if (page?.content_html) {
          const extracted = extractAttributeBlocks(page.content_html);
          console.log("Extracted blocks:", extracted);
          setTexts(extracted);

          // Section main image
          const imageVal = getValue("image", extracted, 1);
          const imgData = await fetchWpImageByValue(imageVal);
          setSectionImage(imgData);

          // Find Phil's image key properly
          const philImage = getValue("image", extracted, 2);
          const philImageData = await fetchWpImageByValue(philImage);
          setFeedbachImg(philImageData);
        }
      } catch (err) {
        console.error("Error fetching page data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) return <p className="text-center py-10">Loading...</p>;

  return (
    <section className="w-full bg-white mt-29 mb-20 max-w-[90%] mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="relative w-full md:w-[80%] h-[250px] sm:h-[300px] md:h-auto mx-auto md:ml-0"
      >
        <img
          src={sectionImage.url || "/section2.jpg"}
          alt={sectionImage.alt || "Section Image"}
          className="object-cover w-full h-full shadow-lg"
        />
        {/* dark fade overlay */}
        <div className="absolute inset-0 bg-black opacity-20 rounded-lg pointer-events-none"></div>
      </motion.div>

      {/* Right Text */}
      <div className="flex flex-col justify-center px-6 py-10 md:px-12">
        <Wrapper delay={0.3}>
          <h2 className="text-3xl md:text-4xl lg:text-[2.8rem] font-bold text-black max-w-[450px]">
            {getValue("text_content", texts, 1)}
          </h2>
        </Wrapper>

        <Wrapper delay={0.4}>
          <p className="mt-5 text-gray-700 lg:text-[1.2rem] max-w-[450px]">
            {getValue("inner_text", texts, 0)}
          </p>
        </Wrapper>

        <Wrapper delay={0.5}>
          <a
            href={getValue("link_url", texts, 0) || "#services"}
            className="mt-6 inline-block font-bold text-orange-500 hover:underline"
          >
            {getValue("link_text", texts, 1)}
          </a>
        </Wrapper>

        <hr className="my-8 border-gray-200 w-full" />

        <Wrapper delay={0.6} noOverflow>
          <blockquote className="italic text-gray-800 font-bold max-w-[300px]">
            {getValue("quote", texts, 0) || "I had a great experience with Salient from start to finish."}
          </blockquote>
        </Wrapper>

        <Wrapper delay={0.7} noOverflow>
          <div className="flex items-center mt-6 gap-3">
            <div className="w-[50px] h-[50px] rounded-full overflow-hidden">
              <Image
                src={feedbackImg.url || "/philimg.jpg"}
                alt="Phil Martinez"
                width={50}
                height={50}
                className="object-cover"
              />
            </div>
            <div>
              <p className="font-semibold">{getValue("name", texts, 0) || "Phil Martinez"}</p>
              <p className="text-gray-500 text-sm">
                {getValue("subtitle", texts, 0) || "Designer, Owl Eyes"}
              </p>
            </div>
          </div>
        </Wrapper>
      </div>
    </section>
  );
}