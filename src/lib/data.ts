import prisma from "../../prisma/db";
export async function fetchThemes() {
    // Fetch themes from db using Prisma
    const themes = await prisma.theme.findMany();
    return themes;
}