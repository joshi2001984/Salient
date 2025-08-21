"use client";
import { useState,useEffect } from "react";
import Link from "next/link";
import { fetchWpPage, extractAttributeBlocks, getValue} from "@/utils/wpApi";

export default function Footer() {
  const [texts, setTexts] = useState([]);
    const [loading, setLoading] = useState(true);

  useEffect(() => {
  async function loadData() {
    setLoading(true);
    try {
      const page = await fetchWpPage(5909); 
      if (page?.content_html) {
        const extracted = extractAttributeBlocks(page.content_html);
        setTexts(extracted);  // state update happens here
      }
    } catch (err) {
      console.error("Error fetching page data:", err);
    } finally {
      setLoading(false);
    }
  }

  loadData();
}, []);

// ✅ Log only after texts is updated
useEffect(() => {
  if (texts.length > 0) {
    console.log("Extracted texts:", texts);
    console.log("footer content (index 0):", getValue("text_content", texts, 7));
  }
}, [texts]);

    if(loading) return <p className="text-center py-10">Loading...</p>
  
  return (
    <footer className="bg-black text-white min-h-[60px]">
      {/* Top */}
      <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row items-center justify-between px-6 py-10 gap-6">
        <h2 className="text-3xl lg:text-[2.6rem] font-bold text-center lg:text-left max-w-[500px]">
         {getValue ("text_content", texts, 7) || "Enough Talk, Let's Build Something Together"}
        </h2>
        <button className="bg-orange-500 hover:bg-orange-600 text-white w-4xs h-15 px-6 py-3 rounded-full font-semibold flex items-center gap-2 transition-all duration-300 cursor-pointer">
          <span className="lg:text-[1.3rem] text-center">{getValue ("link_text", texts, 4)}</span>
        </button>
      </div>

      {/* LINE */}
      <div className="mx-auto mt-5 w-[90%] border-t border-gray-700"></div>

      {/* Bottom section */}
      <div className="max-w-[1200px]  mx-auto flex flex-wrap justify-start gap-16 px-6 py-10 text-sm">
        {/* Column 1 */}
        <div className="space-y-2 w-[400px] lg:text-[1.2rem] font-medium">
          <p>Copyright © 2019 Salient WordPress Theme.</p>
          <p>Built with love in New York</p>
          <p>All rights reserved.</p>
        </div>

        {/* Column 2 */}
        <div className="min-w-[150px]">
          <h3 className="text-orange-500 font-semibold mb-4 text-sm lg:text-[1rem]">Archives</h3>
          <ul className="space-y-2">
            {["August 2025", "September 2019", "July 2019", "April 2019", "March 2019", "February 2019"].map((item) => (
              <li key={item}>
                <Link href="#" className="relative group text-sm lg:text-[1.1rem]">
                  {item}
                  <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3 */}
        <div className="min-w-[150px]">
          <h3 className="text-orange-500 font-semibold mb-4 text-sm lg:text-[1rem]">Categories</h3>
          <ul className="space-y-2">
            {["Food for thought", "Gaming", "Music", "Uncategorized"].map((item) => (
              <li key={item}>
                <Link href="#" className="relative group text-sm lg:text-[1.1rem]">
                  {item}
                  <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4 */}
        <div className="min-w-[200px]">
          <h3 className="text-orange-500 font-semibold mb-4 text-sm lg:text-[1rem]">Recent Posts</h3>
          <ul className="space-y-2">
            {[
              "Hello world!",
              "Wake up and smell the roses",
              "Doing a cross country road trip",
              "We encountered a food paradise",
            ].map((item) => (
              <li key={item}>
                <Link href="#" className="relative group text-sm lg:text-[1.1rem]">
                  {item}
                  <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}