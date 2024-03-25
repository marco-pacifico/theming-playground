import prisma from "../../prisma/db";
export async function fetchThemes() {
    // Fetch themes from db using Prisma
    const themes = await prisma.theme.findMany();
    return themes;
}

export async function fetchThemeById(id: string) {
    // Fetch theme by name from db using Prisma
    const theme = await prisma.theme.findUnique({
        where: {
            id: id,
        },
    });
    return theme;
}