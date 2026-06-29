import { Link } from "react-router-dom";
import { Bone, Mail, MapPin, Instagram, Facebook, Youtube } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="bg-deep text-deep-foreground mt-24">
      <div className="container-page py-14 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent text-accent-foreground">
              <Bone className="h-5 w-5" />
            </span>
            <span className="font-display font-bold leading-tight">
              Portal Megafauna
              <span className="block text-[10px] font-medium text-accent uppercase tracking-widest">
                Democrática
              </span>
            </span>
          </div>
          <p className="text-sm text-deep-foreground/70 leading-relaxed">
            Divulgação científica e preservação do patrimônio paleontológico de Itapipoca, Ceará.
          </p>
        </div>

        <div>
          <h3 className="font-display font-semibold text-deep-foreground mb-4 text-sm uppercase tracking-wider">
            Navegação
          </h3>
          <ul className="space-y-2 text-sm text-deep-foreground/70">
            <li><Link to="/megafauna" className="hover:text-accent transition-colors">Megafauna</Link></li>
            <li><Link to="/museu" className="hover:text-accent transition-colors">Museu Virtual</Link></li>
            <li><Link to="/pesquisas" className="hover:text-accent transition-colors">Pesquisas</Link></li>
            <li><Link to="/biblioteca" className="hover:text-accent transition-colors">Biblioteca Digital</Link></li>
            <li><Link to="/referencias" className="hover:text-accent transition-colors">Referências</Link></li>
            <li><Link to="/mapa" className="hover:text-accent transition-colors">Mapa Interativo</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-display font-semibold text-deep-foreground mb-4 text-sm uppercase tracking-wider">
            Instituições
          </h3>
          <ul className="space-y-2 text-sm text-deep-foreground/70">
            <li>Equipe do Projeto</li>
            <li>Escolas Parceiras</li>
            <li>Universidades</li>
            <li>Museus Colaboradores</li>
            <li><Link to="/contato" className="hover:text-accent transition-colors">Política de Privacidade</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-display font-semibold text-deep-foreground mb-4 text-sm uppercase tracking-wider">
            Contato
          </h3>
          <ul className="space-y-3 text-sm text-deep-foreground/70">
            <li className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-accent" />
              <span>Itapipoca, Ceará — Brasil</span>
            </li>
            <li className="flex items-start gap-2">
              <Mail className="h-4 w-4 mt-0.5 shrink-0 text-accent" />
              <span>contato@megafaunademocratica.org</span>
            </li>
          </ul>
          <div className="flex gap-2 mt-4">
            <a href="#" aria-label="Instagram" className="grid h-9 w-9 place-items-center rounded-md bg-white/10 hover:bg-accent hover:text-accent-foreground transition-colors">
              <Instagram className="h-4 w-4" />
            </a>
            <a href="#" aria-label="Facebook" className="grid h-9 w-9 place-items-center rounded-md bg-white/10 hover:bg-accent hover:text-accent-foreground transition-colors">
              <Facebook className="h-4 w-4" />
            </a>
            <a href="#" aria-label="YouTube" className="grid h-9 w-9 place-items-center rounded-md bg-white/10 hover:bg-accent hover:text-accent-foreground transition-colors">
              <Youtube className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page py-5 text-xs text-deep-foreground/60 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} Portal Megafauna Democrática. Todos os direitos reservados.</span>
          <span>Patrimônio paleontológico de Itapipoca, Ceará.</span>
        </div>
      </div>
    </footer>
  );
}