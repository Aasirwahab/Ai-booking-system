import { getContacts, createContact, deleteContact } from "@/actions/contacts";
import { getNicheSettings } from "@/lib/auth/niche";
import { getOrgId } from "@/lib/auth/org";
import { revalidatePath } from "next/cache";
import { 
  Users, 
  UserPlus, 
  Mail, 
  Phone, 
  Trash2, 
  Search,
  Filter,
  MoreHorizontal,
  ChevronRight,
  ShieldCheck
} from "lucide-react";

export default async function ContactsPage() {
  const orgId = await getOrgId();
  const labels = await getNicheSettings(orgId);
  const contacts = await getContacts();

  async function handleCreate(formData: FormData) {
    "use server";
    await createContact(formData);
    revalidatePath("/dashboard/contacts");
  }

  async function handleDelete(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    await deleteContact(id);
    revalidatePath("/dashboard/contacts");
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-[#0f172a] tracking-tight">{labels.contact_label_plural}</h1>
          <p className="text-slate-400 font-bold mt-1">
            Manage and organize your {labels.contact_label_plural.toLowerCase()} database.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white p-2 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-2 px-4">
            <Search className="w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder={`Search ${labels.contact_label_plural.toLowerCase()}...`}
              className="bg-transparent border-none text-xs font-bold focus:ring-0 w-48"
            />
          </div>
          <button title="Filter" className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm hover:bg-slate-50 transition-colors">
            <Filter className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Add New Section */}
      <div className="premium-card p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-2xl bg-[#C1FF72]/20 flex items-center justify-center">
            <UserPlus className="w-5 h-5 text-[#0f172a]" />
          </div>
          <div>
            <h3 className="text-xl font-black text-[#0f172a]">Quick Add</h3>
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Register new {labels.contact_label.toLowerCase()}</p>
          </div>
        </div>

        <form action={handleCreate} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
            <div className="relative">
              <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
              <input 
                name="full_name" 
                placeholder="John Doe" 
                required 
                className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 text-xs font-bold focus:ring-2 focus:ring-[#C1FF72] transition-all" 
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
              <input 
                name="email" 
                type="email" 
                placeholder="john@example.com" 
                className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 text-xs font-bold focus:ring-2 focus:ring-[#C1FF72] transition-all" 
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
              <input 
                name="phone" 
                placeholder="+1 (555) 000-0000" 
                className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 text-xs font-bold focus:ring-2 focus:ring-[#C1FF72] transition-all" 
              />
            </div>
          </div>
          <div className="flex items-end">
            <button 
              type="submit" 
              className="w-full bg-[#C1FF72] text-[#0f172a] rounded-2xl py-4 text-xs font-black uppercase tracking-widest hover:shadow-[0_8px_20px_rgba(193,255,114,0.4)] transition-all transform hover:-translate-y-0.5 active:scale-95"
            >
              Add {labels.contact_label}
            </button>
          </div>
        </form>
      </div>

      {/* Contacts Table */}
      <div className="premium-card overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-black text-[#0f172a]">Database</h3>
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-1">Total {contacts.length} Records</p>
          </div>
          <button title="More options" className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center hover:bg-slate-100 transition-colors">
            <MoreHorizontal className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-slate-300 uppercase tracking-widest border-b border-slate-50">
                <th className="px-8 py-5">Identity</th>
                <th className="px-8 py-5">Communication</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {contacts.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center justify-center">
                       <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                          <Users className="w-8 h-8 text-slate-200" />
                       </div>
                       <p className="text-sm font-black text-slate-400 italic">No {labels.contact_label_plural.toLowerCase()} found in database.</p>
                    </div>
                  </td>
                </tr>
              )}
              {contacts.map((c: any) => (
                <tr key={c.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-lg font-black text-slate-400 group-hover:bg-[#C1FF72] group-hover:text-[#0f172a] transition-colors uppercase">
                        {c.full_name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs font-black text-[#0f172a]">{c.full_name}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                           <ShieldCheck className="w-3 h-3 text-[#C1FF72]" />
                           <p className="text-[9px] font-black text-slate-300 uppercase">Verified Patient</p>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Mail className="w-3 h-3 text-slate-300" />
                        <span className="text-xs font-bold text-slate-500">{c.email ?? "—"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-3 h-3 text-slate-300" />
                        <span className="text-xs font-bold text-slate-500">{c.phone ?? "—"}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tighter ${
                      c.status === 'active' 
                        ? "bg-[#C1FF72]/20 text-[#0f172a]" 
                        : "bg-slate-100 text-slate-400"
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-end gap-2">
                      <button title="View details" className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-100 transition-colors">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                      <form action={handleDelete}>
                        <input type="hidden" name="id" value={c.id} />
                        <button 
                          type="submit" 
                          className="p-2 rounded-xl bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-500 transition-colors"
                          title="Delete Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
