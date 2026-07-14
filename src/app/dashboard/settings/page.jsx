"use client";

import { useEffect, useMemo, useState } from "react";
import { User, Shield, Save, Loader2, KeyRound } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { apiService } from "@/lib/api";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const { t } = useLanguage();
  const tr = (key, fallback) => {
    const value = t?.(key);
    if (!value) return fallback;
    // If translation missing, some i18n libs return the key itself.
    if (value === key) return fallback;
    return value;
  };
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  const [pwLoading, setPwLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const canSaveProfile = useMemo(() => Boolean(fullName.trim()), [fullName]);

  useEffect(() => {
    if (!token) return;
    setLoadingProfile(true);
    apiService
      .getUserProfile(token, { forceRefresh: true })
      .then((res) => {
        const u = res?.user;
        setFullName(u?.full_name || u?.username || "");
        setEmail(u?.email || "");
      })
      .catch(() => toast.error("Failed to load settings."))
      .finally(() => setLoadingProfile(false));
  }, [token]);

  const handleSave = async () => {
    if (!token) return;
    if (!canSaveProfile) {
      toast.error("Name is required.");
      return;
    }
    setLoading(true);
    try {
      const res = await apiService.updateUserProfile({ full_name: fullName }, token);
      if (res?.success) toast.success("Profile updated.");
      else toast.error(res?.error || "Failed to update profile.");
    } catch (e) {
      toast.error(e?.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!token) return;
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill all password fields.");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }
    setPwLoading(true);
    try {
      const res = await apiService.changePassword(currentPassword, newPassword, token);
      if (res?.success) {
        toast.success("Password updated.");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(res?.error || "Failed to update password.");
      }
    } catch (e) {
      toast.error(e?.message || "Failed to update password.");
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="relative p-4 rounded-xl bg-card shadow-md border border-border overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-tr from-gold-solid/20 to-gold-muted/10 opacity-10 rounded-full blur-3xl" />
        <div className="relative z-10">
          <h1 className="text-2xl font-bold text-foreground mb-1">
            {tr("orgPortal.settings", "Settings")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {tr("orgPortal.manageSettings", "Manage your settings and preferences")}
          </p>
        </div>
      </div>

      <div className="space-y-6 max-w-4xl">
        <Card className="p-6 bg-card border border-border rounded-xl shadow-sm text-foreground">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gold-solid/10 rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-gold-solid" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                {tr("orgPortal.organizationInformation", "Account Information")}
              </h2>
              <p className="text-sm text-muted-foreground">
                {tr("orgPortal.updateOrganizationDetails", "Update your details")}
              </p>
            </div>
          </div>
          {loadingProfile ? (
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading profile…
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {tr("orgPortal.organizationName", "Full name")}
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="block w-full px-4 py-2 bg-background border border-input rounded-lg text-foreground focus:ring-2 focus:ring-ring focus:border-transparent transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {tr("auth.email", "Email")}
                </label>
                <input
                  type="email"
                  value={email}
                  readOnly
                  className="block w-full px-4 py-2 bg-background border border-input rounded-lg text-foreground/80 focus:ring-0 focus:border-input transition-colors opacity-80 cursor-not-allowed"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Email can’t be changed from Settings right now.
                </p>
              </div>
            </div>
          )}
        </Card>

        {/*
        <Card className="p-6 bg-card border border-border rounded-xl shadow-sm text-foreground">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
              <Bell className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                {tr("orgPortal.notifications", "Notifications")}
              </h2>
              <p className="text-sm text-muted-foreground">
                {tr("orgPortal.notificationSettings", "Notification settings")}
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="text-sm font-medium text-foreground">
                  {tr("orgPortal.emailNotifications", "Email Notifications")}
                </span>
                <p className="text-xs text-muted-foreground">
                  {tr("orgPortal.receiveEmailNotifications", "Receive email notifications")}
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.notifications.email}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    notifications: { ...prev.notifications, email: e.target.checked },
                  }))
                }
                aria-label={tr("orgPortal.emailNotifications", "Email Notifications")}
                className="w-5 h-5 text-gold-solid accent-gold-solid rounded bg-background border border-input focus:ring-2 focus:ring-ring focus:border-transparent cursor-pointer"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="text-sm font-medium text-foreground">
                  {tr("orgPortal.pushNotifications", "Push Notifications")}
                </span>
                <p className="text-xs text-muted-foreground">
                  {tr("orgPortal.receivePushNotifications", "Receive push notifications")}
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.notifications.push}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    notifications: { ...prev.notifications, push: e.target.checked },
                  }))
                }
                aria-label={tr("orgPortal.pushNotifications", "Push Notifications")}
                className="w-5 h-5 text-gold-solid accent-gold-solid rounded bg-background border border-input focus:ring-2 focus:ring-ring focus:border-transparent cursor-pointer"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="text-sm font-medium text-foreground">
                  {tr("orgPortal.projectUpdates", "Project Updates")}
                </span>
                <p className="text-xs text-muted-foreground">
                  {tr("orgPortal.getNotifiedProjectChanges", "Get notified when projects change")}
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.notifications.projectUpdates}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    notifications: { ...prev.notifications, projectUpdates: e.target.checked },
                  }))
                }
                aria-label={tr("orgPortal.projectUpdates", "Project Updates")}
                className="w-5 h-5 text-gold-solid accent-gold-solid rounded bg-background border border-input focus:ring-2 focus:ring-ring focus:border-transparent cursor-pointer"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="text-sm font-medium text-foreground">
                  {tr("orgPortal.creditAlerts", "Credit Alerts")}
                </span>
                <p className="text-xs text-muted-foreground">
                  {tr("orgPortal.getNotifiedCreditsLow", "Get notified when credits are low")}
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.notifications.creditAlerts}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    notifications: { ...prev.notifications, creditAlerts: e.target.checked },
                  }))
                }
                aria-label={tr("orgPortal.creditAlerts", "Credit Alerts")}
                className="w-5 h-5 text-gold-solid accent-gold-solid rounded bg-background border border-input focus:ring-2 focus:ring-ring focus:border-transparent cursor-pointer"
              />
            </label>
          </div>
        </Card>
        */}

        {/*
        <Card className="p-6 bg-card border border-border rounded-xl shadow-sm text-foreground">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gold-solid/10 rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-gold-solid" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                {tr("orgPortal.preferences", "Preferences")}
              </h2>
              <p className="text-sm text-muted-foreground">
                {tr("orgPortal.preferenceSettings", "Preference settings")}
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {tr("common.language", "Language")}
              </label>
              <select
                value={settings.preferences.language}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    preferences: { ...prev.preferences, language: e.target.value },
                  }))
                }
                className="block w-full px-4 py-2 bg-background border border-input rounded-lg text-foreground focus:ring-2 focus:ring-ring focus:border-transparent transition-colors cursor-pointer"
              >
                <option value="en" className="bg-card text-foreground">
                  {tr("common.english", "English")}
                </option>
                <option value="es" className="bg-card text-foreground">
                  {tr("common.spanish", "Spanish")}
                </option>
                <option value="fr" className="bg-card text-foreground">
                  French
                </option>
                <option value="de" className="bg-card text-foreground">
                  German
                </option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {tr("orgPortal.timezone", "Timezone")}
              </label>
              <select
                value={settings.preferences.timezone}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    preferences: { ...prev.preferences, timezone: e.target.value },
                  }))
                }
                className="block w-full px-4 py-2 bg-background border border-input rounded-lg text-foreground focus:ring-2 focus:ring-ring focus:border-transparent transition-colors cursor-pointer"
              >
                <option value="UTC" className="bg-card text-foreground">
                  UTC
                </option>
                <option value="America/New_York" className="bg-card text-foreground">
                  Eastern Time
                </option>
                <option value="America/Chicago" className="bg-card text-foreground">
                  Central Time
                </option>
                <option value="America/Denver" className="bg-card text-foreground">
                  Mountain Time
                </option>
                <option value="America/Los_Angeles" className="bg-card text-foreground">
                  Pacific Time
                </option>
              </select>
            </div>
          </div>
        </Card>
        */}

        <Card className="p-6 bg-card border border-border rounded-xl shadow-sm text-foreground">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
              <KeyRound className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                {tr("orgPortal.security", "Security")}
              </h2>
              <p className="text-sm text-muted-foreground">
                Change your password.
              </p>
            </div>
          </div>
          <form className="space-y-4" onSubmit={handleChangePassword}>
            <div>
              <label htmlFor="current_password" className="block text-sm font-medium text-foreground mb-2">
                Current password
              </label>
              <input
                id="current_password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="block w-full px-4 py-2 bg-background border border-input rounded-lg text-foreground focus:ring-2 focus:ring-ring focus:border-transparent transition-colors"
                autoComplete="current-password"
              />
            </div>
            <div>
              <label htmlFor="new_password" className="block text-sm font-medium text-foreground mb-2">
                New password
              </label>
              <input
                id="new_password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="block w-full px-4 py-2 bg-background border border-input rounded-lg text-foreground focus:ring-2 focus:ring-ring focus:border-transparent transition-colors"
                autoComplete="new-password"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Must be at least 8 characters.
              </p>
            </div>
            <div>
              <label htmlFor="confirm_password" className="block text-sm font-medium text-foreground mb-2">
                Confirm new password
              </label>
              <input
                id="confirm_password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full px-4 py-2 bg-background border border-input rounded-lg text-foreground focus:ring-2 focus:ring-ring focus:border-transparent transition-colors"
                autoComplete="new-password"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={pwLoading}
                className="w-full sm:w-auto bg-red-600/90 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-ring transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
              >
                {pwLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Updating…
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    Update Password
                  </>
                )}
              </button>
            </div>
          </form>
        </Card>

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={loading || loadingProfile}
            className="w-full sm:w-auto bg-gold-gradient text-primary-foreground py-3 px-6 rounded-lg font-semibold hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-ring transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {tr("orgPortal.saving", "Saving...")}
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                {tr("orgPortal.saveSettings", "Save Settings")}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

