import { Organelle } from '../types';

export const ORGANELLES: Organelle[] = [
  {
    id: 'nucleus',
    name: 'Nucleus',
    tagline: 'The Cellular Command Vault & Genetic Library',
    category: 'Command',
    color: '#8b5cf6', // rich violet
    emissiveColor: '#4c1d95',
    size: [1.8, 1.8, 1.8],
    position: [0, 0, 0],
    shape: 'sphere',
    summary: 'Houses the complete nuclear genome (DNA) and directs RNA transcription to control all cellular activities.',
    primaryFunction: 'Storage and replication of genetic material; transcription of mRNA and rRNA; control of cell cycle and division.',
    diameter: '5 – 10 µm',
    location: 'Central nucleoplasm of eukaryotic cells',
    funFact: 'If you unraveled all the DNA packed inside one single human cell nucleus, it would stretch approximately 2 meters (6 feet) long!',
    keyMolecules: ['Chromatin / DNA', 'Histone proteins', 'RNA Polymerase', 'Nucleolus (rRNA)']
  },
  {
    id: 'mitochondria',
    name: 'Mitochondria',
    tagline: 'The ATP Power Generators',
    category: 'Energy',
    color: '#f97316', // bright energetic orange
    emissiveColor: '#7c2d12',
    size: [0.9, 0.5, 0.5],
    position: [-2.2, 1.2, 0.8],
    rotation: [0.3, 0.8, 0.5],
    shape: 'capsule',
    summary: 'Double-membraned powerhouses that convert metabolic nutrients into adenosine triphosphate (ATP) via aerobic cellular respiration.',
    primaryFunction: 'ATP production via Krebs cycle and oxidative phosphorylation; cellular apoptosis signaling; calcium ion buffering.',
    diameter: '0.5 – 1.0 µm diameter, up to 7 µm long',
    location: 'Dispersed throughout cytosol, concentrated in active metabolic sites',
    funFact: 'Mitochondria have their own independent circular DNA (mtDNA) and replicate by binary fission, proving they evolved from endosymbiotic ancient bacteria!',
    keyMolecules: ['ATP Synthase', 'Cytochrome c', 'mtDNA', 'Coenzyme Q10']
  },
  {
    id: 'endoplasmic_reticulum',
    name: 'Endoplasmic Reticulum',
    tagline: 'The Protein Folding & Lipid Synthesis Factory Highway',
    category: 'Synthesis',
    color: '#06b6d4', // cyan
    emissiveColor: '#164e63',
    size: [2.6, 2.2, 1.5],
    position: [1.2, -0.6, 0.5],
    shape: 'folded_mesh',
    summary: 'A continuous network of labyrinthine membranous tubules and flattened sacs directly attached to the nuclear envelope.',
    primaryFunction: 'Rough ER: folds and modifies nascent proteins; Smooth ER: synthesizes phospholipids/steroids and detoxifies toxic metabolites.',
    diameter: 'Lumen thickness 30 – 60 nm',
    location: 'Surrounds and extends outward from the nuclear envelope',
    funFact: 'In human liver cells, the Smooth ER expands rapidly upon exposure to drugs or alcohol to accelerate enzymatic detoxification!',
    keyMolecules: ['Chaperone proteins (BiP)', 'Signal Peptidase', 'Cytochrome P450 enzymes']
  },
  {
    id: 'golgi_apparatus',
    name: 'Golgi Apparatus',
    tagline: 'The Cellular Packaging & Postal Distribution Center',
    category: 'Transport',
    color: '#10b981', // emerald green
    emissiveColor: '#064e3b',
    size: [1.6, 1.2, 0.8],
    position: [-1.8, -1.6, -0.7],
    rotation: [0.4, -0.5, 0.2],
    shape: 'disks',
    summary: 'A stack of curved, flattened cisternae with distinct cis (receiving) and trans (shipping) faces for post-translational modification.',
    primaryFunction: 'Glycosylation of proteins and lipids; sorting, packaging, and dispatching cargo into secretory and lysosomal transport vesicles.',
    diameter: 'Cisterna width 0.5 – 1.0 µm',
    location: 'Adjacent to the Rough ER and centrosome',
    funFact: 'Discovered in 1898 by Italian Nobel laureate Camillo Golgi using a silver nitrate staining technique ("the black reaction").',
    keyMolecules: ['Glycosyltransferases', 'COP vesicles', 'Clathrin coats', 'SNARE proteins']
  },
  {
    id: 'ribosomes',
    name: 'Ribosomes',
    tagline: 'Molecular Nanomachines for Protein Translation',
    category: 'Synthesis',
    color: '#ec4899', // vibrant pink
    emissiveColor: '#831843',
    size: [0.15, 0.15, 0.15],
    position: [1.6, 1.6, -1.0],
    shape: 'dots',
    summary: 'Non-membrane multi-protein ribonucleic complexes that decode mRNA codons into functional polypeptide chains.',
    primaryFunction: 'Peptide bond formation (transpeptidation) between incoming aminoacyl-tRNAs based on the mRNA triplet codon sequence.',
    diameter: '20 – 30 nm (80S eukaryotic ribosome)',
    location: 'Bound to Rough ER membrane or floating free in cytosol',
    funFact: 'A single human cell can contain up to 10 million active ribosomes, translating proteins at speeds of ~20 amino acids per second!',
    keyMolecules: ['28S, 18S, 5.8S, 5S rRNA', 'Ribosomal proteins (L and S subunits)', 'tRNA', 'Peptidyl transferase']
  },
  {
    id: 'lysosomes',
    name: 'Lysosomes',
    tagline: 'The Cellular Waste Disposal & Recycling Centers',
    category: 'Waste',
    color: '#eab308', // amber yellow
    emissiveColor: '#713f12',
    size: [0.55, 0.55, 0.55],
    position: [-1.2, 2.0, -1.2],
    shape: 'vesicles',
    summary: 'Acidic, membrane-bound spherical digestive organelle containing over 50 different acid hydrolases.',
    primaryFunction: 'Degradation of phagocytosed pathogens; autophagy of damaged organelles; recycling biomolecules into raw amino acids and sugars.',
    diameter: '0.1 – 1.2 µm',
    location: 'Scattered randomly throughout the cytoplasm',
    funFact: 'If a lysosome bursts open inside a cell, its enzymes are largely inactivated because cytoplasmic pH (~7.2) is far higher than the lysosome acidic sweet-spot (pH 4.8)!',
    keyMolecules: ['Cathepsins', 'Acid phosphatases', 'v-ATPase proton pumps', 'LAMP membrane proteins']
  },
  {
    id: 'cell_membrane',
    name: 'Cell Membrane',
    tagline: 'The Selectively Permeable Phospholipid Fortress',
    category: 'Boundary',
    color: '#3b82f6', // bright sapphire blue
    emissiveColor: '#1e3a8a',
    size: [4.2, 4.2, 4.2],
    position: [0, 0, 0],
    shape: 'outer_shell',
    summary: 'A dynamic, fluid mosaic lipid bilayer embedded with integral receptors, ion channels, transport pumps, and recognition glycoproteins.',
    primaryFunction: 'Selective transport of ions, nutrients, and wastes; osmotic balance; signal transduction; cell-to-cell adhesion.',
    diameter: '7 – 10 nm lipid bilayer thickness',
    location: 'Outermost boundary enclosing the animal cell cytoplasm',
    funFact: 'The cell membrane is so flexible and self-healing that if punctured by a micro-needle, phospholipid hydrophobic forces reseal the rupture within milliseconds!',
    keyMolecules: ['Phospholipids', 'Cholesterol', 'Aquaporins', 'Na+/K+ ATPase pumps', 'Glycoproteins']
  },
  {
    id: 'cytoplasm',
    name: 'Cytoplasm & Cytosol',
    tagline: 'The Aqueous Gel Matrix & Cytoskeletal Highway',
    category: 'Matrix',
    color: '#60a5fa', // translucent soft blue/cyan
    emissiveColor: '#1d4ed8',
    size: [3.8, 3.8, 3.8],
    position: [0, 0, 0],
    shape: 'outer_shell',
    summary: 'The semi-fluid internal cellular ground substance consisting of water, dissolved salts, metabolic enzymes, and a dynamic cytoskeletal scaffold.',
    primaryFunction: 'Physical suspension and protective cushioning for organelles; medium for molecular diffusion; site of glycolysis and intermediate metabolism.',
    diameter: 'Encompasses ~54% of total cell volume',
    location: 'Entire interior volume between plasma membrane and nuclear envelope',
    funFact: 'The cytosol is not watery like tap water—it is crowded like a thick jelly, packed with up to 400 grams of dissolved protein per liter!',
    keyMolecules: ['Cytosol water (70-80%)', 'Microtubules (tubulin)', 'Actin microfilaments', 'Glycolytic enzymes']
  }
];

export const ORGANELLE_MAP: Record<string, Organelle> = ORGANELLES.reduce(
  (acc, org) => ({ ...acc, [org.id]: org }),
  {}
);
