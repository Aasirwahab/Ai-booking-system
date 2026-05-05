import { getContacts, createContact, deleteContact } from "@/actions/contacts";
import { getNicheSettings } from "@/lib/auth/niche";
import { getOrgId } from "@/lib/auth/org";
import { revalidatePath } from "next/cache";

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
    <div>
      <h1 className="text-2xl font-bold mb-6">{labels.contact_label_plural}</h1>

      <form action={handleCreate} className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8 p-4 border rounded-lg">
        <input name="full_name" placeholder="Full name" required className="border rounded px-3 py-2 text-sm" />
        <input name="email" type="email" placeholder="Email" className="border rounded px-3 py-2 text-sm" />
        <input name="phone" placeholder="Phone" className="border rounded px-3 py-2 text-sm" />
        <button type="submit" className="bg-primary text-primary-foreground rounded px-4 py-2 text-sm font-medium hover:bg-primary/90">
          Add {labels.contact_label}
        </button>
      </form>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Name</th>
              <th className="text-left px-4 py-3 font-medium">Email</th>
              <th className="text-left px-4 py-3 font-medium">Phone</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {contacts.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  No {labels.contact_label_plural.toLowerCase()} yet
                </td>
              </tr>
            )}
            {contacts.map((c: any) => (
              <tr key={c.id} className="border-t">
                <td className="px-4 py-3 font-medium">{c.full_name}</td>
                <td className="px-4 py-3">{c.email ?? "—"}</td>
                <td className="px-4 py-3">{c.phone ?? "—"}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-0.5 text-xs text-green-700">
                    {c.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <form action={handleDelete}>
                    <input type="hidden" name="id" value={c.id} />
                    <button type="submit" className="text-destructive text-xs hover:underline">Remove</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
