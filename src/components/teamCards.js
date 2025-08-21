"use client";
import { useState, useEffect } from "react";
import he from "he";
import { fetchWpPage, extractAttributeBlocks, getValue } from "@/utils/wpApi";

export default function TeamCards() {
  const [extractedTexts, setExtractedTexts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWPContent() {
      setLoading(true);
      try {
        const page = await fetchWpPage(5909);
        if (!page?.content_html) return;

        const extracted = extractAttributeBlocks(page.content_html);
        setExtractedTexts(extracted);
      } catch (err) {
        console.error("Failed to load WP content:", err);
      } finally {
        setLoading(false);
      }
    }
    loadWPContent();
  }, []);

  if (loading) return <p className="text-center py-10">Loading team...</p>;

  const headingText = he.decode(
    getValue("text_content", extractedTexts, 4) ||
      "Our team is comprised of genuinely gifted minds"
  );

  // Split heading at "of" for line break
  const formatHeading = (text) => {
    const parts = text.split(" of ");
    if (parts.length > 1) {
      return (
        <>
          {parts[0]} <br /> of {parts[1]}
        </>
      );
    }
    return text; // Return original text if "of" is not found
  };

  // Fetch team members data (6 members)
  const teamMembers = Array.from({ length: 6 }).map((_, idx) => ({
    img: getValue("image_id", extractedTexts, idx)
      ? `/api/fetch-image/${getValue("image_id", extractedTexts, idx)}`
      : `/team${idx + 1}.jpg`,
    name: getValue("name", extractedTexts, idx) || `Member ${idx + 2}`,
    role: getValue("job_position", extractedTexts, idx) || "Role",
    desc: getValue("team_member_mini_bio", extractedTexts, idx) || "Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.",
  }));

  // Split team members into three columns (2 members each)
  const column1 = teamMembers.slice(0, 2); // Members 1, 2
  const column2 = teamMembers.slice(2, 4); // Members 3, 4
  const column3 = teamMembers.slice(4, 6); // Members 5, 6

  return (
    <section className="max-w-[80%] mx-auto px-4 py-20 overflow-visible">
      {/* Main Container */}
      <div>
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold mb-10 text-left lg:text-[2.8rem] text-black">
          {formatHeading(headingText)}
        </h2>

        {/* Three Columns */}
        <div className="flex flex-col md:flex-row justify-between gap-8 mt-25">
          {/* Column 1 */}
          <div className="flex flex-col gap-12 w-full md:w-[30%]">
            {column1.map((member, idx) => (
              <TeamCard key={idx} {...member} />
            ))}
          </div>

          {/* Column 2 - Translated Up */}
          <div className="flex flex-col gap-12 w-full md:w-[30%] md:-translate-y-20">
            {column2.map((member, idx) => (
              <TeamCard key={idx} {...member} />
            ))}
          </div>

          {/* Column 3 */}
          <div className="flex flex-col gap-12 w-full md:w-[30%]">
            {column3.map((member, idx) => (
              <TeamCard key={idx} {...member} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TeamCard({ img, name, role, desc }) {
  const formatDescription = (text) => {
    const words = text.split(" ");
    if (words.length > 8) {
      return (
        <>
          {words.slice(0, 8).join(" ")} <br />
          {words.slice(8).join(" ")}
        </>
      );
    }
    return text;
  };

  return (
    <div className="flex flex-col items-start gap-4">
      <div className="w-full aspect-[3/4] relative group transition-all duration-300 hover:scale-95 overflow-hidden ">
        <img
          src={img}
          alt={name}
          className="object-cover w-98 h-full transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <p className="text-sm text-black lg:text-lg">{role}</p>
      <h3 className="font-semibold text-black text-xl lg:text-2xl">{name}</h3>
      <p className="text-sm text-black lg:text-lg">{formatDescription(desc)}</p>
      <span className="text-black font-bold mt-1 inline-block">→</span>
    </div>
  );
}

// "use client";
// import { useRef, useEffect, useState } from "react";
// import Image from "next/image";
// import { fetchWpPage, extractAttributeBlocks, getValue, fetchWpImageById } from "@/utils/wpApi";

// export default function TeamSection() {
//   const [extractedTexts, setExtractedTexts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const videoRef = useRef(null);

//   useEffect(() => {
//     if (videoRef.current) videoRef.current.loop = true;
//   }, []);

//   const formatDescription = (desc) => {
//     const words = desc.split(" ");
//     if (words.length > 8) {
//       return (
//         <>
//           {words.slice(0, 8).join(" ")} <br />
//           {words.slice(8).join(" ")}
//         </>
//       );
//     }
//     return desc;
//   };

//   // Fetch WPBakery page content
//   useEffect(() => {
//     async function loadWPContent() {
//       setLoading(true);
//       try {
//         const page = await fetchWpPage(5909); // Replace with your page ID
//         if (!page?.content_html) return;

//         const extracted = extractAttributeBlocks(page.content_html);
//         setExtractedTexts(extracted);
//       } catch (err) {
//         console.error("Failed to load WP content:", err);
//       } finally {
//         setLoading(false);
//       }
//     }

//     loadWPContent();
//   }, []);

//   if (loading) return <p className="text-center py-10">Loading team...</p>;

//   // Fetch dynamic image URLs
//   const getImageUrl = async (id, defaultImg) => {
//     if (!id) return defaultImg;
//     const imgData = await fetchWpImageById(parseInt(id, 10));
//     return imgData?.url || defaultImg;
//   };

//   // Get WPBakery values manually for 6 team members
//   const team1 = {
//     img: getValue("image_id", extractedTexts, 0) || "/team1.jpg",
//     name: getValue("name", extractedTexts, 0) || "James Warren",
//     role: getValue("role", extractedTexts, 0) || "CEO, Founder",
//     desc: getValue("desc", extractedTexts, 0) || "Far far away, behind the word mountains, far from the countries Vokalia and Consonantia."
//   };
//   const team2 = {
//     img: getValue("image_id", extractedTexts, 1) || "/team2.jpg",
//     name: getValue("name", extractedTexts, 1) || "Zachary Miller",
//     role: getValue("role", extractedTexts, 1) || "Designer",
//     desc: getValue("desc", extractedTexts, 1) || "Far far away, behind the word mountains, far from the countries Vokalia and Consonantia."
//   };
//   const team3 = {
//     img: getValue("image_id", extractedTexts, 2) || "/team3.jpg",
//     name: getValue("name", extractedTexts, 2) || "Kara Lucas",
//     role: getValue("role", extractedTexts, 2) || "UX Designer",
//     desc: getValue("desc", extractedTexts, 2) || "Far far away, behind the word mountains, far from the countries Vokalia and Consonantia."
//   };
//   const team4 = {
//     img: getValue("image_id", extractedTexts, 3) || "/team4.jpg",
//     name: getValue("name", extractedTexts, 3) || "Corey Williams",
//     role: getValue("role", extractedTexts, 3) || "Developer",
//     desc: getValue("desc", extractedTexts, 3) || "Far far away, behind the word mountains, far from the countries Vokalia and Consonantia."
//   };
//   const team5 = {
//     img: getValue("image_id", extractedTexts, 4) || "/team5.jpg",
//     name: getValue("name", extractedTexts, 4) || "Daniel Wilson",
//     role: getValue("role", extractedTexts, 4) || "Art Director",
//     desc: getValue("desc", extractedTexts, 4) || "Far far away, behind the word mountains, far from the countries Vokalia and Consonantia."
//   };
//   const team6 = {
//     img: getValue("image_id", extractedTexts, 5) || "/team6.jpg",
//     name: getValue("name", extractedTexts, 5) || "Sophia Johnson",
//     role: getValue("role", extractedTexts, 5) || "Marketing",
//     desc: getValue("desc", extractedTexts, 5) || "Far far away, behind the word mountains, far from the countries Vokalia and Consonantia."
//   };

//   return (
//     <>
//       {/* Video Hero Section */}
//       <section className="relative w-full h-[80vh] min-h-[600px] overflow-hidden">
//         <video
//           ref={videoRef}
//           autoPlay
//           muted
//           playsInline
//           className="absolute inset-0 w-full h-full object-cover"
//         >
//           <source src="/salientvideo.mp4" type="video/mp4" />
//         </video>
//         <div className="absolute inset-0 bg-black/30" />
//         <div className="relative z-10 h-full flex flex-col justify-center items-center max-w-[1200px] mx-auto px-6 sm:px-8">
//           <button className="group transition-transform duration-300 hover:scale-110 mb-4">
//             <svg
//               className="w-20 h-20 text-white hover:text-orange-400 duration-300"
//               viewBox="0 0 600 800"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 fill="currentColor"
//                 d="M0-1.79v800L600,395L0-1.79z"
//                 className="group-hover:fill-orange-400 transition-colors duration-300"
//               />
//             </svg>
//           </button>
//           <h2 className="text-4xl sm:text-5xl md:text-5xl font-bold text-white text-center">
//             See What We're About
//           </h2>
//         </div>
//       </section>

//       {/* Team Section */}
//       <section className="max-w-[90%] mx-auto px-4 py-20 overflow-visible">
//         <h2 className="text-2xl font-bold mb-10 text-left lg:text-[2.8rem] text-black">
//           {getValue("text_content", extractedTexts, 4)}
//         </h2>

//         <div className="flex flex-col md:flex-row justify-between gap-8">
//           {/* Column 1 */}
//           <div className="flex flex-col gap-12 w-full md:w-[30%]">
//             <TeamCard {...team1} />
//             <TeamCard {...team2} />
//           </div>

//           {/* Column 2 - Translated Up */}
//           <div className="flex flex-col gap-12 w-full md:w-[30%] md:-translate-y-20">
//             <TeamCard {...team3} />
//             <TeamCard {...team4} />
//           </div>

//           {/* Column 3 */}
//           <div className="flex flex-col gap-12 w-full md:w-[30%]">
//             <TeamCard {...team5} />
//             <TeamCard {...team6} />
//           </div>
//         </div>
//       </section>
//     </>
//   );
// }

// function TeamCard({ img, name, role, desc }) {
//   const formatDescription = (text) => {
//     const words = text.split(" ");
//     if (words.length > 8) {
//       return (
//         <>
//           {words.slice(0, 8).join(" ")} <br />
//           {words.slice(8).join(" ")}
//         </>
//       );
//     }
//     return text;
//   };

//   return (
//     <div className="flex flex-col items-start gap-4 mt-25">
//       <div className="w-full aspect-[3/4] relative group transition-all duration-300 hover:scale-95 overflow-hidden">
//         {/* <Image
//           src={img}
//           alt={name}
//           fill
//           className="object-cover transition-transform duration-500 group-hover:scale-110"
//           sizes="(max-width: 768px) 100vw, 33vw"
//         /> */}
//       </div>
//       <p className="text-sm text-black lg:text-lg">{role}</p>
//       <h3 className="font-semibold text-black text-xl lg:text-2xl">{name}</h3>
//       <p className="text-sm text-black lg:text-lg">{formatDescription(desc)}</p>
//     </div>
//   );
// }

