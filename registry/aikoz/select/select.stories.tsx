import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, screen, userEvent, waitFor, within } from "storybook/test";
import { Select } from "./select";

const meta = {
  title: "Formulaires/Select",
  component: Select,
  tags: ["autodocs"],
  args: {
    label: "Période",
    defaultValue: "30j",
    options: [
      { value: "7j", label: "7 derniers jours" },
      { value: "30j", label: "30 derniers jours" },
      { value: "90j", label: "90 derniers jours" },
    ],
  },
  decorators: [(S) => <div className="w-72"><S /></div>],
} satisfies Meta<typeof Select>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Defaut: Story = { name: "Par défaut" };

export const Groupes: Story = {
  name: "Options groupées",
  args: {
    label: "Source",
    defaultValue: undefined,
    placeholder: "Toutes les sources",
    options: [
      { value: "google", label: "Google", group: "Généralistes" },
      { value: "trustpilot", label: "Trustpilot", group: "Généralistes" },
      { value: "avis", label: "Avis Vérifiés", group: "Certifiés" },
      { value: "opinion", label: "Opinion System", group: "Certifiés", disabled: true },
    ],
  },
};

export const LeFocusClavierEstUnAnneau: Story = {
  name: "Le focus clavier est un anneau, pas un voile",
  parameters: {
    docs: {
      description: {
        story:
          "Aucune teinte du système ne délimite l'option survolée : le voile donne 1,19:1 " +
          "sur le panneau, l'accent aquamarine 1,24. Même cause que le survol des boutons. " +
          "Or `data-highlighted` n'existe pas dans Radix Select v2 — c'est le focus DOM " +
          "réel qui se déplace. L'anneau intérieur en `--ring` tient 5,77:1.",
      },
    },
  },
};

export const QuandPreferrerLeNatif: Story = {
  name: "Quand préférer un `<select>` natif",
  args: { label: "Pays", defaultValue: undefined, placeholder: "Sélectionner…" },
  parameters: {
    docs: {
      description: {
        story:
          "Radix a été choisi pour styler la liste ouverte, poser une coche et grouper. " +
          "Le natif reste supérieur sur un point : il ouvre le sélecteur du système sur " +
          "mobile. Pour un choix long et sans mise en forme — un pays, une année — " +
          "préférer le natif.",
      },
    },
  },
};

export const LeChoixSeFaitAuClavier: Story = {
  name: "Le choix se fait au clavier, et le libellé nomme le champ",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const declencheur = canvas.getByRole("combobox");

    // Le libellé visible EST le nom accessible : c'est ce que garantit le
    // prop obligatoire, et c'est ce qui distingue « Période » de « champ ».
    await expect(declencheur).toHaveAccessibleName(/Période/);

    declencheur.focus();
    await userEvent.keyboard("{Enter}");
    const liste = await screen.findByRole("listbox");
    await expect(liste).toBeInTheDocument();

    // Navigation puis validation : un select qui ne s'ouvre qu'à la souris
    // exclut la moitié de ses utilisateurs, et rien à l'écran ne le montre.
    await userEvent.keyboard("{ArrowDown}");
    await userEvent.keyboard("{Enter}");
    await waitFor(() => expect(screen.queryByRole("listbox")).toBeNull());
    await waitFor(() => expect(document.activeElement).toBe(declencheur));
  },
  parameters: {
    docs: {
      description: {
        story:
          "Ouvrir, parcourir, choisir, refermer — au clavier seul. Un select " +
          "qui ne s'ouvre qu'à la souris exclut la moitié de ses " +
          "utilisateurs, et rien à l'écran ne le montre. Le focus revient au " +
          "déclencheur après la fermeture, sinon la tabulation repart du " +
          "début du document.",
      },
    },
  },
};

export const AvecRepereVisuel: Story = {
  name: "Un repère visuel devant le libellé",
  args: {
    label: "Langue de l'interface",
    defaultValue: "fr",
    options: [
      { value: "fr", label: "Français", icon: <span>🇫🇷</span> },
      { value: "en", label: "English", icon: <span>🇬🇧</span> },
      { value: "es", label: "Español", icon: <span>🇪🇸</span> },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          "L'icône d'une option est **décorative**, toujours : elle est rendue " +
          "`aria-hidden`, et c'est le libellé écrit en toutes lettres qui porte " +
          "le sens. Un drapeau nomme un PAYS, pas une langue — le français ne " +
          "s'arrête pas à la France, et le choix d'un drapeau pour l'anglais " +
          "est arbitraire. Employé seul il serait faux ; employé comme repère, " +
          "il accélère la reconnaissance sans rien affirmer.\n\n" +
          "Le repère est rendu dans `ItemText`, donc repris par le déclencheur " +
          "une fois l'option choisie. Sans cela il n'existerait que dans la " +
          "liste ouverte, c'est-à-dire là où on n'en a pas besoin.",
      },
    },
  },
  play: async ({ canvas, userEvent: ue }) => {
    const u = ue ?? userEvent;
    // Le repère est dans le DÉCLENCHEUR, pas seulement dans la liste : c'est
    // toute la différence entre un repère et une décoration de menu.
    const declencheur = canvas.getByRole("combobox");
    await expect(declencheur.textContent).toContain("🇫🇷");

    // Et il ne dit rien au lecteur d'écran.
    //
    // C'est sur l'OPTION que ça se joue, pas sur le déclencheur : le nom de
    // celui-ci vient de son libellé seul, et le drapeau n'y entre jamais,
    // `aria-hidden` ou pas. Une assertion posée là ne mesurait donc rien —
    // vérifié en retirant `aria-hidden`, le test passait toujours.
    //
    // Deux erreurs de mesure avant celle-ci : `textContent` d'abord, qui
    // ignore `aria-hidden` et accusait le composant à tort ; le nom du
    // déclencheur ensuite, invariant.
    await u.click(declencheur);
    const option = await screen.findByRole("option", { name: /Espa/ });
    await expect(
      option,
      "le drapeau entre dans le nom de l'option : un lecteur d'écran " +
        "annoncera « drapeau Espagne Español ».",
    ).toHaveAccessibleName("Español");

    // On referme. Laisser la liste ouverte à la fin de l'histoire fait
    // tourner l'audit d'accessibilité sur un état transitoire : Radix pose
    // `aria-hidden` sur le reste du document pendant l'ouverture, et axe
    // signale alors un déclencheur focalisable dans une zone masquée —
    // vrai pendant une fraction de seconde, faux comme défaut du composant.
    await u.keyboard("{Escape}");
    await waitFor(async () => {
      await expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });
  },
};
