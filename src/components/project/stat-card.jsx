export default function StatCard({ label, value, icon }) {
    return (
        <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
                <span className="text-muted-foreground text-sm font-medium">{label}</span>
                <span className="text-xl">{icon}</span>
            </div>
            <div className="text-3xl font-bold text-foreground">{value}</div>
        </div>
    )
}
