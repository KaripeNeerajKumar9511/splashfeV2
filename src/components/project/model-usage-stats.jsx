"use client"

import { useState, useEffect } from "react"
import { Users, TrendingUp, Hash, Sparkles } from "lucide-react"
import { apiService } from "@/lib/api"
import { useAuth } from "@/context/AuthContext"

export function ModelUsageStats({ collectionId, className = "" }) {
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const { token } = useAuth()

    useEffect(() => {
        if (collectionId) {
            loadStats()
        }
    }, [collectionId])

    const loadStats = async () => {
        try {
            setLoading(true)
            const data = await apiService.getModelUsageStats(collectionId, token)
            if (data.success) {
                setStats(data)
            } else {
                setError(data.error || "Failed to load model statistics")
            }
        } catch (err) {
            console.error("Error loading model stats:", err)
            setError(err.message || "Failed to load model statistics")
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className={`bg-card rounded-2xl border border-border p-6 shadow-sm ${className}`}>
                <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold-solid"></div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className={`bg-card rounded-2xl border border-red-200 p-6 shadow-sm ${className}`}>
                <div className="text-center py-4">
                    <p className="text-red-600 text-sm">{error}</p>
                </div>
            </div>
        )
    }

    if (!stats || stats.total_models_used === 0) {
        return (
            <div className={`bg-card rounded-2xl border border-border p-6 shadow-sm ${className}`}>
                <div className="text-center py-8">
                    <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground font-medium">No model usage yet</p>
                    <p className="text-sm text-muted-foreground mt-1">
                        Generate images to see model statistics
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className={`bg-card rounded-2xl border border-border p-6 shadow-sm ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gold-gradient rounded-lg flex items-center justify-center">
                        <Users className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-foreground">Model Usage Statistics</h3>
                        <p className="text-sm text-muted-foreground">Track which models were used for generation</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-accent rounded-full">
                    <Sparkles className="w-4 h-4 text-gold-solid" />
                    <span className="text-sm font-medium text-gold-solid">Analytics</span>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gradient-to-br from-accent to-card rounded-xl p-4 border border-gold-muted">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-card rounded-lg flex items-center justify-center shadow-sm">
                            <Hash className="w-6 h-6 text-gold-solid" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground font-medium">Total Models Used</p>
                            <p className="text-2xl font-bold text-foreground">{stats.total_models_used}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-accent to-card rounded-xl p-4 border border-border">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-card rounded-lg flex items-center justify-center shadow-sm">
                            <TrendingUp className="w-6 h-6 text-gold-solid" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground font-medium">Total Generations</p>
                            <p className="text-2xl font-bold text-foreground">{stats.total_generations}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Model Breakdown */}
            {stats.models_breakdown && stats.models_breakdown.length > 0 && (
                <div>
                    <h4 className="text-sm font-semibold text-foreground mb-3">Model Breakdown</h4>
                    <div className="space-y-3">
                        {stats.models_breakdown.map((model, index) => {
                            const isAI = model.type === 'ai'
                            const percentage = ((model.usage_count / stats.total_generations) * 100).toFixed(1)

                            return (
                                <div
                                    key={index}
                                    className="bg-muted rounded-xl p-4 border border-border hover:border-border transition-colors"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${isAI
                                                    ? 'bg-gold-solid/10 text-gold-solid'
                                                    : 'bg-gold-muted text-foreground'
                                                }`}>
                                                {isAI ? '🤖 AI Model' : '👤 Real Model'}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-foreground">
                                                    {model.name || `${model.type} Model`}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {model.usage_count} generation{model.usage_count !== 1 ? 's' : ''}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-foreground">{percentage}%</p>
                                            <p className="text-xs text-muted-foreground">of total</p>
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all ${isAI
                                                    ? 'bg-gold-gradient'
                                                    : 'bg-gradient-to-r from-gold-from to-gold-to'
                                                }`}
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Info Note */}
            <div className="mt-6 p-4 bg-accent rounded-xl border border-border">
                <p className="text-xs text-foreground font-medium mb-1">📊 How it works</p>
                <p className="text-xs text-muted-foreground">
                    These statistics show which models were used for initial generation and regeneration.
                    Each unique model is counted separately, even when used multiple times with different products.
                </p>
            </div>
        </div>
    )
}

