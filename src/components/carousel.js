'use client';
import React, { useState, useEffect } from 'react';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import { fetchWpPage, extractAttributeBlocks, getValue, fetchWpImageById } from '@/utils/wpApi';

export default function Carousel() {
  const [progress, setProgress] = useState(0);
  const [slides, setSlides] = useState([]);
  const [heading, setHeading] = useState('');
  const [loading, setLoading] = useState(true);

  // 1. Load WPBakery content
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const page = await fetchWpPage(5909);
        if (!page?.content_html) return;

        const blocks = extractAttributeBlocks(page.content_html);

        // Set heading
        setHeading(getValue('text_content', blocks, 5));

        // Get the 'images' attribute containing comma-separated image IDs
        const imagesString = getValue('images', blocks, 0); // Assuming 'images' is at index 0
        if (!imagesString) {
          setSlides(['/default.jpg']);
          return;
        }

        // Split the comma-separated string into an array of image IDs
        const imageIds = imagesString.split(',').map(id => id.trim());

        // Fetch image URLs for each ID
        const images = await Promise.all(
          imageIds.map(async (imageId) => {
            if (!imageId) return '/default.jpg';
            const imgData = await fetchWpImageById(imageId); 
            return imgData?.url || '/default.jpg';
          })
        );

        // Set slides with fetched images
        setSlides(images);
      } catch (err) {
        console.error('Failed to fetch carousel content:', err);
        setSlides(['/default.jpg']); // Fallback in case of error
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // 2. Keen Slider setup
  const [sliderRef] = useKeenSlider({
    slides: {
      perView: 'auto',
      spacing: 20,
    },
    slideChanged(slider) {
      const track = slider.track.details;
      const total = track.maxIdx;
      const current = track.rel;
      const percentage = (current / total) * 100;
      setProgress(percentage);
    },
  });

  if (loading) return <p className="text-center py-10">Loading carousel...</p>;

  return (
    <div>
      {/* Dynamic heading from WP */}
      <div className='flex justify-center'>
      <h1 className="text-3xl md:text-4xl text-black lg:text-[2.8rem] text-center font-bold mb-10 max-w-[800px]">
        {heading || 'A vibrant work culture that flows with creativity is our secret'}
      </h1>
</div>
      <div className="w-full max-w-[98%] mx-auto overflow-hidden">
        {/* Carousel */}
        <div ref={sliderRef} className="keen-slider overflow-hidden">
          {slides.map((src, idx) => (
            <div
              key={idx}
              className="keen-slider__slide overflow-hidden flex-shrink-0 !w-auto"
            >
              <img
                src={src}
                alt={`Slide ${idx + 1}`}
                className="object-cover h-[600px]"
              />
            </div>
          ))}
        </div>

        {/* Track Bar */}
        <div className="mt-5 mb-5 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-black transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}