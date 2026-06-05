import Navigation from "@/components/home/Navigation";
import LoginImage from "@/components/login-image";

export default function AuthPageShell({ children }) {
    return (
        <div className="dark min-h-screen min-h-[100dvh] bg-surface-gradient overflow-x-hidden">
            <Navigation />
            <main className="pt-[calc(3.5rem+env(safe-area-inset-top,0px))] sm:pt-20 pb-[calc(2.5rem+env(safe-area-inset-bottom,0px))] sm:pb-12">
                <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col xl:flex-row xl:items-center xl:justify-center gap-8 xl:gap-16 2xl:gap-24">
                        <div className="w-full max-w-[420px] mx-auto xl:mx-0 xl:shrink-0">
                            {children}
                        </div>

                        <div className="hidden xl:flex flex-1 items-center justify-center min-w-0 max-w-[480px]">
                            <LoginImage />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
