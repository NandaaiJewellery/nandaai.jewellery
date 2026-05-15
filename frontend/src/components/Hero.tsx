import { motion } from "framer-motion";
import banner from "@/assets/hero_banner.png";

export default function Hero() {
  return (
    <section className="w-full min-h-[85vh] flex flex-col lg:flex-row bg-[#f6f2ec]">
      <div className="w-full lg:w-2/5 px-6 md:px-12 lg:px-16 py-16 z-10">
        <motion.p
          className="text-sm tracking-[0.35em] uppercase text-amber-800/80 font-medium mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Imitation Jewellery
        </motion.p>

        <motion.h1
          className="font-serif text-4xl md:text-6xl text-[#2c2416] font-light leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          Timeless <span className="text-[#7c2d12] italic">Tradition</span>
        </motion.h1>

        <motion.p
          className="mt-6 text-[#5c4d3a] text-lg max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          Celebrate elegance rooted in culture, to elevate every moment.
        </motion.p>

        <motion.div
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <a
            href="#products"
            className="inline-block px-8 py-3 rounded-full bg-[#7c2d12] text-white text-sm tracking-wide hover:bg-[#5c1f0e] transition"
          >
            Explore Collection
          </a>
        </motion.div>
      </div>

      <div className="w-full lg:w-3/5 relative h-[50vh] lg:h-auto">
        <img
          src={banner}
          alt="Jewellery Collection"
          className="w-full h-full object-cover object-[70%_center] lg:object-[25%_center]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#f6f2ec] via-transparent to-transparent lg:bg-gradient-to-l lg:from-transparent lg:via-[#f6f2ec]/10 lg:to-[#f6f2ec]" />
      </div>
    </section >
  );
}
