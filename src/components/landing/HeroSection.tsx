import Button from '@/components/landing/Button';
import TypingAnimation from '@/components/TypingAnimation';

export default function HeroSection() {
    return (
        <section className="flex min-h-[600px] sm:min-h-[800px] lg:min-h-[975px] w-full bg-[color:var(--Background)] relative overflow-hidden">
            {/* Grid Layout */}
            <div className="flex flex-col lg:grid lg:grid-cols-2 w-full max-w-none xl:max-w-[90%] 2xl:max-w-[85%] mx-auto px-6 sm:px-12 lg:px-16 xl:px-20 2xl:px-24 relative z-10">
                {/* Text Content - Left Side */}
                <div className="flex flex-col justify-center items-center lg:items-start text-center lg:text-left pt-20 sm:pt-32 lg:pt-20 pb-12 lg:pb-20 lg:order-1">
                    <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white font-poppins mb-6 lg:mb-8 leading-tight animate-fadeInLeft">
                        <TypingAnimation 
                            text="Plan activities with your Friends" 
                            speed={80}
                        />
                    </h1>
                    <h2 className="text-lg sm:text-xl lg:text-2xl text-gray-200 mb-8 lg:mb-12 max-w-md lg:max-w-lg leading-relaxed animate-fadeInLeft" style={{animationDelay: '0.2s'}}>
                        Easily create and organize events for your friend group.
                    </h2>
                    <div className="flex justify-center lg:justify-start animate-fadeInLeft" style={{animationDelay: '0.4s'}}>
                        <Button />
                    </div>
                </div>
                
                {/* Image - Right Side - Hidden on mobile/tablet */}
                <div className="hidden lg:flex items-center justify-center lg:justify-end pt-20 pb-20 lg:order-2">
                    <div className="w-full max-w-4xl xl:max-w-5xl 2xl:max-w-6xl animate-fadeInRight">
                        <img 
                            src="/heroSection.png" 
                            alt="Plan activities with friends" 
                            className="w-full h-auto object-contain drop-shadow-2xl"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}