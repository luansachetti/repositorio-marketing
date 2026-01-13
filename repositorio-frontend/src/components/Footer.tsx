export default function Footer() {
  const ano = new Date().getFullYear();
  return (
    <footer
      className="
        w-full text-center py-2 text-[10px] text-white/80 leading-tight
        sm:text-xs sm:py-3
      "
    >
      © {ano} Repositório de Marketing • Desenvolvido por{" "}
      <span className="font-semibold text-white">Luan S. Sachetti</span>
    </footer>
  );
}
