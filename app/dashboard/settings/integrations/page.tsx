import { getCurrentUser } from "@/lib/auth";
import { IntegrationCodes } from "./integration-codes";

export default async function IntegrationsPage() {
  const ctx = await getCurrentUser({ requireOrg: true });
  const slug = ctx.org!.slug;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Website Integration</h1>
      <p className="text-muted-foreground mb-8">
        Add booking to your existing website in minutes.
      </p>
      <IntegrationCodes appUrl={appUrl} slug={slug} />
    </div>
  );
}
