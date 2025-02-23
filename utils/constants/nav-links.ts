import { HelpCircleIcon, EarthLock, Blocks, NewspaperIcon, Contact, PieChart } from "lucide-react";

export const NAV_LINKS = [
    {
        title: "Início",
        href: "/",
    },
    {
        title: "Sobre",
        href: "#sobre",
    },
    {
        title: "Preços",
        href: "#precos",
    },
    {
        title: "Links úteis",
        href: "#",
        menu: [
            {
                title: "Termos de uso",
                tagline: "Consulte nosso termos de uso.",
                href: "#",
                icon: NewspaperIcon,
            },
            {
                title: "Política de privacidade",
                tagline: "Descubra como protegemos seus dados.",
                href: "#",
                icon: EarthLock,
            },
            {
                title: "Ajuda",
                tagline: "Obtenha respostas para suas perguntas.",
                href: "#",
                icon: HelpCircleIcon,
            },
            {
                title: "Contato",
                tagline: "Entre em contato conosco.",
                href: "#",
                icon: Contact,
            },
        ]
    },
    {
        title: "Características",
        href: "#",
        menu: [
            {
                title: "Organização simplificada",
                tagline: "Crie formulários personalizados em minutos.",
                href: "#",
                icon: Blocks,
            },
            {
                title: "Análise de dados",
                tagline: "Personalize seus formulários com facilidade.",
                href: "#",
                icon: PieChart,
            },
        ],
    },
];