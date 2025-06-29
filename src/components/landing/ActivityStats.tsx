export default function ActivityStats() {
    return (
        <section className="py-16 lg:py-20 bg-[linear-gradient(180deg,_var(--background)_0%,_var(--background-secondary)_100%)]">
            <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 xl:px-20">
                <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold text-center mb-12 lg:mb-16 text-[color:var(--Primary,#2C3E50)] font-poppins animate-fadeInUp">
                    Activity
                </h1>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                    {/* Activities Planned */}
                    <div className="text-center animate-fadeInUp" style={{animationDelay: '0.1s'}}>
                        <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-3 lg:mb-4 text-[color:var(--Primary,#2C3E50)]">
                            Activities<br />Planned
                        </h3>
                        <h3 className="text-5xl sm:text-6xl lg:text-7xl font-black text-[color:var(--Primary,#2C3E50)] count-up">
                            100+
                        </h3>
                    </div>
                    
                    {/* Groups Created */}
                    <div className="text-center animate-fadeInUp" style={{animationDelay: '0.2s'}}>
                        <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-3 lg:mb-4 text-[color:var(--Primary,#2C3E50)]">
                            Groups<br />Created
                        </h3>
                        <h3 className="text-5xl sm:text-6xl lg:text-7xl font-black text-[color:var(--Primary,#2C3E50)] count-up">
                            20+
                        </h3>
                    </div>
                    
                    {/* Points Earned */}
                    <div className="text-center animate-fadeInUp" style={{animationDelay: '0.3s'}}>
                        <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-3 lg:mb-4 text-[color:var(--Primary,#2C3E50)]">
                            Points<br />Earned
                        </h3>
                        <h3 className="text-5xl sm:text-6xl lg:text-7xl font-black text-[color:var(--Primary,#2C3E50)] count-up">
                            3K+
                        </h3>
                    </div>
                    
                    {/* Monthly Active Users */}
                    <div className="text-center animate-fadeInUp" style={{animationDelay: '0.4s'}}>
                        <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-3 lg:mb-4 text-[color:var(--Primary,#2C3E50)]">
                            Monthly<br />Active Users
                        </h3>
                        <h3 className="text-5xl sm:text-6xl lg:text-7xl font-black text-[color:var(--Primary,#2C3E50)] count-up">
                            100+
                        </h3>
                    </div>
                </div>
            </div>
        </section>
    );
}
