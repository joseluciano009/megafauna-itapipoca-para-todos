import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { BackToTop } from "@/components/back-to-top";
import Index from "@/routes/index";
import Megafauna from "@/routes/megafauna.index";
import MegafaunaSlug from "@/routes/megafauna.$slug";
import Museu from "@/routes/museu";
import Pesquisas from "@/routes/pesquisas";
import Pesquisadores from "@/routes/pesquisadores";
import Biblioteca from "@/routes/biblioteca";
import Mapa from "@/routes/mapa";
import Contato from "@/routes/contato";
import Referencias from "@/routes/referencias";
import NotFound from "@/routes/not-found";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <div className="flex min-h-dvh flex-col">
      <ScrollToTop />
      <SiteHeader />
      <main className="flex-1 pt-16">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/megafauna" element={<Megafauna />} />
          <Route path="/megafauna/:slug" element={<MegafaunaSlug />} />
          <Route path="/museu" element={<Museu />} />
          <Route path="/pesquisas" element={<Pesquisas />} />
          <Route path="/pesquisadores" element={<Pesquisadores />} />
          <Route path="/biblioteca" element={<Biblioteca />} />
          <Route path="/mapa" element={<Mapa />} />
          <Route path="/contato" element={<Contato />} />
          <Route path="/referencias" element={<Referencias />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <SiteFooter />
      <BackToTop />
    </div>
  );
}