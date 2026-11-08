import type { Category, ElementRecord } from '../types';

function el(
	number: number,
	symbol: string,
	name: string,
	category: Category,
	flavor: string,
	recipe: [string, string] | null
): ElementRecord {
	return { number, symbol, name, category, flavor, recipe };
}

export const ELEMENTS: readonly ElementRecord[] = [
	el(1, 'H', 'Hydrogen', 'reactive-nonmetal', 'The universe’s starter pack.', null),
	el(2, 'He', 'Helium', 'noble-gas', 'Too noble to react, too light to care.', ['H', 'H']),
	el(3, 'Li', 'Lithium', 'alkali-metal', 'Moody metal. Handle with gloves and optimism.', [
		'H',
		'He'
	]),
	el(
		4,
		'Be',
		'Beryllium',
		'alkaline-earth-metal',
		'Tastes sweet. Also toxic. Alchemy is complicated.',
		['He', 'He']
	),
	el(5, 'B', 'Boron', 'metalloid', 'Boring name, excellent at holding things together.', [
		'H',
		'Be'
	]),
	el(6, 'C', 'Carbon', 'reactive-nonmetal', 'Everything you love is a carbon arrangement.', [
		'Be',
		'He'
	]),
	el(7, 'N', 'Nitrogen', 'reactive-nonmetal', 'Mostly invisible. Occasionally explosive.', [
		'C',
		'H'
	]),
	el(8, 'O', 'Oxygen', 'reactive-nonmetal', 'Extremely popular. Sometimes too popular.', [
		'C',
		'He'
	]),
	el(9, 'F', 'Fluorine', 'halogen', 'The most reactive guest at any party.', ['H', 'O']),
	el(10, 'Ne', 'Neon', 'noble-gas', 'Shines when excited. Otherwise keeps to itself.', ['He', 'O']),
	el(11, 'Na', 'Sodium', 'alkali-metal', 'Half of table salt; all of the drama.', ['H', 'Ne']),
	el(
		12,
		'Mg',
		'Magnesium',
		'alkaline-earth-metal',
		'Burns bright white. Good for fireworks and excuses.',
		['He', 'Ne']
	),
	el(13, 'Al', 'Aluminium', 'post-transition-metal', 'Light, tough, and secretly in your foil.', [
		'H',
		'Mg'
	]),
	el(14, 'Si', 'Silicon', 'metalloid', 'The quiet backbone of the modern world.', ['He', 'Mg']),
	el(15, 'P', 'Phosphorus', 'reactive-nonmetal', 'Matches, bones, and bad decisions.', ['H', 'Si']),
	el(16, 'S', 'Sulfur', 'reactive-nonmetal', 'Smells like a chemistry lesson.', ['He', 'Si']),
	el(17, 'Cl', 'Chlorine', 'halogen', 'Cleans pools. Starts fights.', ['H', 'S']),
	el(18, 'Ar', 'Argon', 'noble-gas', 'The original do-nothing gas.', ['He', 'S']),
	el(19, 'K', 'Potassium', 'alkali-metal', 'Bananas are famous for it. It is not flattered.', [
		'Ar',
		'H'
	]),
	el(20, 'Ca', 'Calcium', 'alkaline-earth-metal', 'Bones and chalk. Mostly bones.', ['Ar', 'He']),
	el(
		21,
		'Sc',
		'Scandium',
		'transition-metal',
		'Rare, light, and faintly glowing with importance.',
		['Ca', 'H']
	),
	el(22, 'Ti', 'Titanium', 'transition-metal', 'Strong, light, and unreasonably expensive.', [
		'Ca',
		'He'
	]),
	el(23, 'V', 'Vanadium', 'transition-metal', 'Named after a goddess; mostly used in steel.', [
		'H',
		'Ti'
	]),
	el(
		24,
		'Cr',
		'Chromium',
		'transition-metal',
		'Makes things shiny. Also makes them rust-resistant.',
		['He', 'Ti']
	),
	el(25, 'Mn', 'Manganese', 'transition-metal', 'Steel’s quiet little helper.', ['Cr', 'H']),
	el(26, 'Fe', 'Iron', 'transition-metal', 'The star that stopped shining and became useful.', [
		'Cr',
		'He'
	]),
	el(27, 'Co', 'Cobalt', 'transition-metal', 'Blue glass, strong magnets, complicated politics.', [
		'Fe',
		'H'
	]),
	el(28, 'Ni', 'Nickel', 'transition-metal', 'In coins, in batteries, in everything.', [
		'Fe',
		'He'
	]),
	el(29, 'Cu', 'Copper', 'transition-metal', 'The original conductor of bad ideas.', ['H', 'Ni']),
	el(30, 'Zn', 'Zinc', 'transition-metal', 'Sacrifices itself so iron can stay pretty.', [
		'He',
		'Ni'
	]),
	el(31, 'Ga', 'Gallium', 'post-transition-metal', 'Melts in your hand. Please don’t.', [
		'H',
		'Zn'
	]),
	el(32, 'Ge', 'Germanium', 'metalloid', 'The first transistor’s secret ingredient.', ['He', 'Zn']),
	el(33, 'As', 'Arsenic', 'metalloid', 'Historically popular with poisoners. Unfairly so.', [
		'Ge',
		'H'
	]),
	el(34, 'Se', 'Selenium', 'reactive-nonmetal', 'Photocopiers and shampoo. Strange combo.', [
		'Ge',
		'He'
	]),
	el(35, 'Br', 'Bromine', 'halogen', 'Liquid at room temperature, dramatic at all times.', [
		'H',
		'Se'
	]),
	el(36, 'Kr', 'Krypton', 'noble-gas', 'Noble, glowing, and slightly smug.', ['He', 'Se']),
	el(37, 'Rb', 'Rubidium', 'alkali-metal', 'Melts if you look at it warmly.', ['H', 'Kr']),
	el(38, 'Sr', 'Strontium', 'alkaline-earth-metal', 'Gives fireworks their red.', ['He', 'Kr']),
	el(39, 'Y', 'Yttrium', 'transition-metal', 'Sounds like a question. Is a metal.', ['H', 'Sr']),
	el(40, 'Zr', 'Zirconium', 'transition-metal', 'In reactors and fake diamonds.', ['He', 'Sr']),
	el(41, 'Nb', 'Niobium', 'transition-metal', 'Superconductors love it.', ['H', 'Zr']),
	el(42, 'Mo', 'Molybdenum', 'transition-metal', 'Strong, heatproof, and mostly unsung.', [
		'He',
		'Zr'
	]),
	el(43, 'Tc', 'Technetium', 'transition-metal', 'The first element made by hand.', ['H', 'Mo']),
	el(44, 'Ru', 'Ruthenium', 'transition-metal', 'Tough, rare, and used in tiny amounts.', [
		'He',
		'Mo'
	]),
	el(45, 'Rh', 'Rhodium', 'transition-metal', 'More expensive than gold. Less famous.', [
		'H',
		'Ru'
	]),
	el(46, 'Pd', 'Palladium', 'transition-metal', 'Absorbs hydrogen like a sponge.', ['He', 'Ru']),
	el(47, 'Ag', 'Silver', 'transition-metal', 'The moon’s favourite metal.', ['H', 'Pd']),
	el(48, 'Cd', 'Cadmium', 'transition-metal', 'Bright colours, dark reputation.', ['He', 'Pd']),
	el(49, 'In', 'Indium', 'post-transition-metal', 'Soft enough to cut with a fingernail.', [
		'Cd',
		'H'
	]),
	el(50, 'Sn', 'Tin', 'post-transition-metal', 'Cans, solder, and a bad case of the crumbles.', [
		'Cd',
		'He'
	]),
	el(51, 'Sb', 'Antimony', 'metalloid', 'Ancient eyeliner, modern flame retardant.', ['H', 'Sn']),
	el(52, 'Te', 'Tellurium', 'metalloid', 'Rare, brittle, and slightly garlicky.', ['He', 'Sn']),
	el(53, 'I', 'Iodine', 'halogen', 'Essential. Also purple when it feels like it.', ['H', 'Te']),
	el(54, 'Xe', 'Xenon', 'noble-gas', 'A noble gas with a taste for the dramatic.', ['He', 'Te']),
	el(55, 'Cs', 'Caesium', 'alkali-metal', 'The most precise second in your life.', ['H', 'Xe']),
	el(56, 'Ba', 'Barium', 'alkaline-earth-metal', 'Swallowed for X-rays, never for lunch.', [
		'He',
		'Xe'
	]),
	el(57, 'La', 'Lanthanum', 'lanthanide', 'Lanthanide number one, and already tired.', ['Ba', 'H']),
	el(58, 'Ce', 'Cerium', 'lanthanide', 'The spark in lighter flints.', ['Ba', 'He']),
	el(59, 'Pr', 'Praseodymium', 'lanthanide', 'Makes strong magnets and green glass.', ['Ce', 'H']),
	el(60, 'Nd', 'Neodymium', 'lanthanide', 'The strongest magnets owe it everything.', ['Ce', 'He']),
	el(61, 'Pm', 'Promethium', 'lanthanide', 'Vanishingly rare and mildly radioactive.', ['H', 'Nd']),
	el(62, 'Sm', 'Samarium', 'lanthanide', 'Magnets that keep their cool.', ['He', 'Nd']),
	el(63, 'Eu', 'Europium', 'lanthanide', 'Red phosphor in old televisions.', ['H', 'Sm']),
	el(64, 'Gd', 'Gadolinium', 'lanthanide', 'Magnetic and medically useful.', ['He', 'Sm']),
	el(65, 'Tb', 'Terbium', 'lanthanide', 'Green glow, strong magnets.', ['Gd', 'H']),
	el(66, 'Dy', 'Dysprosium', 'lanthanide', 'Keeps magnets working when things get hot.', [
		'Gd',
		'He'
	]),
	el(67, 'Ho', 'Holmium', 'lanthanide', 'The strongest magnetic moment. Show-off.', ['Dy', 'H']),
	el(68, 'Er', 'Erbium', 'lanthanide', 'Pink glass and fibre-optic dreams.', ['Dy', 'He']),
	el(69, 'Tm', 'Thulium', 'lanthanide', 'Rarest of the rare earths. Naturally.', ['Er', 'H']),
	el(70, 'Yb', 'Ytterbium', 'lanthanide', 'Atomic clocks and quiet precision.', ['Er', 'He']),
	el(71, 'Lu', 'Lutetium', 'lanthanide', 'The last lanthanide, and the densest.', ['H', 'Yb']),
	el(72, 'Hf', 'Hafnium', 'transition-metal', 'Hides in zirconium and reactor rods.', ['He', 'Yb']),
	el(73, 'Ta', 'Tantalum', 'transition-metal', 'Capacitors and surgical steel.', ['Hf', 'H']),
	el(74, 'W', 'Tungsten', 'transition-metal', 'Highest melting point. Lowest patience.', [
		'Hf',
		'He'
	]),
	el(75, 'Re', 'Rhenium', 'transition-metal', 'Jet engines owe it a debt.', ['H', 'W']),
	el(76, 'Os', 'Osmium', 'transition-metal', 'The densest element. Do not drop it.', ['He', 'W']),
	el(77, 'Ir', 'Iridium', 'transition-metal', 'A thin layer of it marks the dinosaurs’ bad day.', [
		'H',
		'Os'
	]),
	el(78, 'Pt', 'Platinum', 'transition-metal', 'Catalysts, jewellery, and unreasonable prices.', [
		'He',
		'Os'
	]),
	el(79, 'Au', 'Gold', 'transition-metal', 'Soft, shiny, and convinced it’s the main character.', [
		'H',
		'Pt'
	]),
	el(80, 'Hg', 'Mercury', 'transition-metal', 'Liquid metal. Terrible for hats.', ['He', 'Pt']),
	el(
		81,
		'Tl',
		'Thallium',
		'post-transition-metal',
		'Tasteless, odourless, and historically ominous.',
		['H', 'Hg']
	),
	el(82, 'Pb', 'Lead', 'post-transition-metal', 'Heavy, useful, and best left in the past.', [
		'He',
		'Hg'
	]),
	el(
		83,
		'Bi',
		'Bismuth',
		'post-transition-metal',
		'Crystals, cosmetics, and a surprisingly gentle decay.',
		['H', 'Pb']
	),
	el(84, 'Po', 'Polonium', 'post-transition-metal', 'Glows blue. Do not visit.', ['He', 'Pb']),
	el(85, 'At', 'Astatine', 'halogen', 'The rarest natural element. Barely.', ['H', 'Po']),
	el(86, 'Rn', 'Radon', 'noble-gas', 'Radioactive noble gas. Ventilation matters.', ['He', 'Po']),
	el(87, 'Fr', 'Francium', 'alkali-metal', 'The most unstable of the stable. Briefly.', [
		'H',
		'Rn'
	]),
	el(88, 'Ra', 'Radium', 'alkaline-earth-metal', 'Glows in the dark. Also in the wrong way.', [
		'He',
		'Rn'
	]),
	el(89, 'Ac', 'Actinium', 'actinide', 'Rare, radioactive, and first of the actinides.', [
		'H',
		'Ra'
	]),
	el(90, 'Th', 'Thorium', 'actinide', 'A nuclear fuel with a friendly name.', ['He', 'Ra']),
	el(91, 'Pa', 'Protactinium', 'actinide', 'Scarce, radioactive, and hard to study.', ['H', 'Th']),
	el(92, 'U', 'Uranium', 'actinide', 'The heavyweight champion of the periodic table.', [
		'He',
		'Th'
	]),
	el(93, 'Np', 'Neptunium', 'actinide', 'Named after Neptune. Feels important.', ['H', 'U']),
	el(94, 'Pu', 'Plutonium', 'actinide', 'Most famous for the wrong reasons.', ['He', 'U']),
	el(95, 'Am', 'Americium', 'actinide', 'Named after a continent. Mostly in smoke detectors.', [
		'H',
		'Pu'
	]),
	el(96, 'Cm', 'Curium', 'actinide', 'Named after the Curies. Very radioactive.', ['He', 'Pu']),
	el(97, 'Bk', 'Berkelium', 'actinide', 'Named after Berkeley. Very hard to find.', ['Cm', 'H']),
	el(98, 'Cf', 'Californium', 'actinide', 'A neutron source in a very small box.', ['Cm', 'He']),
	el(99, 'Es', 'Einsteinium', 'actinide', 'Named after Einstein. Too unstable for autographs.', [
		'Cf',
		'H'
	]),
	el(100, 'Fm', 'Fermium', 'actinide', 'Named after Fermi. Exists in tiny amounts.', ['Cf', 'He']),
	el(101, 'Md', 'Mendelevium', 'actinide', 'Named after Mendeleev. Fittingly mysterious.', [
		'H',
		'Fm'
	]),
	el(102, 'No', 'Nobelium', 'actinide', 'Named after Nobel. Not the prize.', ['He', 'Fm']),
	el(103, 'Lr', 'Lawrencium', 'actinide', 'Named after Lawrence. Last of the actinides.', [
		'H',
		'No'
	]),
	el(104, 'Rf', 'Rutherfordium', 'transition-metal', 'Named after Rutherford. Synthetic and shy.', [
		'He',
		'No'
	]),
	el(105, 'Db', 'Dubnium', 'transition-metal', 'Named after Dubna. Exists briefly.', ['H', 'Rf']),
	el(106, 'Sg', 'Seaborgium', 'transition-metal', 'Named after Seaborg. Also briefly.', [
		'He',
		'Rf'
	]),
	el(107, 'Bh', 'Bohrium', 'transition-metal', 'Named after Bohr. Unreasonably heavy.', [
		'H',
		'Sg'
	]),
	el(108, 'Hs', 'Hassium', 'transition-metal', 'Named after Hesse. Hard to catch.', ['He', 'Sg']),
	el(109, 'Mt', 'Meitnerium', 'transition-metal', 'Named after Meitner. Very much a lab story.', [
		'H',
		'Hs'
	]),
	el(110, 'Ds', 'Darmstadtium', 'transition-metal', 'Named after Darmstadt. Blink and it’s gone.', [
		'He',
		'Hs'
	]),
	el(111, 'Rg', 'Roentgenium', 'transition-metal', 'Named after Röntgen. X-ray famous.', [
		'Ds',
		'H'
	]),
	el(
		112,
		'Cn',
		'Copernicium',
		'transition-metal',
		'Named after Copernicus. A noble metal, maybe.',
		['Ds', 'He']
	),
	el(113, 'Nh', 'Nihonium', 'post-transition-metal', 'Named after Nihon. The newest of the old.', [
		'Cn',
		'H'
	]),
	el(114, 'Fl', 'Flerovium', 'post-transition-metal', 'Named after Flerov. Decays fast.', [
		'Cn',
		'He'
	]),
	el(115, 'Mc', 'Moscovium', 'post-transition-metal', 'Named after Moscow. Also fast.', [
		'Fl',
		'H'
	]),
	el(116, 'Lv', 'Livermorium', 'post-transition-metal', 'Named after Livermore. Barely exists.', [
		'Fl',
		'He'
	]),
	el(117, 'Ts', 'Tennessine', 'halogen', 'Named after Tennessee. Halogen, allegedly.', ['H', 'Lv']),
	el(118, 'Og', 'Oganesson', 'noble-gas', 'Named after Yuri Oganessian. The end of the table.', [
		'He',
		'Lv'
	])
];

export const ELEMENT_BY_SYMBOL = new Map(ELEMENTS.map((element) => [element.symbol, element]));
export const STARTER_SYMBOL = 'H';
