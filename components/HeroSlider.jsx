"use client";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const slides = [
  {
    img: "/hero/slide-1.jpg",
    title: "A library that fits in your pocket",
    text: "Browse books shared by readers near you and borrow one in a few taps.",
  },
  {
    img: "/hero/slide-2.jpg",
    title: "Got books gathering dust?",
    text: "Add the books you have finished and let other readers enjoy them too.",
  },
  {
    img: "/hero/slide-3.jpg",
    title: "Borrow, read, return",
    text: "Pick a return date, enjoy the story and give it back with one click.",
  },
];

export default function HeroSlider() {
  return (
    <Swiper
      modules={[Autoplay, Pagination]}
      autoplay={{ delay: 5000, disableOnInteraction: false }}
      pagination={{ clickable: true }}
      loop
    >
      {slides.map((s) => (
        <SwiperSlide key={s.title}>
          <div
            className="relative flex h-[480px] items-center bg-cover bg-center md:h-[560px]"
            style={{ backgroundImage: `url(${s.img})` }}
          >
            <div className="absolute inset-0 bg-black/55" />
            <div className="relative mx-auto w-full max-w-7xl px-6">
              <p className="mb-4 text-sm font-semibold tracking-[0.3em] text-orange-400">BOOKNOOK</p>
              <h1 className="max-w-2xl font-serif text-4xl font-bold leading-tight text-white md:text-6xl">{s.title}</h1>
              <p className="mt-4 max-w-xl text-lg text-white/85">{s.text}</p>
              <Link href="/books" className="btn mt-6 border-0 bg-[#1e5631] text-white hover:bg-[#17432a]">
                Browse Books
              </Link>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}