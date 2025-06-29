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

          <div className="animate-fadeInLeft" style={{ animationDelay: "0.4s" }}>
            <Button text="Join Now" />
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
