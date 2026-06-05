export default function LoginImage() {
    return (
        <div className="relative w-full max-w-[440px] h-[min(420px,50vh)] mx-auto">
            <div className="absolute top-0 left-0 w-[42%] aspect-square max-w-[180px] rounded-2xl overflow-hidden shadow-lg z-10 border border-gold-muted/50">
                <img
                    src="/images/login-1.jpg"
                    alt="Diamond heart pendant"
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="absolute bottom-0 right-0 w-[72%] h-[88%] rounded-2xl overflow-hidden shadow-2xl border border-gold-muted/50">
                <img
                    src="/images/login-2.jpg"
                    alt="Woman wearing luxury jewelry"
                    className="w-full h-full object-cover"
                />
            </div>
        </div>
    );
}
