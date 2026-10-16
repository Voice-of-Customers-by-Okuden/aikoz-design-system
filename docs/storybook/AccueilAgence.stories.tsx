import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { AccueilAgence } from "./accueil-agence";

const meta = {
  title: "Assemblages/Accueil agence",
  component: AccueilAgence,
  parameters: { layout: "fullscreen" },
  // ── La marque du PRODUIT, pas celle de l'agence suivie ──────────────
  //
  // Le premier jet réglait cette histoire sur `generali`, parce que l'écran
  // d'origine affiche « Agence · Assurance Generali - Paris ». C'était
  // confondre la DONNÉE avec la MARQUE : l'agence suivie est une agence
  // Generali, le produit qui l'affiche est Aikoz. La marque blanche existe
  // et se démontre — mais dans son histoire à elle, ci-dessous.
  globals: { marque: "aikoz", theme: "clair" },
} satisfies Meta<typeof AccueilAgence>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Defaut: Story = {
  name: "L'accueil, refait avec nos composants",
  tags: ["autodocs"],
  parameters: {
    docs: { description: { story:
      "**La vision cible d'Arnaud, rejouée avec le design system.** Son prototype " +
      "enfreignait cinq règles ; chacune est corrigée ici, et chacune avait une raison.\\n\\n" +
      "Les compteurs de navigation étaient rouges — le rouge est le rôle d'erreur, et " +
      "« 6 avis » n'est pas une erreur. Les boutons avaient un rayon de 6 px, valeur " +
      "absente de l'échelle Aikoz (2/4/8/12/16/9999) et venue du Claude Design par " +
      "copie. « Donner votre voix » était une pilule vert pâle à texte bleu, ni " +
      "variante ni rôle. Et deux encarts portaient une teinte de SUCCÈS pour une " +
      "action suggérée et une idée de post — ni l'une ni l'autre n'est un succès.\\n\\n" +
      "L'écran ne porte pas sa barre latérale : la coquille est un sujet à part, et " +
      "celle d'ADP porte le nom d'un produit client." } },
  },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);

    // ── Un seul `main`, un seul `h1` ──────────────────────────────────────
    await expect(canvasElement.querySelectorAll("main")).toHaveLength(1);
    await expect(c.getAllByRole("heading", { level: 1 })).toHaveLength(1);

    // ── Les deux composants neufs sont là, et mesurables ─────────────────
    await expect(
      c.getByRole("meter", { name: "Votre note Google" }),
    ).toHaveAttribute("aria-valuetext", "4,90 sur 5");
    await expect(c.getByText("0 / 5 complétées")).toBeVisible();
    await expect(c.getByText("0 / 3 sections")).toBeVisible();

    // ── AUCUNE teinte de succès sur les deux encarts ─────────────────────
    //
    // C'est l'infraction la plus facile à refaire : le vert pâle est joli et
    // il ne coûte rien à écrire. Cette assertion tombe si quelqu'un le
    // remet, et le message dit pourquoi.
    const encarts = [...canvasElement.querySelectorAll("div")].filter((d) =>
      /Action suggérée|Idée de post/.test(d.textContent ?? ""),
    );
    await expect(encarts.length > 0).toBe(true);
    for (const e of encarts) {
      const fond = getComputedStyle(e).backgroundColor;
      await expect(
        /success/i.test(e.className),
        `un encart porte une classe de succès (${e.className}) : une action ` +
          `suggérée et une idée de post ne sont pas des succès.`,
      ).toBe(false);
      void fond;
    }
  },
};

export const EnMarqueBlanche: Story = {
  name: "Le même écran, livré en marque blanche",
  globals: { marque: "generali", theme: "clair" },
  parameters: {
    docs: { description: { story:
      "Le même code, rendu sous Generali. Rien n'est dupliqué : `data-brand` " +
      "sur la racine suffit. Ce qui change — le logo, la couleur d'appui, le " +
      "rayon, la police. Ce qui ne change pas — l'anneau de note reste vert, " +
      "parce qu'une bonne note est une bonne note sous toutes les marques : " +
      "le statut est un rôle du PRODUIT, pas de l'identité." } },
  },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    // L'anneau de note ne suit PAS la marque : il lit `--success-fill`, qui
    // appartient à la couche produit. Si quelqu'un le branchait sur la
    // couleur de marque, une bonne note virerait au rouge chez Generali.
    const anneau = canvasElement.querySelector("circle[stroke-dasharray]")!;
    await expect(anneau.getAttribute("stroke")).toContain("success");
    await expect(c.getByText("0 / 5 complétées")).toBeVisible();
  },
};
