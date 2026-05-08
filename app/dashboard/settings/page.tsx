import { getCurrentUser } from "@/lib/auth";

export default async function SettingsPage() {
  const ctx = await getCurrentUser({ requireOrg: true });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="grid sm:grid-cols-2 gap-4">
        <a
          href="/dashboard/settings/integrations"
          className="block border rounded-2xl p-6 hover:border-[#C1FF72] hover:bg-slate-50 transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-black text-[#0f172a] group-hover:text-[#C1FF72] transition-colors">Website Integration</h3>
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-[#C1FF72]/20 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 group-hover:text-[#0f172a]"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
            </div>
          </div>
          <p className="text-sm font-bold text-slate-400">
            Get your booking link, embed code, and chat widget script.
          </p>
        </a>

        <a
          href="/dashboard/settings/team"
          className="block border rounded-2xl p-6 hover:border-[#C1FF72] hover:bg-slate-50 transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-black text-[#0f172a] group-hover:text-[#C1FF72] transition-colors">Team & Roles</h3>
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-[#C1FF72]/20 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 group-hover:text-[#0f172a]"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            </div>
          </div>
          <p className="text-sm font-bold text-slate-400">
            Invite staff, doctors, or receptionists to your dashboard.
          </p>
        </a>
      </div>
    </div>
  );
}
