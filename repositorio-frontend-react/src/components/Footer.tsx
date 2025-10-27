export default function Footer() {
  const ano = new Date().getFullYear();
  return (
    <footer className="w-full text-center py-3 text-xs text-gray-500">
      © {ano} Repositório de Etiquetas e Promoções • Desenvolvido por{" "}
      <span className="font-medium text-gray-600">Luan S. Sachetti</span>
    </footer>
  );
}
