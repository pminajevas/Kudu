export default function Footer() {
    return (
        <footer className="bg-[color:var(--Primary,#2C3E50)] text-white py-12 lg:py-16 animate-fadeInUp">
            <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 xl:px-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
                    {/* Brand Section */}
                    <div className="text-center md:text-left animate-fadeInLeft">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white font-poppins mb-4 hover-scale cursor-pointer transition-all duration-300">
                            Kudu
                        </h1>
                        <p className="text-gray-300 text-lg lg:text-xl max-w-md mx-auto md:mx-0 hover:text-white transition-colors duration-300">
                            Plan activities with your friends and make things happen!
                        </p>
                    </div>
                    
                    {/* Links Section */}
                    <div className="text-center animate-fadeInUp" style={{animationDelay: '0.2s'}}>
                        <h3 className="text-xl lg:text-2xl font-semibold mb-4 lg:mb-6 text-[color:var(--Primary,#2C3E50)]">Legal</h3>
                        <div className="space-y-3 lg:space-y-4">
                            <p className="text-gray-300 hover:text-white cursor-pointer transition-all duration-300 text-lg lg:text-xl hover-scale hover:transform hover:scale-105">
                                Terms & Conditions
                            </p>
                            <p className="text-gray-300 hover:text-white cursor-pointer transition-all duration-300 text-lg lg:text-xl hover-scale hover:transform hover:scale-105">
                                Privacy Policy
                            </p>
                        </div>
                    </div>
                    
                    {/* Contact Section */}
                    <div className="text-center lg:text-right animate-fadeInRight" style={{animationDelay: '0.4s'}}>
                        <h3 className="text-xl lg:text-2xl font-semibold mb-4 lg:mb-6 text-[color:var(--Primary,#2C3E50)]">Contact Us</h3>
                        <div className="space-y-3 lg:space-y-4">
                            <p className="text-gray-300 text-lg lg:text-xl hover:text-white transition-colors duration-300 cursor-pointer">
                                <span className="font-medium">Email:</span> hello@kudu.com
                            </p>
                            <p className="text-gray-300 text-lg lg:text-xl hover:text-white transition-colors duration-300 cursor-pointer">
                                <span className="font-medium">Phone:</span> +1 (555) 123-4567
                            </p>
                        </div>
                    </div>
                </div>
                
                {/* Bottom Border */}
                <div className="border-t border-gray-600 mt-8 lg:mt-12 pt-6 lg:pt-8">
                    <p className="text-center text-gray-400 text-base lg:text-lg">
                        © 2025 Kudu. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}