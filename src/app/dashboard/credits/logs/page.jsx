"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiService } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";
import { Loader2, Zap, ArrowDownCircle, ArrowUpCircle, Calendar } from "lucide-react";

export default function CreditLogsPage() {
  const { token } = useAuth();
  const { t } = useLanguage();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const data = await apiService.getUserCreditUsage(token);
        // Backend returns usage_data; support entries/logs as fallback
        const entries = data?.usage_data ?? data?.entries ?? data?.logs;
        if (Array.isArray(entries)) {
          setLogs(entries);
        } else if (data?.error) {
          console.error("Credit logs API error:", data.error);
        }
      } catch (e) {
        console.error("Failed to fetch credit logs:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 min-h-[16rem]">
        <Loader2 className="w-8 h-8 animate-spin text-gold-solid" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          {t("credits.logsTitle") || "Credits Usage"}
        </h1>
        <p className="text-muted-foreground text-sm">
          {t("credits.logsSubtitle") ||
            "See how your credits are being consumed for image generation."}
        </p>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        {logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <Zap className="w-10 h-10 mb-3 text-muted-foreground" />
            <p>{t("credits.noLogs") || "No credit usage found yet."}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    {t("credits.date") || "Date"}
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    {t("credits.change") || "Change"}
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    {t("credits.balance") || "Balance After"}
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    {t("credits.reason") || "Reason"}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {logs.map((entry) => {
                  const isDebit = entry.change_type === "debit";
                  return (
                    <tr key={entry.id} className="hover:bg-accent">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 text-foreground">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span>
                            {(entry.date ?? entry.created_at)
                              ? new Date(entry.date ?? entry.created_at).toLocaleString()
                              : "-"}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            isDebit
                              ? "bg-destructive/10 text-destructive"
                              : "bg-gold-solid/10 text-gold-solid"
                          }`}
                        >
                          {isDebit ? (
                            <ArrowDownCircle className="w-3 h-3" />
                          ) : (
                            <ArrowUpCircle className="w-3 h-3" />
                          )}
                          {isDebit ? "-" : "+"}
                          {entry.credits_changed}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-foreground">
                        {entry.balance_after}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {entry.reason || "-"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
