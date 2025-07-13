import TypingAnimation from "@/components/TypingAnimation";
import Button from "@/components/landing/Button";

export default function CallToAction() {
  return (
    <section className="py-20 lg:py-32 bg-[linear-gradient(180deg,_var(--background-secondary)_0%,_var(--background)_100%)]">
      <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 max-w-5xl xl:max-w-[70%] 2xl:max-w-[65%] mx-auto px-6 sm:px-12 lg:px-16 xl:px-20 2xl:px-24 w-full">
        {/* Text Content */}
        <div className="flex-1 text-center lg:text-left">
          <h1 className="text-7xl sm:text-8xl lg:text-9xl xl:text-[10rem] font-bold mb-12 lg:mb-16 text-[var(--primary)] font-poppins leading-tight animate-fadeInLeft">
            <TypingAnimation text="Be the Friend Who Makes Things Happen!" speed={80} />
          </h1>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fadeInLeft" style={{ animationDelay: "0.4s" }}>
            <Button text="Join Now" />
            <a
              href="/marketplace"
              className="rounded-[30px] w-[300px] h-[100px] bg-white/20 backdrop-blur-sm border-2 border-[var(--secondary)] hover:bg-[var(--secondary)] hover:border-[var(--primary)] transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[var(--secondary)] focus:ring-opacity-50 relative overflow-hidden group cursor-pointer flex items-center justify-center"
            >
              <span className="text-[var(--secondary)] group-hover:text-white text-[24px] sm:text-[28px] font-semibold relative z-10 group-hover:scale-105 transition-all duration-300">
                Browse Presidents
              </span>
            </a>
          </div>
        </div>

        {/* Image */}
        <div className="flex-1 flex justify-center lg:justify-end">
          <div className="w-full max-w-md lg:max-w-lg xl:max-w-xl animate-fadeInRight">
            <img src="/goodfriend.png" alt="Be the friend who makes things happen" className="w-full h-auto object-contain" />
          </div>
        </div>
      </div>
    </section>
  );
}
