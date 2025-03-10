import { HelpCircleIcon, EarthLock, Blocks, NewspaperIcon, Contact, PieChart } from "lucide-react";

export const NAV_LINKS = [
    {
        title: "Início",
        href: "/",
    },
    {
        title: "Características",
        href: "#features",
        menu: [
            {
                title: "Organização simplificada",
                tagline: "Crie formulários personalizados em minutos.",
                href: "#features",
                icon: Blocks,
            },
            {
                title: "Análise de dados",
                tagline: "Personalize seus formulários com facilidade.",
                href: "#features",
                icon: PieChart,
            },
        ],
    },
    {
        title: "Processo",
        href: "#processo",
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
];