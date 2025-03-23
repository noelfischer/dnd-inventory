import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Shield, Move, Scroll, Coins, Heart, Users, Dice6, Moon, Sun } from "lucide-react"
import ToggleDarkMode from "@/app/ui/darkmode-toggle"
import Link from "next/link"

type LandingPageProps = {
    totalUsers: number;
    totalCharacters: number;
}

export default function LandingPage({ totalUsers, totalCharacters }: LandingPageProps) {

    return (
        <div className="flex min-h-screen flex-col bg-[#FBF8F1] dark:bg-[#1A1A2E] transition-colors duration-300">
            <ToggleDarkMode />
            {/* Hero Section - Full Screen Height */}
            <section className="min-h-screen flex flex-col items-center justify-center relative px-4 py-20">
                {/* Decorative Elements - Hidden on very small screens */}
                <div className="absolute top-20 left-10 w-20 h-20 bg-[#FF6B6B] dark:bg-[#FF6B6B]/70 rounded-full opacity-30 animate-bounce hidden sm:block"></div>
                <div className="absolute bottom-40 right-20 w-32 h-32 bg-[#4ECDC4] dark:bg-[#4ECDC4]/70 rounded-full opacity-20 animate-pulse hidden sm:block"></div>
                <div className="absolute top-40 right-10 w-16 h-16 bg-[#FFD166] dark:bg-[#FFD166]/70 rounded-md rotate-12 opacity-40 hidden sm:block"></div>

                <div className="container max-w-4xl mx-auto text-center z-10">
                    <div className="inline-block mb-6 transform -rotate-3">
                        <div className="flex items-center gap-2 sm:gap-3 text-3xl sm:text-4xl font-extrabold bg-[#FFD166] dark:bg-[#FFD166]/90 px-4 sm:px-6 py-2 sm:py-3 rounded-lg border-4 border-black dark:border-[#FFD166] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,209,102,0.3)]">
                            <Shield className="h-7 w-7 sm:h-10 sm:w-10 text-black dark:text-[#1A1A2E]" />
                            <span className="text-black dark:text-[#1A1A2E]">DnDventory</span>
                        </div>
                    </div>

                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-black mb-4 sm:mb-6 text-black dark:text-white leading-tight">
                        Your D&D Inventory,<br />
                        <span className="text-[#FF6B6B] dark:text-[#FF8E8E] relative">
                            Your Way
                            <span className="absolute bottom-0 left-0 w-full h-2 sm:h-3 bg-[#4ECDC4] dark:bg-[#4ECDC4]/70 -z-10 transform translate-y-2"></span>
                        </span>
                    </h1>

                    <p className="text-lg sm:text-xl md:text-2xl mb-8 sm:mb-10 max-w-2xl mx-auto text-black dark:text-gray-200">
                        Rearrange your character sheet however you want. Track health, spells, and inventory with drag-and-drop
                        simplicity.
                    </p>

                    {/* CTA Buttons with Individual Glow Effects */}
                    <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mb-12 sm:mb-20 px-2">
                        {/* Sign Up Button */}
                        <Link
                            href="/signup"
                            className="unset"
                        >
                            <Button
                                size="lg"
                                variant="vanilla"
                                className="relative text-lg sm:text-xl px-8 sm:px-16 py-6 sm:py-10 h-auto bg-[#FF6B6B] hover:bg-[#FF6B6B]/90 dark:bg-[#FF8E8E] dark:hover:bg-[#FF8E8E]/90 text-white dark:text-[#1A1A2E] rounded-xl border-4 border-black dark:border-[#FF8E8E] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,142,142,0.3)] transition-transform hover:-translate-y-1 w-full sm:w-auto sm:min-w-[220px]"
                            >
                                Sign Up
                            </Button>
                        </Link>
                        {/* Log In Button */}
                        <div className="relative group w-full sm:w-auto">
                            <div className="absolute -inset-1 bg-gradient-to-r from-[#4ECDC4]/30 to-[#4ECDC4]/10 dark:from-[#4ECDC4]/20 dark:to-[#4ECDC4]/5 rounded-xl blur-md group-hover:blur-lg transition-all duration-300"></div>
                            <Link
                                href="/login"
                                className="unset"
                            >
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="relative text-lg sm:text-xl px-8 sm:px-10 py-6 sm:py-10 h-auto bg-white hover:bg-gray-100 dark:bg-[#2A2A42] dark:hover:bg-[#2A2A42]/90 text-black dark:text-white rounded-xl border-4 border-black dark:border-[#4ECDC4] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(78,205,196,0.3)] transition-transform hover:-translate-y-1 w-full"
                                >
                                    Log In
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Stats Cards - Made smaller and less prominent */}
                    <div className="grid grid-cols-3 gap-2 sm:gap-3 max-w-[280px] sm:max-w-md mx-auto opacity-90">
                        <div className="bg-white dark:bg-[#2A2A42] p-2 sm:p-3 rounded-lg border-2 sm:border-3 border-black dark:border-[#4ECDC4] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(78,205,196,0.3)] sm:dark:shadow-[3px_3px_0px_0px_rgba(78,205,196,0.3)] transform rotate-1">
                            <p className="text-2xl sm:text-3xl font-black text-[#FF6B6B] dark:text-[#FF8E8E]">10k+</p>
                            <p className="text-[10px] sm:text-xs font-bold text-black dark:text-white">Active Players</p>
                        </div>
                        <div className="bg-white dark:bg-[#2A2A42] p-2 sm:p-3 rounded-lg border-2 sm:border-3 border-black dark:border-[#4ECDC4] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(78,205,196,0.3)] sm:dark:shadow-[3px_3px_0px_0px_rgba(78,205,196,0.3)] transform -rotate-1">
                            <p className="text-2xl sm:text-3xl font-black text-[#4ECDC4] dark:text-[#4ECDC4]">50k+</p>
                            <p className="text-[10px] sm:text-xs font-bold text-black dark:text-white">Character Sheets</p>
                        </div>
                        <div className="bg-white dark:bg-[#2A2A42] p-2 sm:p-3 rounded-lg border-2 sm:border-3 border-black dark:border-[#4ECDC4] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(78,205,196,0.3)] sm:dark:shadow-[3px_3px_0px_0px_rgba(78,205,196,0.3)] transform rotate-1">
                            <p className="text-2xl sm:text-3xl font-black text-[#FFD166] dark:text-[#FFD166]">4.9</p>
                            <p className="text-[10px] sm:text-xs font-bold text-black dark:text-white">User Rating</p>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 animate-bounce z-20 text-black dark:text-white">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M12 5V19M12 19L5 12M12 19L19 12"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>
            </section>

            {/* Rearrangeable Components Section */}
            < section className="py-12 sm:py-20 bg-[#4ECDC4] dark:bg-[#2C7873] relative" >
                <div className="absolute top-0 left-0 w-full h-16 bg-[#4ECDC4] dark:bg-[#2C7873] -mt-16 clip-diagonal"></div>

                <div className="container px-4 md:px-6 mx-auto">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8 sm:mb-12">
                        <div className="inline-block transform rotate-3 mb-2 sm:mb-4">
                            <div className="bg-[#FFD166] dark:bg-[#FFD166]/90 px-3 sm:px-5 py-1 sm:py-2 rounded-lg border-3 sm:border-4 border-black dark:border-[#FFD166] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,209,102,0.3)] sm:dark:shadow-[5px_5px_0px_0px_rgba(255,209,102,0.3)]">
                                <Move className="inline-block mr-1 h-4 w-4 sm:h-5 sm:w-5 text-black dark:text-[#1A1A2E]" />
                                <span className="font-bold text-sm sm:text-base text-black dark:text-[#1A1A2E]">
                                    DRAG & DROP EVERYTHING
                                </span>
                            </div>
                        </div>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-black dark:text-white">
                            Your Layout, Your Rules
                        </h2>
                        <p className="max-w-[700px] text-base sm:text-xl text-black dark:text-gray-200">
                            Every component can be moved and arranged exactly how you want it.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                        {/* Component Cards */}
                        <div className="bg-white dark:bg-[#2A2A42] p-4 sm:p-6 rounded-xl border-3 sm:border-4 border-black dark:border-[#FF8E8E] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,142,142,0.3)] sm:dark:shadow-[8px_8px_0px_0px_rgba(255,142,142,0.3)] transform hover:-rotate-1 transition-transform">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#FF6B6B] dark:bg-[#FF8E8E] rounded-lg border-3 sm:border-4 border-black dark:border-[#FF8E8E]/50 flex items-center justify-center mb-3 sm:mb-4">
                                <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-white dark:text-[#1A1A2E]" />
                            </div>
                            <h3 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2 text-black dark:text-white">Health Tracker</h3>
                            <p className="text-sm sm:text-base text-black dark:text-gray-200">
                                Drag your health bar anywhere on screen. Resize it to be as big or small as you want.
                            </p>
                        </div>

                        <div className="bg-white dark:bg-[#2A2A42] p-4 sm:p-6 rounded-xl border-3 sm:border-4 border-black dark:border-[#FFD166] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,209,102,0.3)] sm:dark:shadow-[8px_8px_0px_0px_rgba(255,209,102,0.3)] transform hover:rotate-1 transition-transform">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#FFD166] dark:bg-[#FFD166] rounded-lg border-3 sm:border-4 border-black dark:border-[#FFD166]/50 flex items-center justify-center mb-3 sm:mb-4">
                                <Scroll className="h-6 w-6 sm:h-8 sm:w-8 text-white dark:text-[#1A1A2E]" />
                            </div>
                            <h3 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2 text-black dark:text-white">Spell Slots</h3>
                            <p className="text-sm sm:text-base text-black dark:text-gray-200">
                                Keep your spell slots where you need them. Customize the layout to match your spellcasting style.
                            </p>
                        </div>

                        <div className="bg-white dark:bg-[#2A2A42] p-4 sm:p-6 rounded-xl border-3 sm:border-4 border-black dark:border-[#4ECDC4] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(78,205,196,0.3)] sm:dark:shadow-[8px_8px_0px_0px_rgba(78,205,196,0.3)] transform hover:-rotate-1 transition-transform">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#4ECDC4] dark:bg-[#4ECDC4] rounded-lg border-3 sm:border-4 border-black dark:border-[#4ECDC4]/50 flex items-center justify-center mb-3 sm:mb-4">
                                <Coins className="h-6 w-6 sm:h-8 sm:w-8 text-white dark:text-[#1A1A2E]" />
                            </div>
                            <h3 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2 text-black dark:text-white">Inventory</h3>
                            <p className="text-sm sm:text-base text-black dark:text-gray-200">
                                Organize your items and coin pouch however you like. Everything is movable and resizable.
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 sm:mt-16 relative">
                        <div className="bg-white dark:bg-[#2A2A42] p-3 sm:p-4 rounded-xl border-3 sm:border-4 border-black dark:border-[#4ECDC4] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sm:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(78,205,196,0.3)] sm:dark:shadow-[12px_12px_0px_0px_rgba(78,205,196,0.3)] overflow-hidden">
                            <Image
                                src="/dashboard.png?height=1444&width=2008"
                                width={2008}
                                height={1444}
                                alt="App demo showing rearrangeable components"
                                className="rounded-lg border-2 border-black dark:border-gray-700"
                            />
                            <div className="absolute top-4 right-4 bg-[#FF6B6B] dark:bg-[#FF8E8E] text-white dark:text-[#1A1A2E] font-bold px-3 sm:px-4 py-1 sm:py-2 rounded-lg border-2 border-black dark:border-[#FF8E8E]/50 transform rotate-3 text-sm sm:text-base">
                                Drag Me!
                            </div>
                            <div className="absolute bottom-8 sm:bottom-12 left-4 sm:left-8 bg-[#FFD166] dark:bg-[#FFD166] text-black dark:text-[#1A1A2E] font-bold px-3 sm:px-4 py-1 sm:py-2 rounded-lg border-2 border-black dark:border-[#FFD166]/50 transform -rotate-2 text-sm sm:text-base">
                                Move Anywhere!
                            </div>
                        </div>
                    </div>
                </div>
            </section >

            {/* Social Proof Section */}
            < section className="py-12 sm:py-20 bg-[#FBF8F1] dark:bg-[#1A1A2E]" >
                <div className="container px-4 md:px-6 mx-auto">
                    <div className="text-center mb-8 sm:mb-12">
                        <div className="inline-block transform -rotate-2 mb-2 sm:mb-4">
                            <div className="bg-[#FF6B6B] dark:bg-[#FF8E8E] px-3 sm:px-5 py-1 sm:py-2 rounded-lg border-3 sm:border-4 border-black dark:border-[#FF8E8E]/50 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,142,142,0.3)] sm:dark:shadow-[5px_5px_0px_0px_rgba(255,142,142,0.3)]">
                                <Users className="inline-block mr-1 h-4 w-4 sm:h-5 sm:w-5 text-white dark:text-[#1A1A2E]" />
                                <span className="font-bold text-sm sm:text-base text-white dark:text-[#1A1A2E]">LOVED BY PLAYERS</span>
                            </div>
                        </div>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-black dark:text-white mb-2 sm:mb-4">
                            Join Thousands of Happy Adventurers
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        {/* Testimonial Cards */}
                        <div className="bg-white dark:bg-[#2A2A42] p-4 sm:p-6 rounded-xl border-3 sm:border-4 border-black dark:border-[#4ECDC4] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(78,205,196,0.3)] sm:dark:shadow-[8px_8px_0px_0px_rgba(78,205,196,0.3)] transform rotate-1">
                            <div className="flex items-center mb-3 sm:mb-4">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#4ECDC4] dark:bg-[#4ECDC4] rounded-full border-2 border-black dark:border-[#4ECDC4]/50 flex items-center justify-center mr-3">
                                    <span className="font-bold text-sm sm:text-base text-white dark:text-[#1A1A2E]">DM</span>
                                </div>
                                <div>
                                    <p className="font-bold text-sm sm:text-base text-black dark:text-white">Dungeon Master Dave</p>
                                    <div className="flex">
                                        <Dice6 className="h-3 w-3 sm:h-4 sm:w-4 text-[#FFD166] dark:text-[#FFD166]" />
                                        <Dice6 className="h-3 w-3 sm:h-4 sm:w-4 text-[#FFD166] dark:text-[#FFD166]" />
                                        <Dice6 className="h-3 w-3 sm:h-4 sm:w-4 text-[#FFD166] dark:text-[#FFD166]" />
                                        <Dice6 className="h-3 w-3 sm:h-4 sm:w-4 text-[#FFD166] dark:text-[#FFD166]" />
                                        <Dice6 className="h-3 w-3 sm:h-4 sm:w-4 text-[#FFD166] dark:text-[#FFD166]" />
                                    </div>
                                </div>
                            </div>
                            <p className="text-sm sm:text-base text-black dark:text-gray-200">
                            &quot;This app has completely changed how my players track their characters. No more shuffling papers!&quot;
                            </p>
                        </div>

                        <div className="bg-white dark:bg-[#2A2A42] p-4 sm:p-6 rounded-xl border-3 sm:border-4 border-black dark:border-[#FF8E8E] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,142,142,0.3)] sm:dark:shadow-[8px_8px_0px_0px_rgba(255,142,142,0.3)] transform -rotate-1">
                            <div className="flex items-center mb-3 sm:mb-4">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#FF6B6B] dark:bg-[#FF8E8E] rounded-full border-2 border-black dark:border-[#FF8E8E]/50 flex items-center justify-center mr-3">
                                    <span className="font-bold text-sm sm:text-base text-white dark:text-[#1A1A2E]">EW</span>
                                </div>
                                <div>
                                    <p className="font-bold text-sm sm:text-base text-black dark:text-white">Elven Wizard</p>
                                    <div className="flex">
                                        <Dice6 className="h-3 w-3 sm:h-4 sm:w-4 text-[#FFD166] dark:text-[#FFD166]" />
                                        <Dice6 className="h-3 w-3 sm:h-4 sm:w-4 text-[#FFD166] dark:text-[#FFD166]" />
                                        <Dice6 className="h-3 w-3 sm:h-4 sm:w-4 text-[#FFD166] dark:text-[#FFD166]" />
                                        <Dice6 className="h-3 w-3 sm:h-4 sm:w-4 text-[#FFD166] dark:text-[#FFD166]" />
                                        <Dice6 className="h-3 w-3 sm:h-4 sm:w-4 text-[#FFD166] dark:text-[#FFD166]" />
                                    </div>
                                </div>
                            </div>
                            <p className="text-sm sm:text-base text-black dark:text-gray-200">
                            &quot;Being able to arrange my spell slots and components exactly how I want them has made spellcasting so
                                much easier!&quot;
                            </p>
                        </div>

                        <div className="bg-white dark:bg-[#2A2A42] p-4 sm:p-6 rounded-xl border-3 sm:border-4 border-black dark:border-[#FFD166] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,209,102,0.3)] sm:dark:shadow-[8px_8px_0px_0px_rgba(255,209,102,0.3)] transform rotate-1">
                            <div className="flex items-center mb-3 sm:mb-4">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#FFD166] dark:bg-[#FFD166] rounded-full border-2 border-black dark:border-[#FFD166]/50 flex items-center justify-center mr-3">
                                    <span className="font-bold text-sm sm:text-base text-white dark:text-[#1A1A2E]">BR</span>
                                </div>
                                <div>
                                    <p className="font-bold text-sm sm:text-base text-black dark:text-white">Barbarian Rage</p>
                                    <div className="flex">
                                        <Dice6 className="h-3 w-3 sm:h-4 sm:w-4 text-[#FFD166] dark:text-[#FFD166]" />
                                        <Dice6 className="h-3 w-3 sm:h-4 sm:w-4 text-[#FFD166] dark:text-[#FFD166]" />
                                        <Dice6 className="h-3 w-3 sm:h-4 sm:w-4 text-[#FFD166] dark:text-[#FFD166]" />
                                        <Dice6 className="h-3 w-3 sm:h-4 sm:w-4 text-[#FFD166] dark:text-[#FFD166]" />
                                        <Dice6 className="h-3 w-3 sm:h-4 sm:w-4 text-[#FFD166] dark:text-[#FFD166]" />
                                    </div>
                                </div>
                            </div>
                            <p className="text-sm sm:text-base text-black dark:text-gray-200">
                            &quot;BIG HEALTH BAR GOOD. RAGE TRACKER GOOD. ME LIKE DRAG THINGS AROUND. VERY GOOD APP.&quot;
                            </p>
                        </div>
                    </div>

                    <div className="mt-10 sm:mt-16 text-center">
                        <Link
                            href="/signup"
                            className="unset relative place-content-center"
                        >
                            <Button
                                size="lg"
                                variant="vanilla"
                                className="relative text-lg sm:text-xl px-8 sm:px-16 py-6 sm:py-8 h-auto bg-[#FF6B6B] hover:bg-[#FF6B6B]/90 dark:bg-[#FF8E8E] dark:hover:bg-[#FF8E8E]/90 text-white dark:text-[#1A1A2E] rounded-xl border-3 sm:border-4 border-black dark:border-[#FF8E8E] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,142,142,0.3)] sm:dark:shadow-[8px_8px_0px_0px_rgba(255,142,142,0.3)] transition-transform hover:-translate-y-1 w-full sm:w-auto sm:min-w-[220px]"
                            >
                                Sign Up & Join Them
                            </Button>
                        </Link>
                    </div>
                </div>
            </section >

            <footer className="py-6 sm:py-8 bg-black text-white dark:bg-[#121225] dark:text-gray-200">
                <div className="container px-4 md:px-6 mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center gap-2 mb-4 md:mb-0">
                            <Shield className="h-5 w-5 text-[#FFD166] dark:text-[#FFD166]" />
                            <span className="font-bold text-lg sm:text-xl">DnDventory</span>
                        </div>
                        <p className="text-center md:text-right text-xs sm:text-sm">
                            Made with ❤️ for the D&D community • {new Date().getFullYear()}
                        </p>
                    </div>
                </div>
            </footer>
        </div >
    )
}

