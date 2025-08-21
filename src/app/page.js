"use client";

import { useState, useEffect } from "react";
import { fetchWpPage,extractAttributeBlocks,getValue,fetchWpImageById } from "@/utils/wpAPI";

import HeroSection from "@/components/heroSection";
import SecondSection from "@/components/secondSection";
import Card from "@/components/cards";
import CompanyMission from "@/components/companyMission";
import VideoSection from "@/components/videoSection";
import TeamCards from "@/components/teamCards";
import Carousel from "@/components/carousel";
import BrandsSection from "@/components/brandSection";
import Footer from "@/components/footer/footer";


export default function Page() {
  const [bgUrl, setBgUrl] = useState(null);
  const [texts, setTexts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const page = await fetchWpPage(5909); 
        if (page?.content_html) {
          const extractedTexts = extractAttributeBlocks(page.content_html);
          setTexts(extractedTexts);
          console.log(extractedTexts)

          const bgImageId = getValue("bg_image", extractedTexts);
          if (bgImageId) {
            const bgData = await fetchWpImageById(bgImageId);
            if (bgData?.url) setBgUrl(bgData.url);
          }
        }
      } catch (err) {
        console.error("Error fetching WP page:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return <p className="text-center py-10">Loading...</p>;

  return (
    <main>
      <HeroSection bgUrl={bgUrl} texts={texts} />
      <SecondSection />
      <Card/>
      <CompanyMission texts={texts}/>
      <VideoSection />
      <TeamCards/>
      <Carousel/>
      <BrandsSection/>
   <Footer/>
    </main>
  );
}
