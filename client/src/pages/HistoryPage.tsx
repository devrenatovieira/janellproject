import { history } from "@/content/site";
import { SimplePage } from "./SimplePage";

export function HistoryPage() {
  return (
    <SimplePage
      title="Nossa história"
      subtitle={`${history.author} · ${history.authorRole}`}
    >
      <article className="max-w-3xl whitespace-pre-line text-base leading-relaxed text-slate-700">
        {history.fullText}
      </article>
    </SimplePage>
  );
}
