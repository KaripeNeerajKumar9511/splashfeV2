
import { Header } from "@/components/images/header"
import { StatsCards } from "@/components/images/stats-cards"
import { PopularTools } from "@/components/images/popular-tools"
import { AllTools } from "@/components/images/all-tools"

export default function Home() {
    return (
        <div className="flex min-h-screen">
            <main className="flex-1">
                <Header />
                <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10 space-y-8 md:space-y-10 max-w-[1600px]">
                    <StatsCards />
                    <PopularTools />
                    <AllTools />
                </div>
            </main>
        </div>
    )
}
