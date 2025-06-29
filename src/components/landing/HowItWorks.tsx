export default function HowItWorks() {
    return (
        <section className="flex flex-col items-center py-20 bg-[linear-gradient(180deg,_var(--background)_0%,_var(--background-secondary)_100%)]">
            <h1 className="text-4xl font-bold mb-12 text-center text-[color:var(--Primary,#2C3E50)] font-poppins">
                How Kudu Works
            </h1>
            
            {/* Steps layout - responsive design */}
            <div className="w-full max-w-none xl:max-w-[95%] 2xl:max-w-[90%] mx-auto px-6 sm:px-12 lg:px-16 xl:px-20 2xl:px-24">
                {/* Mobile to large screens: Use grid layout */}
                <div className="min-[1600px]:hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {/* Step 1 */}
                        <div className="group flex flex-col items-center text-center border-2 rounded-[30px] border-[color:var(--Primary,#2C3E50)] bg-white aspect-square w-full max-w-[400px] mx-auto p-8 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer hover:border-opacity-80">
                            <div className="flex items-start w-full mb-4 lg:mb-6">
                                <span className="text-5xl sm:text-6xl lg:text-7xl text-[color:var(--Primary,#2C3E50)] font-bold mr-2 sm:mr-3 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">1.</span>
                                <span className="text-xl sm:text-2xl lg:text-3xl text-[color:var(--Primary,#2C3E50)] font-bold leading-tight group-hover:text-opacity-80 transition-all duration-300">Create or Join Group</span>
                            </div>
                            <div className="flex-1 flex items-end w-full min-h-0">
                                <img
                                    src="/joinGroup.png"
                                    alt="Create or Join Group"
                                    className="w-full h-auto max-h-[200px] lg:max-h-[250px] object-contain group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                        </div>
                        
                        {/* Step 2 */}
                        <div className="group flex flex-col items-center text-center border-2 rounded-[30px] border-[color:var(--Primary,#2C3E50)] bg-white aspect-square w-full max-w-[400px] mx-auto p-8 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer hover:border-opacity-80">
                            <div className="flex items-start w-full mb-4 lg:mb-6">
                                <span className="text-5xl sm:text-6xl lg:text-7xl text-[color:var(--Primary,#2C3E50)] font-bold mr-2 sm:mr-3 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">2.</span>
                                <span className="text-xl sm:text-2xl lg:text-3xl text-[color:var(--Primary,#2C3E50)] font-bold leading-tight group-hover:text-opacity-80 transition-all duration-300">Random Organizer Nominated</span>
                            </div>
                            <div className="flex-1 flex items-end w-full min-h-0">
                                <img
                                    src="/nominate.png"
                                    alt="Random Organizer Nominated"
                                    className="w-full h-auto max-h-[200px] lg:max-h-[250px] object-contain group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                        </div>
                        
                        {/* Step 3 */}
                        <div className="group flex flex-col items-center text-center border-2 rounded-[30px] border-[color:var(--Primary,#2C3E50)] bg-white aspect-square w-full max-w-[400px] mx-auto p-8 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer hover:border-opacity-80">
                            <div className="flex items-start w-full mb-4 lg:mb-6">
                                <span className="text-5xl sm:text-6xl lg:text-7xl text-[color:var(--Primary,#2C3E50)] font-bold mr-2 sm:mr-3 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">3.</span>
                                <span className="text-xl sm:text-2xl lg:text-3xl text-[color:var(--Primary,#2C3E50)] font-bold leading-tight group-hover:text-opacity-80 transition-all duration-300">Organizer Creates Activities</span>
                            </div>
                            <div className="flex-1 flex items-end w-full min-h-0">
                                <img
                                    src="/planning.png"
                                    alt="Organizer Creates Activities"
                                    className="w-full h-auto max-h-[200px] lg:max-h-[250px] object-contain group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                        </div>
                        
                        {/* Step 4 */}
                        <div className="group flex flex-col items-center text-center border-2 rounded-[30px] border-[color:var(--Primary,#2C3E50)] bg-white aspect-square w-full max-w-[400px] mx-auto p-8 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer hover:border-opacity-80">
                            <div className="flex items-start w-full mb-4 lg:mb-6">
                                <span className="text-5xl sm:text-6xl lg:text-7xl text-[color:var(--Primary,#2C3E50)] font-bold mr-2 sm:mr-3 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">4.</span>
                                <span className="text-xl sm:text-2xl lg:text-3xl text-[color:var(--Primary,#2C3E50)] font-bold leading-tight group-hover:text-opacity-80 transition-all duration-300">Receive Points for Activities</span>
                            </div>
                            <div className="flex-1 flex items-end w-full min-h-0">
                                <img
                                    src="/awardPoints.png"
                                    alt="Receive Points for Activities"
                                    className="w-full h-auto max-h-[200px] lg:max-h-[250px] object-contain group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                        </div>
                        
                        {/* Step 5 */}
                        <div className="group flex flex-col items-center text-center border-2 rounded-[30px] border-[color:var(--Primary,#2C3E50)] bg-white aspect-square w-full max-w-[400px] mx-auto p-8 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer hover:border-opacity-80">
                            <div className="flex items-start w-full mb-4 lg:mb-6">
                                <span className="text-5xl sm:text-6xl lg:text-7xl text-[color:var(--Primary,#2C3E50)] font-bold mr-2 sm:mr-3 flex-shrink-0">5.</span>
                                <span className="text-xl sm:text-2xl lg:text-3xl text-[color:var(--Primary,#2C3E50)] font-bold leading-tight">Compete in the Leaderboard</span>
                            </div>
                            <div className="flex-1 flex items-end w-full min-h-0">
                                <img
                                    src="/leaderboard.png"
                                    alt="Compete in the Leaderboard"
                                    className="w-full h-auto max-h-[200px] lg:max-h-[250px] object-contain"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Large screens 1600px+: Two row layout (3+2) */}
                <div className="hidden min-[1600px]:block">
                    {/* First row: 3 steps, centered with consistent gaps */}
                    <div className="flex justify-center gap-12 mb-8">
                        {/* Step 1 */}
                        <div className="flex flex-col items-center text-center border-2 rounded-[30px] border-[color:var(--Primary,#2C3E50)] bg-white aspect-square w-full max-w-[350px] p-8 shadow-lg">
                            <div className="flex items-start w-full mb-6">
                                <span className="text-6xl text-[color:var(--Primary,#2C3E50)] font-bold mr-3 flex-shrink-0">1.</span>
                                <span className="text-2xl text-[color:var(--Primary,#2C3E50)] font-bold leading-tight">Create or Join Group</span>
                            </div>
                            <div className="flex-1 flex items-end w-full min-h-0">
                                <img
                                    src="/joinGroup.png"
                                    alt="Create or Join Group"
                                    className="w-full h-auto max-h-[220px] object-contain"
                                />
                            </div>
                        </div>
                        
                        {/* Step 2 */}
                        <div className="flex flex-col items-center text-center border-2 rounded-[30px] border-[color:var(--Primary,#2C3E50)] bg-white aspect-square w-full max-w-[350px] p-8 shadow-lg">
                            <div className="flex items-start w-full mb-6">
                                <span className="text-6xl text-[color:var(--Primary,#2C3E50)] font-bold mr-3 flex-shrink-0">2.</span>
                                <span className="text-2xl text-[color:var(--Primary,#2C3E50)] font-bold leading-tight">Random Organizer Nominated</span>
                            </div>
                            <div className="flex-1 flex items-end w-full min-h-0">
                                <img
                                    src="/nominate.png"
                                    alt="Random Organizer Nominated"
                                    className="w-full h-auto max-h-[220px] object-contain"
                                />
                            </div>
                        </div>
                        
                        {/* Step 3 */}
                        <div className="flex flex-col items-center text-center border-2 rounded-[30px] border-[color:var(--Primary,#2C3E50)] bg-white aspect-square w-full max-w-[350px] p-8 shadow-lg">
                            <div className="flex items-start w-full mb-6">
                                <span className="text-6xl text-[color:var(--Primary,#2C3E50)] font-bold mr-3 flex-shrink-0">3.</span>
                                <span className="text-2xl text-[color:var(--Primary,#2C3E50)] font-bold leading-tight">Organizer Creates Activities</span>
                            </div>
                            <div className="flex-1 flex items-end w-full min-h-0">
                                <img
                                    src="/planning.png"
                                    alt="Organizer Creates Activities"
                                    className="w-full h-auto max-h-[220px] object-contain"
                                />
                            </div>
                        </div>
                    </div>
                    
                    {/* Second row: 2 steps, centered with consistent gaps */}
                    <div className="flex justify-center gap-12">
                        {/* Step 4 */}
                        <div className="flex flex-col items-center text-center border-2 rounded-[30px] border-[color:var(--Primary,#2C3E50)] bg-white aspect-square w-full max-w-[350px] p-8 shadow-lg">
                            <div className="flex items-start w-full mb-6">
                                <span className="text-6xl text-[color:var(--Primary,#2C3E50)] font-bold mr-3 flex-shrink-0">4.</span>
                                <span className="text-2xl text-[color:var(--Primary,#2C3E50)] font-bold leading-tight">Receive Points for Activities</span>
                            </div>
                            <div className="flex-1 flex items-end w-full min-h-0">
                                <img
                                    src="/awardPoints.png"
                                    alt="Receive Points for Activities"
                                    className="w-full h-auto max-h-[220px] object-contain"
                                />
                            </div>
                        </div>
                        
                        {/* Step 5 */}
                        <div className="flex flex-col items-center text-center border-2 rounded-[30px] border-[color:var(--Primary,#2C3E50)] bg-white aspect-square w-full max-w-[350px] p-8 shadow-lg">
                            <div className="flex items-start w-full mb-6">
                                <span className="text-6xl text-[color:var(--Primary,#2C3E50)] font-bold mr-3 flex-shrink-0">5.</span>
                                <span className="text-2xl text-[color:var(--Primary,#2C3E50)] font-bold leading-tight">Compete in the Leaderboard</span>
                            </div>
                            <div className="flex-1 flex items-end w-full min-h-0">
                                <img
                                    src="/leaderboard.png"
                                    alt="Compete in the Leaderboard"
                                    className="w-full h-auto max-h-[220px] object-contain"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}