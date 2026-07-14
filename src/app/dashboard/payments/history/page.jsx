"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiService } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";
import { CreditCard, Check, X, Calendar, DollarSign, Loader2, Download } from "lucide-react";
import { downloadInvoicePdf } from "@/lib/invoiceDownload";
import toast from "react-hot-toast";

export default function PaymentHistoryPage() {
  const { token } = useAuth();
  const { t } = useLanguage();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const data = await apiService.getPaymentHistory(token);
        if (data?.transactions) {
          setPayments(data.transactions);
        }
      } catch (e) {
        console.error("Failed to fetch payment history:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [token]);

  const handleDownloadInvoice = async (payment) => {
    setDownloadingId(payment.id);
    try {
      await downloadInvoicePdf({ payment, token });
    } catch (e) {
      console.error("Invoice download failed:", e);
      toast.error("Failed to download invoice. Please try again.");
    } finally {
      setDownloadingId(null);
    }
  };

  const getStatusChip = (status) => {
    if (status === "completed") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gold-solid/10 text-gold-solid">
          <Check className="w-3 h-3" /> {t("status.completed") || "Completed"}
        </span>
      );
    }
    if (status === "pending") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gold-muted text-foreground">
          {t("status.pending") || "Pending"}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-destructive/10 text-destructive">
        <X className="w-3 h-3" /> {t("status.failed") || "Failed"}
      </span>
    );
  };

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
        <h1 className="text-2xl font-bold text-foreground">Payment History</h1>
        <p className="text-muted-foreground text-sm">
          View all your plan and credit purchases.
        </p>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        {payments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <CreditCard className="w-10 h-10 mb-3 text-muted-foreground" />
            <p>No payments found yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Plan / Credits
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Credits
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Transaction ID
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Invoice
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-accent">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 text-foreground">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>
                          {p.created_at
                            ? new Date(p.created_at).toLocaleDateString()
                            : "-"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-foreground">
                      {p.plan_name || "Credit Purchase"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-foreground">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        <span>
                          {p.currency === "USD" ? "$" : "₹"}
                          {p.total_amount?.toFixed(2) || p.amount?.toFixed(2) || "0.00"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-foreground">
                      {p.credits ?? 0}
                    </td>
                    <td className="px-4 py-3">{getStatusChip(p.status)}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground font-mono">
                      {p.razorpay_payment_id || p.razorpay_order_id || p.id}
                    </td>
                    <td className="px-4 py-3">
                      {p.status === "completed" ? (
                        <button
                          type="button"
                          onClick={() => handleDownloadInvoice(p)}
                          disabled={downloadingId === p.id}
                          className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gold-solid hover:bg-accent rounded-lg transition-colors disabled:opacity-50"
                        >
                          {downloadingId === p.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Download className="w-4 h-4" />
                          )}
                          Download
                        </button>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full bg-muted text-muted-foreground">
                          Unpaid
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
