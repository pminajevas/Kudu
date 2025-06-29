export default function WhyKudu() {
    return (
        <section className="flex flex-col lg:grid w-full min-h-[600px] lg:h-[975px] bg-[linear-gradient(180deg,_var(--background-secondary)_0%,_var(--background)_100%)] py-12 lg:py-0">
            <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-x-[10px] max-w-none xl:max-w-[90%] 2xl:max-w-[85%] mx-auto px-6 sm:px-12 lg:px-16 xl:px-20 2xl:px-24 w-full">
                <div className="flex flex-col justify-center order-2 lg:order-1">
                <h1 className="text-7xl sm:text-8xl lg:text-9xl font-bold mb-6 lg:mb-8 text-[color:var(--Primary,#2C3E50)] font-poppins text-center lg:text-left animate-fadeInLeft">Why Kudu?</h1>
                <ul className="space-y-4 lg:space-y-6 text-center lg:text-left max-w-md lg:max-w-none mx-auto lg:mx-0">
                    <li className="flex items-center gap-3 justify-center lg:justify-start animate-fadeInLeft hover:scale-105 transition-transform duration-300" style={{animationDelay: '0.1s'}}>
                        <span className="w-6 h-6 lg:w-7 lg:h-7 rounded-full bg-[color:var(--Primary,#2C3E50)] inline-block flex-shrink-0"></span>
                        <span className="text-2xl sm:text-3xl lg:text-4xl text-[color:var(--Primary,#2C3E50)] hover:text-[var(--secondary)] transition-all duration-300">Make group chat plans into a reality</span>
                    </li>
                    <li className="flex items-center gap-3 justify-center lg:justify-start animate-fadeInLeft hover:scale-105 transition-transform duration-300" style={{animationDelay: '0.2s'}}>
                        <span className="w-6 h-6 lg:w-7 lg:h-7 rounded-full bg-[color:var(--Primary,#2C3E50)] inline-block flex-shrink-0"></span>
                        <span className="text-2xl sm:text-3xl lg:text-4xl text-[color:var(--Primary,#2C3E50)] hover:text-[var(--secondary)] transition-all duration-300">Structured but fun scheduling</span>
                    </li>
                    <li className="flex items-center gap-3 justify-center lg:justify-start animate-fadeInLeft hover:scale-105 transition-transform duration-300" style={{animationDelay: '0.3s'}}>
                        <span className="w-6 h-6 lg:w-7 lg:h-7 rounded-full bg-[color:var(--Primary,#2C3E50)] inline-block flex-shrink-0"></span>
                        <span className="text-2xl sm:text-3xl lg:text-4xl text-[color:var(--Primary,#2C3E50)] hover:text-[var(--secondary)] transition-all duration-300">Gamified organization and participation</span>
                    </li>
                    <li className="flex items-center gap-3 justify-center lg:justify-start animate-fadeInLeft hover:scale-105 transition-transform duration-300" style={{animationDelay: '0.4s'}}>
                        <span className="w-6 h-6 lg:w-7 lg:h-7 rounded-full bg-[color:var(--Primary,#2C3E50)] inline-block flex-shrink-0"></span>
                        <span className="text-2xl sm:text-3xl lg:text-4xl text-[color:var(--Primary,#2C3E50)] hover:text-[var(--secondary)] transition-all duration-300">Friendly competition never hurt nobody</span>
                    </li>
                    <li className="flex items-center gap-3 justify-center lg:justify-start animate-fadeInLeft hover:scale-105 transition-transform duration-300" style={{animationDelay: '0.5s'}}>
                        <span className="w-6 h-6 lg:w-7 lg:h-7 rounded-full bg-[color:var(--Primary,#2C3E50)] inline-block flex-shrink-0"></span>
                        <span className="text-2xl sm:text-3xl lg:text-4xl text-[color:var(--Primary,#2C3E50)] hover:text-[var(--secondary)] transition-all duration-300">Builds memories, not just plans</span>
                    </li>
                </ul>
            </div>
            <div className="h-[300px] sm:h-[400px] lg:h-full w-full bg-[url('/why.png')] bg-no-repeat bg-[bottom_center] lg:bg-[bottom_right] bg-contain order-1 lg:order-2 animate-fadeInRight" />
            </div>
        </section>
    );
}