import { DivisionStage } from '../types';

export const DIVISION_STAGES: DivisionStage[] = [
  {
    id: 'interphase',
    name: 'Interphase (G1, S, G2)',
    subTitle: 'Preparation, Growth & DNA Duplication',
    phase: 'Interphase',
    description: 'The cell spends approximately 90% of its lifespan in Interphase. It actively grows, transcribes proteins, doubles its organelle count, and accurately replicates all 46 chromosomes (in humans) during S-phase to create identical sister chromatid pairs held together at the centromere.',
    keyEvents: [
      'G1 Phase: Cell grows vigorously and synthesizes metabolic enzymes.',
      'S Phase (Synthesis): Precise semi-conservative replication of nuclear genomic DNA.',
      'G2 Phase: Final growth check, synthesis of tubulin for mitotic spindle, and duplication of centrosomes.',
      'Centrosomes complete replication outside the intact nucleus.'
    ],
    visualHighlights: 'Intact round nuclear envelope, diffuse loose chromatin fibers inside nucleoplasm, two adjacent centrosomes preparing to migrate.',
    aiInsight: 'Think of Interphase as the rigorous planning and manufacturing phase before a rocket launch: without error-free DNA replication here, division stalls at checkpoints.',
    durationMinutes: 1200 // ~20 hours of typical 24hr cycle
  },
  {
    id: 'prophase',
    name: 'Prophase & Prometaphase',
    subTitle: 'Condensation & Spindle Assembly',
    phase: 'Prophase',
    description: 'Chromatin fibers fold and supercoil tightly into distinct, microscopically visible X-shaped chromosomes composed of two sister chromatids. The nucleolus disappears, centrosomes migrate toward opposite cellular poles while polymerizing microtubules, and the nuclear envelope breaks down into vesicular fragments.',
    keyEvents: [
      'Condensin protein complexes compact loose chromatin into dense rod-like chromosomes.',
      'Centrosomes move to opposite cell poles and cast radial aster microtubule arrays.',
      'Nuclear envelope disintegrates upon phosphorylation of nuclear lamins.',
      'Kinetochores assemble at each centromere and capture spindle microtubules.'
    ],
    visualHighlights: 'Chromosomes condense into dense dark paired chromatids; nuclear membrane begins dissolving; mitotic spindle fibers radiate toward center.',
    aiInsight: 'Packaging DNA into tight chromosomes prevents delicate 2-meter strands of genomic threads from tangling and snapping during mechanical separation.',
    durationMinutes: 60
  },
  {
    id: 'metaphase',
    name: 'Metaphase',
    subTitle: 'The Equatorial Tug-of-War Alignment',
    phase: 'Metaphase',
    description: 'Mitotic spindle microtubules apply opposing tension across the kinetochores of each chromosome, tugging and aligning all paired chromosomes along the equatorial midpoint of the cell (the Metaphase Plate). The crucial Spindle Assembly Checkpoint (SAC) audits whether every single kinetochore is properly bi-oriented before allowing division to proceed.',
    keyEvents: [
      'Chromosomes line up in a single file along the equatorial plane (Metaphase Plate).',
      'Kinetochore microtubules from opposite poles attach to opposite sister chromatids under dynamic tension.',
      'Spindle Assembly Checkpoint (SAC) halts division until all chromosomes are balanced.',
      'Cyclin B-CDK1 activity peaks, priming the anaphase-promoting complex (APC/C).'
    ],
    visualHighlights: 'All chromosomes locked in an orderly straight vertical line across the center; taut spindle fibers anchor from both opposing centrosome poles.',
    aiInsight: 'Metaphase is the ultimate cell quality check: if just one single chromosome is improperly attached, the cell halts to avoid aneuploidy (deadly chromosomal imbalances).',
    durationMinutes: 30
  },
  {
    id: 'anaphase',
    name: 'Anaphase',
    subTitle: 'Sister Chromatid Cleavage & Separation',
    phase: 'Anaphase',
    description: 'The anaphase-promoting complex activates separase, which cleaves the cohesin protein rings holding sister chromatids together. Kinetochore microtubules depolymerize at their plus-ends, pulling separated sister chromatids toward opposite poles (Anaphase A). Simultaneously, non-kinetochore polar microtubules slide apart to physically elongate the cell (Anaphase B).',
    keyEvents: [
      'Cohesin rings are cleaved; sister chromatids officially become individual daughter chromosomes.',
      'Kinetochore spindle fibers shorten, reeling daughter chromosomes toward opposing poles with V-shaped arms trailing behind.',
      'Polar microtubules slide past each other via kinesin motor proteins, elongating the cell axis.',
      'Ensures both future daughter cells receive an exact duplicate copy of every gene.'
    ],
    visualHighlights: 'Paired chromatids snap apart; two distinct symmetrical clusters of V-shaped chromosomes accelerate toward opposite poles; cell body stretches horizontally.',
    aiInsight: 'Notice the V-shape of moving chromosomes! Because the spindle pulls strictly at the central kinetochore, the flexible arms drag passively behind through the cytosol.',
    durationMinutes: 15
  },
  {
    id: 'telophase',
    name: 'Telophase',
    subTitle: 'Nuclear Reconstruction & Chromatin Decondensation',
    phase: 'Telophase',
    description: 'The separated sets of daughter chromosomes reach opposite poles. Mitotic spindle fibers depolymerize and disassemble. Vesicles of the nuclear envelope aggregate around each chromosomal cluster and fuse, reconstituting two separate, complete nuclear envelopes. Chromosomes begin unraveling back into loose, active chromatin.',
    keyEvents: [
      'Two complete nuclear envelopes reconstruct around each set of daughter chromosomes.',
      'Nucleoli reappear inside both nascent nuclei as rRNA transcription resumes.',
      'Chromosomes decondense back into fine, thread-like chromatin fibers.',
      'Mitotic spindle apparatus disassembles completely.'
    ],
    visualHighlights: 'Two clear round purple nuclear envelopes reform at each pole; chromosomes loosen into diffuse mesh; distinct cleavage furrow indentation begins to pinch the center.',
    aiInsight: 'Telophase is literally prophase run in reverse: structures built up for transport are taken down, and the nuclear vaults are restored for daily gene expression.',
    durationMinutes: 30
  },
  {
    id: 'cytokinesis',
    name: 'Cytokinesis',
    subTitle: 'Physical Cytoplasmic Division into Two Daughter Cells',
    phase: 'Cytokinesis',
    description: 'An actomyosin contractile ring located just beneath the equatorial cell membrane constricts like a microscopic drawstring purse. This draws the plasma membrane inward, generating a deepening Cleavage Furrow that ultimately pinches the single parent cell into two genetically identical, independent daughter cells.',
    keyEvents: [
      'Actin microfilaments and Myosin II motor proteins form a contractile ring at the former metaphase plate.',
      'Cleavage furrow deepens until opposing membranes meet at the midbody.',
      'Membrane abscission (ESCRT machinery) cuts the intracellular bridge.',
      'Two genetically identical daughter cells enter G1 phase of the next Interphase.'
    ],
    visualHighlights: 'Hourglass cell shape with deep waist narrowing until membrane scission; two distinct, identical, fully equipped living cells separate.',
    aiInsight: 'In plant cells with rigid cell walls, cytokinesis requires building a new "cell plate" from Golgi vesicles, but in human cells, the flexible membrane simply pinches shut!',
    durationMinutes: 45
  }
];
