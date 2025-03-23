import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Shield, Dice6, Scroll, Users, Clock, ChevronRight, Moon, Sun } from "lucide-react"
import ToggleDarkMode from "@/app/ui/darkmode-toggle"

export default function DashboardPage() {
    // This would normally come from your auth system
    const user = {
        name: "Elminster",
        campaigns: 3,
        characters: 5,
        lastPlayed: "Curse of Strahd",
        lastPlayedDate: "2 days ago",
    }

    return (
        <div className="flex min-h-screen flex-col bg-[#FBF8F1] dark:bg-[#1A1A2E] transition-colors duration-300">
            {/* Header */}
            <header className="w-full py-3 sm:py-4 border-b-4 border-black dark:border-[#4ECDC4] bg-white dark:bg-[#2A2A42] shadow-md">
                <div className="container max-w-6xl mx-auto px-4 flex justify-between items-center">
                    <ToggleDarkMode />
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="flex items-center gap-1 sm:gap-2 text-xl sm:text-2xl font-extrabold">
                            <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-[#FF6B6B] dark:text-[#FF8E8E]" />
                            <span className="text-black dark:text-white">DnDventory</span>
                        </div>
                    </div>
                    <div className="w-5 sm:w-6"></div> {/* Empty div for flex spacing */}
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 container max-w-6xl mx-auto px-4 py-6 sm:py-12">
                {/* Welcome Section */}
                <section className="mb-8 sm:mb-12">
                    <div className="relative">
                        <div className="absolute -top-4 -left-4 sm:-top-6 sm:-left-6 w-16 h-16 sm:w-24 sm:h-24 bg-[#FFD166]/20 dark:bg-[#FFD166]/10 rounded-full"></div>
                        <div className="absolute -bottom-6 -right-6 sm:-bottom-8 sm:-right-8 w-24 h-24 sm:w-32 sm:h-32 bg-[#4ECDC4]/20 dark:bg-[#4ECDC4]/10 rounded-full"></div>

                        <div className="bg-white dark:bg-[#2A2A42] p-5 sm:p-8 rounded-xl border-3 sm:border-4 border-black dark:border-[#4ECDC4] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(78,205,196,0.3)] sm:dark:shadow-[8px_8px_0px_0px_rgba(78,205,196,0.3)] relative z-10">
                            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6">
                                <div>
                                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-black dark:text-white mb-2 text-center sm:text-left">
                                        Welcome back, <span className="text-[#FF6B6B] dark:text-[#FF8E8E]">{user.name}!</span>
                                    </h1>
                                    <p className="text-base sm:text-lg text-black/70 dark:text-white/70 text-center sm:text-left">
                                        Ready to continue your adventure?
                                    </p>
                                </div>
                                <Link href="/campaigns" className="unset">
                                    <Button
                                        size="lg"
                                        className="text-base sm:text-xl px-6 sm:px-8 py-4 sm:py-6 h-auto bg-[#FF6B6B] hover:bg-[#FF6B6B]/90 dark:bg-[#FF8E8E] dark:hover:bg-[#FF8E8E]/90 text-white dark:text-[#1A1A2E] rounded-xl border-3 sm:border-4 border-black dark:border-[#FF8E8E] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,142,142,0.3)] sm:dark:shadow-[6px_6px_0px_0px_rgba(255,142,142,0.3)] transition-transform hover:-translate-y-1 w-full sm:w-auto"
                                    >
                                        Go to Campaigns
                                        <ChevronRight className="ml-1 sm:ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats & Recent Activity */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                    {/* Stats Cards */}
                    <div className="bg-white dark:bg-[#2A2A42] p-4 sm:p-6 rounded-xl border-3 sm:border-4 border-black dark:border-[#FFD166] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,209,102,0.3)] sm:dark:shadow-[6px_6px_0px_0px_rgba(255,209,102,0.3)] transform rotate-1">
                        <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-4">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#FFD166] dark:bg-[#FFD166] rounded-lg border-2 border-black dark:border-[#FFD166]/50 flex items-center justify-center">
                                <Dice6 className="h-5 w-5 sm:h-6 sm:w-6 text-black dark:text-[#1A1A2E]" />
                            </div>
                            <div>
                                <p className="text-xs sm:text-sm font-bold text-black/60 dark:text-white/60">Active Campaigns</p>
                                <p className="text-2xl sm:text-3xl font-black text-black dark:text-white">{user.campaigns}</p>
                            </div>
                        </div>
                        <Link
                            href="/campaigns"
                            className="text-[#FF6B6B] dark:text-[#FF8E8E] font-bold text-xs sm:text-sm flex items-center hover:underline"
                        >
                            View all campaigns
                            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
                        </Link>
                    </div>

                    <div className="bg-white dark:bg-[#2A2A42] p-4 sm:p-6 rounded-xl border-3 sm:border-4 border-black dark:border-[#4ECDC4] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(78,205,196,0.3)] sm:dark:shadow-[6px_6px_0px_0px_rgba(78,205,196,0.3)] transform -rotate-1">
                        <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-4">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#4ECDC4] dark:bg-[#4ECDC4] rounded-lg border-2 border-black dark:border-[#4ECDC4]/50 flex items-center justify-center">
                                <Users className="h-5 w-5 sm:h-6 sm:w-6 text-black dark:text-[#1A1A2E]" />
                            </div>
                            <div>
                                <p className="text-xs sm:text-sm font-bold text-black/60 dark:text-white/60">Your Characters</p>
                                <p className="text-2xl sm:text-3xl font-black text-black dark:text-white">{user.characters}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#2A2A42] p-4 sm:p-6 rounded-xl border-3 sm:border-4 border-black dark:border-[#FF8E8E] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,142,142,0.3)] sm:dark:shadow-[6px_6px_0px_0px_rgba(255,142,142,0.3)] transform rotate-1">
                        <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-4">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#FF6B6B] dark:bg-[#FF8E8E] rounded-lg border-2 border-black dark:border-[#FF8E8E]/50 flex items-center justify-center">
                                <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-black dark:text-[#1A1A2E]" />
                            </div>
                            <div>
                                <p className="text-xs sm:text-sm font-bold text-black/60 dark:text-white/60">Last Played</p>
                                <p className="text-base sm:text-xl font-bold text-black dark:text-white truncate max-w-[160px]">
                                    {user.lastPlayed}
                                </p>
                            </div>
                        </div>
                        <p className="text-black/60 dark:text-white/60 text-xs sm:text-sm">{user.lastPlayedDate}</p>
                    </div>
                </div>

                {/* Recent Characters */}
                <section className="mt-8 sm:mt-12">
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                        <h2 className="text-xl sm:text-2xl font-bold text-black dark:text-white">Recent Characters</h2>
                        <Link
                            href="/characters"
                            className="text-[#FF6B6B] dark:text-[#FF8E8E] font-bold text-xs sm:text-sm flex items-center hover:underline"
                        >
                            View all
                            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {/* Character Card 1 */}
                        <div className="bg-white dark:bg-[#2A2A42] rounded-xl border-3 sm:border-4 border-black dark:border-[#4ECDC4] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(78,205,196,0.3)] sm:dark:shadow-[6px_6px_0px_0px_rgba(78,205,196,0.3)] overflow-hidden transform hover:-translate-y-1 transition-transform">
                            <div className="h-16 sm:h-24 bg-[#4ECDC4]/20 dark:bg-[#4ECDC4]/10 relative">
                                <div className="absolute bottom-0 right-0 p-2">
                                    <div className="bg-[#FFD166] dark:bg-[#FFD166] text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded border-2 border-black dark:border-[#FFD166]/50">
                                        Level 8
                                    </div>
                                </div>
                            </div>
                            <div className="p-3 sm:p-4">
                                <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#FF6B6B] dark:bg-[#FF8E8E] rounded-full border-2 border-black dark:border-[#FF8E8E]/50 flex items-center justify-center -mt-6 sm:-mt-8">
                                        <Scroll className="h-4 w-4 sm:h-5 sm:w-5 text-white dark:text-[#1A1A2E]" />
                                    </div>
                                    <h3 className="text-base sm:text-lg font-bold text-black dark:text-white">Gandalf the Grey</h3>
                                </div>
                                <p className="text-xs sm:text-sm text-black/70 dark:text-white/70 mb-2 sm:mb-3">Human Wizard</p>
                                <Button
                                    size="sm"
                                    className="w-full bg-[#4ECDC4] hover:bg-[#4ECDC4]/90 dark:bg-[#4ECDC4] dark:hover:bg-[#4ECDC4]/90 text-black dark:text-[#1A1A2E] border-2 border-black dark:border-[#4ECDC4]/50 text-xs sm:text-sm py-1 sm:py-2"
                                >
                                    Open Character
                                </Button>
                            </div>
                        </div>

                        {/* Character Card 2 */}
                        <div className="bg-white dark:bg-[#2A2A42] rounded-xl border-3 sm:border-4 border-black dark:border-[#FF8E8E] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,142,142,0.3)] sm:dark:shadow-[6px_6px_0px_0px_rgba(255,142,142,0.3)] overflow-hidden transform hover:-translate-y-1 transition-transform">
                            <div className="h-16 sm:h-24 bg-[#FF6B6B]/20 dark:bg-[#FF8E8E]/10 relative">
                                <div className="absolute bottom-0 right-0 p-2">
                                    <div className="bg-[#FFD166] dark:bg-[#FFD166] text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded border-2 border-black dark:border-[#FFD166]/50">
                                        Level 5
                                    </div>
                                </div>
                            </div>
                            <div className="p-3 sm:p-4">
                                <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#4ECDC4] dark:bg-[#4ECDC4] rounded-full border-2 border-black dark:border-[#4ECDC4]/50 flex items-center justify-center -mt-6 sm:-mt-8">
                                        <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-white dark:text-[#1A1A2E]" />
                                    </div>
                                    <h3 className="text-base sm:text-lg font-bold text-black dark:text-white">Bruenor Battlehammer</h3>
                                </div>
                                <p className="text-xs sm:text-sm text-black/70 dark:text-white/70 mb-2 sm:mb-3">Dwarf Fighter</p>
                                <Button
                                    size="sm"
                                    className="w-full bg-[#4ECDC4] hover:bg-[#4ECDC4]/90 dark:bg-[#4ECDC4] dark:hover:bg-[#4ECDC4]/90 text-black dark:text-[#1A1A2E] border-2 border-black dark:border-[#4ECDC4]/50 text-xs sm:text-sm py-1 sm:py-2"
                                >
                                    Open Character
                                </Button>
                            </div>
                        </div>

                        {/* Character Card 3 */}
                        <div className="bg-white dark:bg-[#2A2A42] rounded-xl border-3 sm:border-4 border-black dark:border-[#FFD166] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,209,102,0.3)] sm:dark:shadow-[6px_6px_0px_0px_rgba(255,209,102,0.3)] overflow-hidden transform hover:-translate-y-1 transition-transform">
                            <div className="h-16 sm:h-24 bg-[#FFD166]/20 dark:bg-[#FFD166]/10 relative">
                                <div className="absolute bottom-0 right-0 p-2">
                                    <div className="bg-[#FFD166] dark:bg-[#FFD166] text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded border-2 border-black dark:border-[#FFD166]/50">
                                        Level 3
                                    </div>
                                </div>
                            </div>
                            <div className="p-3 sm:p-4">
                                <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#FFD166] dark:bg-[#FFD166] rounded-full border-2 border-black dark:border-[#FFD166]/50 flex items-center justify-center -mt-6 sm:-mt-8">
                                        <Dice6 className="h-4 w-4 sm:h-5 sm:w-5 text-white dark:text-[#1A1A2E]" />
                                    </div>
                                    <h3 className="text-base sm:text-lg font-bold text-black dark:text-white">Drizzt Do&apos;Urden</h3>
                                </div>
                                <p className="text-xs sm:text-sm text-black/70 dark:text-white/70 mb-2 sm:mb-3">Drow Ranger</p>
                                <Button
                                    size="sm"
                                    className="w-full bg-[#4ECDC4] hover:bg-[#4ECDC4]/90 dark:bg-[#4ECDC4] dark:hover:bg-[#4ECDC4]/90 text-black dark:text-[#1A1A2E] border-2 border-black dark:border-[#4ECDC4]/50 text-xs sm:text-sm py-1 sm:py-2"
                                >
                                    Open Character
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="py-4 sm:py-6 bg-black text-white dark:bg-[#121225] dark:text-gray-200">
                <div className="container px-4 md:px-6 mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center gap-2 mb-3 md:mb-0">
                            <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-[#FFD166] dark:text-[#FFD166]" />
                            <span className="font-bold text-sm sm:text-base">DnDventory</span>
                        </div>
                        <p className="text-center md:text-right text-xs sm:text-sm">
                            Made with ❤️ for the D&D community • {new Date().getFullYear()}
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    )
}

