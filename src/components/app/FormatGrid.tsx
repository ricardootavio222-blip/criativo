import { formats } from "@/data/formats";
import { CreationCard } from "./CreationCard";

export function FormatGrid() {
  return (
    <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {formats.map((f) => <li key={f.id}><CreationCard format={f} /></li>)}
    </ul>
  );
}
