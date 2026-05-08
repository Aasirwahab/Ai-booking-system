import { OrganizationProfile } from "@clerk/nextjs";

export default function TeamSettingsPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-[#0f172a] mb-2">Team & Roles</h1>
        <p className="text-slate-400 font-bold">
          Invite staff, manage permissions, and control access to your organization dashboard.
        </p>
      </div>

      {/* 
        Clerk's OrganizationProfile component automatically handles:
        - Inviting new members via email
        - Assigning roles (Admin, Member, etc.)
        - Revoking access
        - Viewing pending invitations
      */}
      <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm">
        <OrganizationProfile
          appearance={{
            elements: {
              rootBox: "w-full",
              cardBox: "w-full shadow-none",
              card: "w-full max-w-full shadow-none border-0",
              pageScrollBox: "w-full p-6",
            },
          }}
          routing="hash"
        />
      </div>
    </div>
  );
}
