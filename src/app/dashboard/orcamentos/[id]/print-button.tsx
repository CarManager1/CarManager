'use client'

import { Download } from 'lucide-react'

export default function DownloadPdfButton() {
  
  const handleDownloadPDF = async () => {
    // 1. Importar a biblioteca dinamicamente (para evitar erros no Next.js)
    const html2pdf = (await import('html2pdf.js')).default

    // 2. Selecionar o elemento que queres transformar em PDF
    // Tens de garantir que a div branca do orçamento tem id="area-impressao"
    const element = document.getElementById('area-impressao')

    if (!element) {
      alert('Erro: Não encontrei o orçamento para gerar o PDF.')
      return
    }

    // 3. Configurações do PDF
    const opt = {
      margin:       0, // Sem margens brancas extra
      filename:     'orcamento-revision.pdf', // Nome do ficheiro
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true }, // scale: 2 melhora a qualidade
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    }

    // 4. Gerar e Descarregar
    html2pdf().set(opt).from(element).save()
  }

  return (
    <button
      onClick={handleDownloadPDF}
      className="flex items-center gap-2 bg-zinc-900 text-white px-4 py-2 rounded-md hover:bg-zinc-800 transition-colors"
    >
      <Download size={18} />
      Descarregar PDF
    </button>
  )
}