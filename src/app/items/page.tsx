import { createItem, deleteItem } from "@/app/items/actions";
import { prisma } from "@/lib/prisma";

export default async function ItemsPage() {
  const [items, contacts] = await Promise.all([
    prisma.item.findMany({
      include: { owner: true },
      orderBy: { name: "asc" },
    }),
    prisma.contact.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <main className="p-8">
      <h1>Items</h1>

      <table className="mt-4 w-full border-collapse text-left">
        <thead>
          <tr>
            <th className="border-b p-2">Name</th>
            <th className="border-b p-2">Quantity</th>
            <th className="border-b p-2">Image URL</th>
            <th className="border-b p-2">RS Stock Number</th>
            <th className="border-b p-2">MPN</th>
            <th className="border-b p-2">Owner</th>
            <th className="border-b p-2" />
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td className="border-b p-2">{item.name}</td>
              <td className="border-b p-2">{item.quantity}</td>
              <td className="border-b p-2">{item.imageUrl ?? "—"}</td>
              <td className="border-b p-2">{item.rsStockNumber ?? "—"}</td>
              <td className="border-b p-2">{item.mpn ?? "—"}</td>
              <td className="border-b p-2">
                {item.owner ? `${item.owner.name} <${item.owner.email}>` : "—"}
              </td>
              <td className="border-b p-2">
                <form action={deleteItem.bind(null, item.id)}>
                  <button type="submit">Delete</button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="mt-8">Add item</h2>
      <form action={createItem} className="mt-2 flex flex-col gap-2">
        <label>
          Name
          <input type="text" name="name" required />
        </label>
        <label>
          Quantity
          <input type="number" name="quantity" required />
        </label>
        <label>
          Image URL
          <input type="text" name="imageUrl" />
        </label>
        <label>
          RS Stock Number
          <input type="text" name="rsStockNumber" />
        </label>
        <label>
          MPN
          <input type="text" name="mpn" />
        </label>
        <label>
          Owner
          <select name="ownerEmail" defaultValue="">
            <option value="">None</option>
            {contacts.map((contact) => (
              <option key={contact.email} value={contact.email}>
                {contact.name} ({contact.email})
              </option>
            ))}
          </select>
        </label>
        <button type="submit">Add item</button>
      </form>
    </main>
  );
}
