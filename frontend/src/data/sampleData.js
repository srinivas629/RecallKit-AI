export const SAMPLE_NOTES = `Cellular Respiration and Energy Production

Cellular respiration breaks down glucose to produce ATP (adenosine triphosphate) in three main stages:

1. Glycolysis:
Takes place in the cytoplasm of the cell. It is an anaerobic process (requires no oxygen) that converts one glucose molecule into two molecules of pyruvate, generating a net gain of 2 ATP and 2 NADH.

2. The Krebs Cycle (Citric Acid Cycle):
Occurs inside the mitochondrial matrix. Acetyl-CoA is oxidized to produce ATP, NADH, FADH2, and releases carbon dioxide (CO2) as a metabolic byproduct.

3. Oxidative Phosphorylation:
Occurs along the inner mitochondrial membrane. Electrons flow through transport protein complexes, pumping protons across the membrane to drive ATP synthase via chemiosmosis. Oxygen acts as the final electron acceptor, combining with protons to form water (H2O).`;

export const SAMPLE_STUDY_MATERIAL = {
  quiz: [
    {
      id: 1,
      question: "Where in the eukaryotic cell does glycolysis take place, and does it require oxygen?",
      options: [
        "Mitochondrial matrix, aerobic (requires oxygen)",
        "Cytoplasm, anaerobic (does not require oxygen)",
        "Inner mitochondrial membrane, aerobic",
        "Nucleus, anaerobic"
      ],
      correct_index: 1,
      explanation: "Glycolysis takes place in the cytoplasm (cytosol) of the cell and is an anaerobic process that proceeds without oxygen."
    },
    {
      id: 2,
      question: "What is the net ATP yield produced specifically during the glycolysis stage per glucose molecule?",
      options: [
        "4 ATP",
        "32 ATP",
        "2 ATP",
        "1 ATP"
      ],
      correct_index: 2,
      explanation: "Glycolysis consumes 2 ATP during the investment phase and generates 4 ATP in the payoff phase, resulting in a net yield of 2 ATP."
    },
    {
      id: 3,
      question: "Which molecule serves as the terminal (final) electron acceptor in the electron transport chain?",
      options: [
        "Carbon dioxide (CO2)",
        "Water (H2O)",
        "Pyruvate",
        "Oxygen (O2)"
      ],
      correct_index: 3,
      explanation: "Oxygen serves as the final electron acceptor at Complex IV of the electron transport chain, binding protons to form water."
    },
    {
      id: 4,
      question: "How does ATP synthase generate ATP during oxidative phosphorylation?",
      options: [
        "By pumping protons out of the cell into extracellular fluid",
        "By harnessing the flow of protons returning across the membrane down their electrochemical gradient (chemiosmosis)",
        "By directly splitting glucose into pyruvate and lactate",
        "By converting carbon dioxide into ribose sugar"
      ],
      correct_index: 1,
      explanation: "Protons that were accumulated in the intermembrane space flow back into the mitochondrial matrix through ATP synthase via chemiosmosis, driving ATP synthesis."
    },
    {
      id: 5,
      question: "What chemical byproduct is produced and released during the Citric Acid (Krebs) Cycle?",
      options: [
        "Carbon dioxide (CO2)",
        "Molecular Nitrogen (N2)",
        "Lactic acid",
        "Ozone (O3)"
      ],
      correct_index: 0,
      explanation: "Carbon dioxide (CO2) is released during both pyruvate oxidation and the Krebs cycle as carbon atoms are cleaved from organic intermediates."
    }
  ],
  flashcards: [
    {
      id: 1,
      front: "What is Glycolysis and where does it occur?",
      back: "The metabolic breakdown of one glucose molecule into two pyruvates, yielding a net 2 ATP and 2 NADH. It occurs in the cytoplasm and requires no oxygen."
    },
    {
      id: 2,
      front: "What is the role of Oxygen in cellular respiration?",
      back: "Oxygen acts as the final electron acceptor in the electron transport chain, accepting electrons and protons to form water (H2O)."
    },
    {
      id: 3,
      front: "Where does the Citric Acid (Krebs) Cycle occur?",
      back: "In the mitochondrial matrix, where Acetyl-CoA is oxidized to produce NADH, FADH2, ATP, and carbon dioxide (CO2)."
    },
    {
      id: 4,
      front: "How does Chemiosmosis produce ATP?",
      back: "A proton gradient created by the electron transport chain powers ATP synthase as protons flow down their concentration gradient back into the mitochondrial matrix."
    },
    {
      id: 5,
      front: "Which stage produces the majority of ATP during cellular respiration?",
      back: "Oxidative phosphorylation (Electron Transport Chain + Chemiosmosis), generating approximately 26-28 ATP of the ~30-32 total ATP per glucose."
    }
  ]
};
