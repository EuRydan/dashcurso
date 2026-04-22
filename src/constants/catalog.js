/**
 * CATALOGO CENTRAL DE CONTEÚDO
 * Fonte da verdade para Cursos, Aulas e Workshops.
 */

export const COURSES = [
  {
    id: 'course-master-ui',
    title: 'Mastering UI/UX Dashboard',
    slug: 'master-ui',
    thumbnail: 'https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?q=80&w=800&auto=format&fit=crop',
    lessons: [
      {
        id: 'lesson-1',
        vimeo_id: '76979871',
        title: 'Apresentação do Projeto',
        duration: '10:45',
        module: 'Módulo 01'
      },
      {
        id: 'lesson-2',
        vimeo_id: '1025515286',
        title: 'Instalação das Ferramentas',
        duration: '15:20',
        module: 'Módulo 01'
      },
      {
        id: 'lesson-3',
        vimeo_id: '1025515286',
        title: 'Primeiros Passos no Dashboard',
        duration: '08:30',
        module: 'Módulo 01'
      }
    ]
  }
];

export const WORKSHOPS = [
  {
    id: 'ws-1',
    vimeoId: '76979871',
    title: "#1 Real Talk: Filipe Canto",
    subtitle: "Gerente de Projetos",
    description: "Um bate papo real sobre mercado, carreira e skills.",
    duration: "1h 12min",
    date: "GRAVAÇÃO DISPONÍVEL",
    category: "Real Talk",
    cover: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop",
    isNew: true,
    timestamps: [
      { seconds: 0, title: "Introdução e Carreira", description: "Início do papo e trajetória do Filipe." },
      { seconds: 645, title: "Transição para Gestão", description: "Como migrar de dev para PM." },
      { seconds: 1230, title: "Soft Skills no Mercado", description: "O que as empresas realmente buscam." }
    ]
  },
  {
    id: 'ws-2',
    vimeoId: '267475148',
    title: "Masterclass de Prototipagem",
    subtitle: "Advanced Figma",
    description: "Dominando variáveis complexas e advanced components no Figma.",
    duration: "2h 10min",
    date: "25 MAR",
    category: "UI/UX",
    cover: "https://images.unsplash.com/photo-1618761714954-0b8cd0026356?q=80&w=800&auto=format&fit=crop",
    isNew: false,
    timestamps: [
      { seconds: 140, title: "Configuração do Documento", description: "Estruturando camadas para protótipos." },
      { seconds: 945, title: "Trabalhando com Variáveis", description: "Lógica e condicionais no Figma." }
    ]
  }
];
