export default function Footer() {
  const ano = new Date().getFullYear();
  return (
    <footer className="w-full text-center py-3 text-xs text-white/80">
      © {ano} Repositório de Etiquetas e Promoções • Desenvolvido por{" "}
      <span className="font-semibold text-white">Luan S. Sachetti</span>
    </footer>
  );
}
