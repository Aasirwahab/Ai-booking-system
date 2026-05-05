import { getCurrentUser } from "@/lib/auth";

export default async function SettingsPage() {
  const ctx = await getCurrentUser({ requireOrg: true });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="space-y-4">
        <a
          href="/dashboard/settings/integrations"
          className="block border rounded-lg p-4 hover:border-primary/50 transition-colors"
        >
          <h3 className="font-medium">Website Integration</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Get your booking link, embed code, and chat widget script.
          </p>
        </a>
      </div>
    </div>
  );
}
