import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor, within } from "storybook/test";
import { ToastProvider } from "@registry/aikoz/toast/toast";
// `?raw` : la page de doc montre le fichier RÉEL, pas une copie qui
// divergerait. C'est ce que « Copy code » met dans le presse-papier.
import source from "./circuit-de-validation.tsx?raw";
import { CircuitDeValidation } from "./circuit-de-validation";

// ─── Storybook ───────────────────────────────────────────────────────────────

const meta = {
  title: "Assemblages/Circuit de validation",
  component: CircuitDeValidation,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      source: {
        code: source,
        language: "tsx",
      },
      // Le code est DÉPLIÉ d'entrée. Replié, il demandait deux clics à
      // deviner : trouver l'entrée « Docs » dans la barre latérale, puis
      // « Show code ». Personne ne l'a trouvé, et c'est le signe que
      // personne ne le trouvera. Un assemblage existe POUR être copié : son
      // code est le contenu de la page, pas une option.
      //
      // `canvas.sourceState` et non `source.state` : le second ne gouverne
      // que le bloc `Source` posé à la main, pas le `Canvas` que génère
      // autodocs.
      canvas: { sourceState: "shown" },
    },
  },
  globals: { marque: "adp" },
  decorators: [
    (S) => (
      <ToastProvider>
        <div className="min-w-0 p-4">
          <S />
        </div>
      </ToastProvider>
    ),
  ],
} satisfies Meta<typeof CircuitDeValidation>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Defaut: Story = {
  name: "Par défaut — marque ADP, thème clair",
  globals: { theme: "clair" },
  parameters: {
    docs: {
      description: {
        story:
          "Bâti sur `KanbanBoard`, comme `ResponseKanban` — **le même tableau, " +
          "d'autres colonnes**.\n\n" +
          "### Ce n'est pas « État des réponses »\n\n" +
          "La question s'est posée, et les deux écrans se ressemblent assez " +
          "pour qu'elle se pose. Ils répondent pourtant à deux **modèles de " +
          "gouvernance** différents :\n\n" +
          "| | État des réponses | Circuit de validation |\n| --- | --- | --- |\n" +
          "| la réponse est | **automatique** | **écrite à la main** |\n" +
          "| elle part | demain, toute seule | quand un responsable l'accepte |\n" +
          "| on peut | la modifier jusque-là | la corriger si elle revient |\n" +
          "| l'axe des colonnes | l'**urgence** | l'**étape** |\n\n" +
          "Le sous-titre par défaut de la première colonne d'`État des " +
          "réponses` disait « À valider avant publication J+1 ». Il décrivait " +
          "un circuit d'approbation alors qu'il habillait des réponses qui " +
          "n'attendent personne — c'est ce mot-là qui faisait confondre les " +
          "deux écrans, pas leur structure. Il dit désormais « Publiées " +
          "demain, modifiables jusque-là ».",
      },
    },
  },
};

export const LEtatVitSurLaCartePasDansLeToast: Story = {
  name: "L'état vit sur la carte, pas dans le toast",
  globals: { theme: "clair" },
  parameters: {
    docs: {
      description: {
        story:
          "« Réponse envoyée à votre responsable, en attente de validation » " +
          "n'est pas un message passager : c'est **l'état de la réponse**.\n\n" +
          "Un toast disparaît en six secondes. Quelqu'un qui revient sur son " +
          "écran dix minutes plus tard doit toujours savoir où en est son " +
          "travail — et il ne le saura que si l'information est écrite sur la " +
          "carte.\n\n" +
          "Le toast confirme le **geste**, au moment où on le fait. Les deux, " +
          "jamais l'un à la place de l'autre. Cette histoire mesure les deux " +
          "moitiés : le toast apparaît, et la pastille reste après lui.",
      },
    },
  },
  play: async ({ canvasElement, userEvent }) => {
    const c = within(canvasElement);
    await userEvent.click(
      c.getByRole("button", { name: "Envoyer pour validation" }),
    );

    // 1. Le geste est confirmé.
    await waitFor(() =>
      expect(document.body).toHaveTextContent(
        "Réponse envoyée à votre responsable.",
      ),
    );

    // 2. Et l'état est ÉCRIT sur la carte — c'est lui qui survivra au toast.
    const attente = c.getAllByText("En attente de validation");
    // Une fois dans le titre de la colonne, une fois sur la carte déplacée.
    await expect(attente.length).toBeGreaterThanOrEqual(2);
  },
};
