"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, Image, FolderKanban, TrendingUp, ArrowRight } from "lucide-react";
import { FaCoins } from "react-icons/fa";
import { RiAiGenerate2 } from "react-icons/ri";
import { useAuth } from "@/context/AuthContext";
import { useCredits } from "@/context/CreditsContext";
import { apiService } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";

export default function Dashboard() {
    const { user, token } = useAuth();
    const { t } = useLanguage();
    const [recentImages, setRecentImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const { organizationCredits, userCredits, creditsLoading } = useCredits();
    const [stats, setStats] = useState({
        activeProjects: 0,
        inProgressProjects: 0,
        completedProjects: 0,
        totalImages: 0,
        imagesGenerated: 0,
    });

    const currentHour = new Date().getHours();

    let greeting = "";
    if (currentHour >= 0 && currentHour < 12) {
        greeting = t("dashboard.goodMorning");
    } else if (currentHour >= 12 && currentHour < 18) {
        greeting = t("dashboard.goodAfternoon");
    } else {
        greeting = t("dashboard.goodEvening");
    }

    const getUserDisplayName = () => {
        if (user?.full_name) return user.full_name;
        if (user?.username) return user.username;
        if (user?.email) return user.email.split("@")[0];
        return t("dashboard.user");
    };

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const projectsResponse = await apiService.getProjects(token);
                if (projectsResponse?.projects) {
                    const projectsData = projectsResponse.projects;
                    const inProgressStatuses = new Set(["progress", "in_progress", "in-progress", "active"]);
                    const inProgress = projectsData.filter((p) =>
                        inProgressStatuses.has(String(p?.status || "").toLowerCase())
                    ).length;
                    const completed = projectsData.filter(
                        (p) => String(p?.status || "").toLowerCase() === "completed"
                    ).length;
                    const totalImages = projectsData.reduce((sum, p) => sum + (p.total_images || 0), 0);
                    const imagesGenerated = projectsData.reduce(
                        (sum, p) => sum + (p.images_generated || 0),
                        0
                    );

                    setStats({
                        activeProjects: projectsData.length,
                        inProgressProjects: inProgress,
                        completedProjects: completed,
                        totalImages,
                        imagesGenerated,
                    });
                }

                const imagesResponse = await apiService.getRecentImages(token);
                if (imagesResponse?.success && imagesResponse?.images) {
                    setRecentImages(imagesResponse.images);
                }
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [token]);

    const quickActions = [
        {
            href: "/dashboard/images/white-bg",
            icon: Image,
            title: t("dashboard.plainImage"),
            description: t("dashboard.cleanProductShots"),
            iconBg: "bg-secondary group-hover:bg-gold-solid/20",
        },
        {
            href: "/dashboard/images/replace-bg",
            icon: Sparkles,
            title: t("dashboard.themedImage"),
            description: t("dashboard.lifestyleShots"),
            iconBg: "bg-gold-solid/15 group-hover:bg-gold-solid/25",
        },
        {
            href: "/dashboard/images/model-generation",
            icon: Image,
            title: t("dashboard.modelImages"),
            description: t("dashboard.aiOrHumanModels"),
            iconBg: "bg-secondary group-hover:bg-gold-solid/20",
        },
        {
            href: "/dashboard/projects/create",
            icon: FolderKanban,
            title: t("dashboard.newProject"),
            description: t("dashboard.fullCampaignPhotoshoots"),
            iconBg: "bg-gold-solid/15 group-hover:bg-gold-solid/25",
        },
    ];

    return (
        <div className="space-y-6 md:space-y-8 animate-fadeIn">
            {/* Welcome */}
            <section className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-md p-5 md:p-6 lg:p-8">
                <div className="absolute top-0 right-0 w-48 h-48 md:w-64 md:h-64 bg-gradient-to-tr from-gold-solid/20 to-gold-muted/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                    <div>
                        <p className="text-sm text-muted-foreground mb-1">{greeting}</p>
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground tracking-tight">
                            {getUserDisplayName()}
                        </h1>
                        <p className="text-sm md:text-base text-muted-foreground mt-2 max-w-xl">
                            {t("images.createStunningPhotography")}
                        </p>
                    </div>
                    <Link
                        href="/dashboard/images"
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gold-gradient text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity shrink-0"
                    >
                        {t("dashboard.individualGenerator")}
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </section>

            {/* Stats */}
            <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
                <div className="p-5 md:p-6 bg-card border border-border rounded-xl shadow-sm transition-all duration-300 hover:border-gold-muted hover:shadow-md">
                    <div className="flex justify-between items-start gap-3 pb-3">
                        <span className="text-sm font-medium text-muted-foreground">
                            {t("dashboard.remainingCredits")}
                        </span>
                        <FaCoins className="w-6 h-6 text-gold-solid shrink-0" />
                    </div>
                    {creditsLoading ? (
                        <div className="h-9 w-24 bg-muted rounded animate-pulse" />
                    ) : organizationCredits ? (
                        <>
                            <div className="text-3xl font-bold text-gold-solid tabular-nums">
                                {organizationCredits.balance.toLocaleString()}
                            </div>
                            <div className="w-full bg-muted h-2 rounded-full mt-3">
                                <div
                                    className="bg-gold-gradient h-2 rounded-full transition-all"
                                    style={{
                                        width:
                                            organizationCredits.balance > 0
                                                ? `${Math.min((organizationCredits.balance / 10000) * 100, 100)}%`
                                                : "0%",
                                    }}
                                />
                            </div>
                            <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                                {organizationCredits.organizationName} • {t("dashboard.organizationCredits")}
                            </p>
                        </>
                    ) : userCredits ? (
                        <>
                            <div className="text-3xl font-bold text-gold-solid tabular-nums">
                                {userCredits.balance.toLocaleString()}
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                                {t("dashboard.individualCredits") || "Individual user credits"}
                            </p>
                        </>
                    ) : (
                        <>
                            <div className="text-3xl font-bold text-foreground tabular-nums">0</div>
                            <p className="text-xs text-muted-foreground mt-2">
                                {t("dashboard.noOrganizationAssigned")}
                            </p>
                        </>
                    )}
                </div>

                <div className="p-5 md:p-6 bg-card border border-border rounded-xl shadow-sm hover:border-gold-muted hover:shadow-md transition-all">
                    <div className="flex justify-between items-start gap-3 pb-3">
                        <span className="text-sm font-medium text-muted-foreground">
                            {t("dashboard.imagesGenerated")}
                        </span>
                        <RiAiGenerate2 className="w-6 h-6 text-gold-solid shrink-0" />
                    </div>
                    <div className="text-3xl font-bold text-gold-solid tabular-nums">
                        {loading ? "..." : stats.imagesGenerated}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-gold-solid shrink-0" />
                        {loading ? t("common.loading") : t("dashboard.totalImagesGenerated")}
                    </p>
                </div>

                <div className="p-5 md:p-6 bg-card border border-border rounded-xl shadow-sm hover:border-gold-muted hover:shadow-md transition-all sm:col-span-2 xl:col-span-1">
                    <div className="flex justify-between items-start gap-3 pb-3">
                        <span className="text-sm font-medium text-muted-foreground">
                            {t("dashboard.activeProjects")}
                        </span>
                        <FolderKanban className="w-6 h-6 text-gold-solid shrink-0" />
                    </div>
                    <div className="text-3xl font-bold text-gold-solid tabular-nums">
                        {loading ? "..." : stats.activeProjects}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                        {loading
                            ? t("common.loading")
                            : `${stats.inProgressProjects} ${t("dashboard.inProgress")} • ${stats.completedProjects} ${t("dashboard.completed")}`}
                    </p>
                </div>
            </section>

            {/* Quick actions */}
            <section>
                <h2 className="text-lg md:text-xl font-semibold text-foreground mb-4">
                    {t("dashboard.quickActions")}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5">
                    {quickActions.map((action) => (
                        <Link key={action.href} href={action.href} className="group block h-full">
                            <div className="h-full p-5 md:p-6 bg-card border border-border rounded-xl shadow-sm hover:shadow-lg hover:border-gold-muted transition-all duration-300 flex flex-col items-center text-center">
                                <div
                                    className={`w-12 h-12 mb-4 flex items-center justify-center rounded-xl transition ${action.iconBg}`}
                                >
                                    <action.icon className="w-6 h-6 text-gold-solid" />
                                </div>
                                <h3 className="font-semibold text-foreground text-sm md:text-base mb-1">
                                    {action.title}
                                </h3>
                                <p className="text-xs md:text-sm text-muted-foreground flex-1">
                                    {action.description}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Recent images */}
            <section>
                <div className="flex items-center justify-between gap-3 mb-4">
                    <h2 className="text-lg md:text-xl font-semibold text-foreground">
                        {t("dashboard.myRecentImages")}
                    </h2>
                    {recentImages.length > 0 && (
                        <Link
                            href="/dashboard/images/gallery"
                            className="text-sm font-medium text-gold-solid hover:underline inline-flex items-center gap-1 shrink-0"
                        >
                            {t("images.gallery")}
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    )}
                </div>

                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                        {Array.from({ length: 10 }).map((_, i) => (
                            <div
                                key={i}
                                className="aspect-square rounded-xl bg-muted border border-border animate-pulse"
                            />
                        ))}
                    </div>
                ) : recentImages.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                        {recentImages.map((image) => {
                            const imageSrc = image.image_url || "/placeholder.svg";
                            return (
                                <Link
                                    key={image.id}
                                    href="/dashboard/images/gallery"
                                    className="aspect-square overflow-hidden rounded-xl bg-secondary border border-border hover:border-gold-muted hover:shadow-md transition-all"
                                >
                                    <img
                                        src={imageSrc}
                                        alt={image.prompt || "Generated content"}
                                        loading="lazy"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.src = "/placeholder.svg";
                                        }}
                                    />
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-12 md:py-16 rounded-xl border border-dashed border-border bg-card/50">
                        <Image className="w-12 h-12 mx-auto mb-3 text-muted-foreground/60" />
                        <p className="text-muted-foreground mb-4">{t("dashboard.noRecentImages")}</p>
                        <Link
                            href="/dashboard/images/white-bg"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gold-solid/10 text-gold-solid text-sm font-medium hover:bg-gold-solid/20 transition-colors"
                        >
                            {t("dashboard.plainImage")}
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                )}
            </section>
        </div>
    );
}
