export default function NavBar() {
    return (
        <header className="flex items-center sticky top-0 left-0 w-full px-4 sm:px-8 py-4 z-50 bg-[var(--background)] backdrop-blur-sm border-b border-[var(--primary)] border-opacity-10 animate-fadeInUp">
            <h1 className="ml-0 sm:ml-[80px] text-2xl sm:text-4xl font-poppins font-bold text-[var(--primary)] hover:text-[var(--secondary)] transition-colors duration-300 cursor-pointer hover-scale">Kudu</h1>
            {/* Add navigation links or menu button here if needed */}
        </header>
    );
}