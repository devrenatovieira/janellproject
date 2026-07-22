import { BrowserRouter, Navigate, Route, Routes, useParams, Link } from "react-router-dom";
import { PublicShell } from "@/components/layout/PublicShell";
import { HomePage } from "@/pages/HomePage";
import { AboutPage } from "@/pages/AboutPage";
import { HistoryPage } from "@/pages/HistoryPage";
import { ContactPage } from "@/pages/ContactPage";
import { SimplePage } from "@/pages/SimplePage";
import { AdminPage } from "@/pages/admin/AdminPage";
import { services, site } from "@/content/site";

function ServicesPage() {
  return (
    <SimplePage title="Serviços" subtitle="Programas oficiais da instituição">
      <div className="grid gap-5 sm:grid-cols-2">
        {services.map((s) => (
          <Link
            key={s.slug}
            to={`/servicos/${s.slug}`}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md"
          >
            <h2 className="text-lg font-semibold text-slate-900">{s.name}</h2>
            <p className="mt-2 text-sm text-slate-600">{s.short}</p>
          </Link>
        ))}
      </div>
    </SimplePage>
  );
}

function ServiceDetailPage() {
  const { slug = "" } = useParams();
  const s = services.find((x) => x.slug === slug);
  if (!s) {
    return (
      <SimplePage title="Serviço não encontrado">
        <Link to="/servicos">Voltar</Link>
      </SimplePage>
    );
  }
  return (
    <SimplePage title={s.name} subtitle={s.tagline}>
      <p className="max-w-3xl text-slate-700 leading-relaxed">
        {s.full ?? s.about ?? s.short}
      </p>
    </SimplePage>
  );
}

function Placeholder({ title }: { title: string }) {
  return (
    <SimplePage title={title} subtitle={`${site.name} · Manaus/AM`}>
      <p className="text-slate-600">
        Conteúdo institucional disponível. Formulários e listagens dinâmicas
        usam a API Express em <code className="text-sm">/api/v1</code>.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link to="/contato" className="rounded-full bg-cyan-800 px-5 py-2 text-sm font-semibold text-white">
          Contato
        </Link>
        <Link to="/doacao" className="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold">
          Doação
        </Link>
      </div>
    </SimplePage>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/*" element={<AdminPage />} />
        <Route element={<PublicShell />}>
          <Route index element={<HomePage />} />
          <Route path="sobre" element={<AboutPage />} />
          <Route path="nossa-historia" element={<HistoryPage />} />
          <Route path="servicos" element={<ServicesPage />} />
          <Route path="servicos/:slug" element={<ServiceDetailPage />} />
          <Route path="contato" element={<ContactPage />} />
          <Route path="doacao" element={<Placeholder title="Doação" />} />
          <Route path="voluntario" element={<Placeholder title="Voluntariado" />} />
          <Route path="familia-acolhedora" element={<Placeholder title="Família Acolhedora" />} />
          <Route path="adocao" element={<Placeholder title="Adoção" />} />
          <Route path="padrinho" element={<Placeholder title="Padrinho" />} />
          <Route path="blog" element={<Placeholder title="Blog" />} />
          <Route path="transparencia" element={<Placeholder title="Transparência" />} />
          <Route path="galeria" element={<Placeholder title="Galeria" />} />
          <Route path="videos" element={<Placeholder title="Vídeos" />} />
          <Route path="midia" element={<Placeholder title="Mídia" />} />
          <Route path="privacidade" element={<Placeholder title="Privacidade" />} />
          <Route path="termos" element={<Placeholder title="Termos" />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
