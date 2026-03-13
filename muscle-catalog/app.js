/* ============================================================
   M.U.S.C.L.E. FIGURE CATALOG — app.js
   All 236 figures · Filtering · Search · Modal · Animations
   ============================================================ */

'use strict';

/* ── Figure Data ────────────────────────────────────────────── */
const figures = [
  // 001-010
  {num: 1,  name: "Muscleman",        char: "Kinnikuman",         series: "Hero"},
  {num: 2,  name: "Terri-Bull",       char: "Buffaloman",         series: "Villain"},
  {num: 3,  name: "Sunshine",         pose: "C", char: "Sunshine",           series: "Devil Knight"},
  {num: 4,  name: "Kani Besu",        char: "Kani Besu",          series: "Minor"},
  {num: 5,  name: "Planetman",        char: "Planetman",          series: "Devil Knight"},
  {num: 6,  name: "Erimaki Tokage",   char: "Erimaki Tokage",     series: "Minor"},
  {num: 7,  name: "Puyo Puyo",        char: "Puyo Puyo",          series: "Minor"},
  {num: 8,  name: "Shishikababu",     char: "Shishikababu",       series: "Minor"},
  {num: 9,  name: "Wakusei Barukan",  char: "Wakusei Barukan",    series: "Minor"},
  {num: 10, name: "Jessie Maybia",    char: "Jessie Maybia",      series: "Minor"},
  // 011-020
  {num: 11, name: "Hidora King",      char: "Hidora King",        series: "Minor"},
  {num: 12, name: "Oil Man",          char: "Oil Man",            series: "Minor"},
  {num: 13, name: "King Cobra",       char: "King Cobra",         series: "Minor"},
  {num: 14, name: "Robin Mask",       pose: "C", char: "Robin Mask",         series: "Justice"},
  {num: 15, name: "Sunshine",         pose: "D", char: "Sunshine",           series: "Devil Knight"},
  {num: 16, name: "Neptuneman",       pose: "B", char: "Neptuneman",         series: "Villain"},
  {num: 17, name: "Kinnikuman",       pose: "B", char: "Kinnikuman",         series: "Hero"},
  {num: 18, name: "Daiyaman",         char: "Daiyaman",           series: "Minor"},
  {num: 19, name: "Black Killer",     char: "Black Killer",       series: "Minor"},
  {num: 20, name: "Kinniku Daiou",    char: "Kinniku Daiou",      series: "Minor"},
  // 021-030
  {num: 21, name: "Akuma Shogun",     pose: "A", char: "Akuma Shogun",       series: "Villain"},
  {num: 22, name: "The Manriki",      char: "The Manriki",        series: "Minor"},
  {num: 23, name: "Iwao",             char: "Iwao",               series: "Minor"},
  {num: 24, name: "Cubeman",          char: "Cubeman",            series: "Minor"},
  {num: 25, name: "Prince Kamehame",  char: "Prince Kamehame",    series: "Justice"},
  {num: 26, name: "The Ninja",        pose: "A", char: "The Ninja",          series: "Devil Knight"},
  {num: 27, name: "Ashuraman",        pose: "A", char: "Ashuraman",          series: "Devil Knight"},
  {num: 28, name: "John Stimboard",   char: "John Stimboard",     series: "Minor"},
  {num: 29, name: "Terryman",         pose: "C", char: "Terryman",           series: "Justice"},
  {num: 30, name: "Keyman",           char: "Keyman",             series: "Minor"},
  // 031-040
  {num: 31, name: "Terryman",         pose: "A", char: "Terryman",           series: "Justice"},
  {num: 32, name: "Kington",          char: "Kington",            series: "Minor"},
  {num: 33, name: "Skull Bozu",       char: "Skull Bozu",         series: "Minor"},
  {num: 34, name: "Nokogira Man",     char: "Nokogira Man",       series: "Minor"},
  {num: 35, name: "Warsman",          pose: "A", char: "Warsman",            series: "Justice"},
  {num: 36, name: "Kinkotsuman",      char: "Kinkotsuman",        series: "Villain"},
  {num: 37, name: "Dynamite Piper",   char: "Dynamite Piper",     series: "Minor"},
  {num: 38, name: "Tileman",          char: "Tileman",            series: "Devil Knight"},
  {num: 39, name: "Sunshine",         pose: "A", char: "Sunshine",           series: "Devil Knight"},
  {num: 40, name: "Kendaman",         pose: "B", char: "Kendaman",           series: "Minor"},
  // 041-050
  {num: 41, name: "Beauty Rhodes",    char: "Beauty Rhodes",      series: "Minor"},
  {num: 42, name: "Goremuman",        char: "Goremuman",          series: "Minor"},
  {num: 43, name: "Curry Cook",       char: "Curry Cook",         series: "Minor"},
  {num: 44, name: "Benkiman",         pose: "A", char: "Benkiman",           series: "Justice"},
  {num: 45, name: "Springman",        char: "Springman",          series: "Villain"},
  {num: 46, name: "Robin Mask",       pose: "A", char: "Robin Mask",         series: "Justice"},
  {num: 47, name: "Iinchou",          char: "Iinchou",            series: "Minor"},
  {num: 48, name: "Teapack Man",      char: "Teapack Man",        series: "Minor"},
  {num: 49, name: "Black Shadow",     char: "Black Shadow",       series: "Minor"},
  {num: 50, name: "The Hawkman",      pose: "A", char: "The Hawkman",        series: "Minor"},
  // 051-060
  {num: 51, name: "Canadianman",      char: "Canadianman",        series: "Justice"},
  {num: 52, name: "Jawsman",          char: "Jawsman",            series: "Minor"},
  {num: 53, name: "Junkman",          pose: "A", char: "Junkman",            series: "Devil Knight"},
  {num: 54, name: "The Mountain",     char: "The Mountain",       series: "Minor"},
  {num: 55, name: "Skyman",           char: "Skyman",             series: "Minor"},
  {num: 56, name: "Neptune King",     char: "Neptune King",       series: "Villain"},
  {num: 57, name: "Kinnikuman Great", char: "Kinnikuman Great",   series: "Justice"},
  {num: 58, name: "Buffaloman",       pose: "C", char: "Buffaloman",         series: "Villain"},
  {num: 59, name: "Warsman",          pose: "B", char: "Warsman",            series: "Justice"},
  {num: 60, name: "Mito",             pose: "A", char: "Mito",               series: "Minor"},
  // 061-070
  {num: 61, name: "Kinnikuman",       pose: "A", char: "Kinnikuman",         series: "Hero"},
  {num: 62, name: "The Sheik",        char: "The Sheik",          series: "Minor"},
  {num: 63, name: "Goriki",           char: "Goriki",             series: "Minor"},
  {num: 64, name: "Sunshine",         pose: "B", char: "Sunshine",           series: "Devil Knight"},
  {num: 65, name: "Crystalman",       char: "Crystalman",         series: "Minor"},
  {num: 66, name: "Mr. Barracuda",    pose: "A", char: "Mr. Barracuda",      series: "Minor"},
  {num: 67, name: "Pentagon",         char: "Pentagon",           series: "Devil Knight"},
  {num: 68, name: "Okutopasu Dragon", char: "Okutopasu Dragon",   series: "Minor"},
  {num: 69, name: "Specialman",       char: "Specialman",         series: "Justice"},
  {num: 70, name: "Ashuraman",        pose: "B", char: "Ashuraman",          series: "Devil Knight"},
  // 071-080
  {num: 71, name: "Neptuneman",       pose: "A", char: "Neptuneman",         series: "Villain"},
  {num: 72, name: "Sunigator",        pose: "A", char: "Sunigator",          series: "Devil Knight"},
  {num: 73, name: "Mairudoman",       char: "Mairudoman",         series: "Minor"},
  {num: 74, name: "Spray Majin",      char: "Spray Majin",        series: "Minor"},
  {num: 75, name: "Abdullah",         char: "Abdullah",           series: "Minor"},
  {num: 76, name: "Eraginesu",        char: "Eraginesu",          series: "Minor"},
  {num: 77, name: "Ashuraman No Sensei", char: "Ashuraman No Sensei", series: "Minor"},
  {num: 78, name: "Vikingman",        char: "Vikingman",          series: "Minor"},
  {num: 79, name: "Hammerhead",       char: "Hammerhead",         series: "Minor"},
  {num: 80, name: "Paper Miira",      char: "Paper Miira",        series: "Minor"},
  // 081-090
  {num: 81, name: "Amelman",          char: "Amelman",            series: "Minor"},
  {num: 82, name: "Ramenman",         pose: "A", char: "Ramenman",           series: "Justice"},
  {num: 83, name: "Hang Killer",      char: "Hang Killer",        series: "Minor"},
  {num: 84, name: "Snakeman",         char: "Snakeman",           series: "Minor"},
  {num: 85, name: "Kinnikuman Zebra", pose: "A", char: "Kinnikuman Zebra",   series: "Villain"},
  {num: 86, name: "De Bellman",       char: "De Bellman",         series: "Minor"},
  {num: 87, name: "Magnitude Ichiman", char: "Magnitude Ichiman", series: "Minor"},
  {num: 88, name: "Armstrong",        char: "Armstrong",          series: "Minor"},
  {num: 89, name: "Watchman",         char: "Watchman",           series: "Minor"},
  {num: 90, name: "Combatman",        char: "Combatman",          series: "Minor"},
  // 091-100
  {num: 91, name: "Cyborg SW #26",    char: "Cyborg SW #26",      series: "Minor"},
  {num: 92, name: "Akuma Kishi",      char: "Akuma Kishi",        series: "Villain"},
  {num: 93, name: "Buffaloman",       pose: "A", char: "Buffaloman",         series: "Villain"},
  {num: 94, name: "Kintaman",         char: "Kintaman",           series: "Minor"},
  {num: 95, name: "Big Radial",       char: "Big Radial",         series: "Minor"},
  {num: 96, name: "The Ninja",        pose: "B", char: "The Ninja",          series: "Devil Knight"},
  {num: 97, name: "Condora",          char: "Condora",            series: "Minor"},
  {num: 98, name: "Dark Nisei",       char: "Dark Nisei",         series: "Minor"},
  {num: 99, name: "The Mari",         char: "The Mari",           series: "Minor"},
  {num: 100,name: "Bam Bam Ji",       char: "Bam Bam Ji",         series: "Minor"},
  // 101-110
  {num: 101,name: "Godo Shisa",       char: "Godo Shisa",         series: "Minor"},
  {num: 102,name: "Mapman",           char: "Mapman",             series: "Minor"},
  {num: 103,name: "Black Hole",       char: "Black Hole",         series: "Devil Knight"},
  {num: 104,name: "Buka",             pose: "B", char: "Buka",               series: "Minor"},
  {num: 105,name: "Buffaloman",       pose: "D", char: "Buffaloman",         series: "Villain"},
  {num: 106,name: "Aian Suchiru Kita Chojin", char: "Aian Suchiru Kita Chojin", series: "Minor"},
  {num: 107,name: "Sunshine",         pose: "E", char: "Sunshine",           series: "Devil Knight"},
  {num: 108,name: "Rikishiman",       pose: "B", char: "Rikishiman",         series: "Minor"},
  {num: 109,name: "Ashuraman No Chichi", char: "Ashuraman No Chichi", series: "Minor"},
  {num: 110,name: "Kinnikuman",       pose: "F", char: "Kinnikuman",         series: "Hero"},
  // 111-120
  {num: 111,name: "Akuma Shogun",     pose: "B", char: "Akuma Shogun",       series: "Villain"},
  {num: 112,name: "Sunigator",        pose: "D", char: "Sunigator",          series: "Devil Knight"},
  {num: 113,name: "Kinnikuman Super Phoenix", pose: "A", char: "Super Phoenix", series: "Villain"},
  {num: 114,name: "Pandaman",         char: "Pandaman",           series: "Minor"},
  {num: 115,name: "Kiki Jin",         char: "Kiki Jin",           series: "Minor"},
  {num: 116,name: "Kinnikuman Soldier", pose: "A", char: "Kinnikuman Soldier", series: "Villain"},
  {num: 117,name: "Rollerman",        char: "Rollerman",          series: "Minor"},
  {num: 118,name: "ICBM",             char: "ICBM",               series: "Minor"},
  {num: 119,name: "Bermuda III",      pose: "A", char: "Bermuda III",        series: "Minor"},
  {num: 120,name: "Sabotenman",       char: "Sabotenman",         series: "Minor"},
  // 121-130
  {num: 121,name: "Ramenman",         pose: "B", char: "Ramenman",           series: "Justice"},
  {num: 122,name: "Warsman",          pose: "C", char: "Warsman",            series: "Justice"},
  {num: 123,name: "Wolfman",          pose: "A", char: "Wolfman",            series: "Justice"},
  {num: 124,name: "Brocken Jr.",      pose: "A", char: "Brocken Jr.",        series: "Justice"},
  {num: 125,name: "Mongolman",        pose: "A", char: "Mongolman",          series: "Justice"},
  {num: 126,name: "Neptuneman",       pose: "C", char: "Neptuneman",         series: "Villain"},
  {num: 127,name: "Buffaloman",       pose: "E", char: "Buffaloman",         series: "Justice"},
  {num: 128,name: "Springman",        pose: "B", char: "Springman",          series: "Villain"},
  {num: 129,name: "Ashuraman",        pose: "C", char: "Ashuraman",          series: "Devil Knight"},
  {num: 130,name: "Stecase King",     char: "Stecase King",       series: "Minor"},
  // 131-140
  {num: 131,name: "Kendaman",         pose: "A", char: "Kendaman",           series: "Minor"},
  {num: 132,name: "Turboman",         pose: "A", char: "Turboman",           series: "Devil Knight"},
  {num: 133,name: "Sunigator",        pose: "B", char: "Sunigator",          series: "Devil Knight"},
  {num: 134,name: "Sunigator",        pose: "C", char: "Sunigator",          series: "Devil Knight"},
  {num: 135,name: "Sunigator",        pose: "E", char: "Sunigator",          series: "Devil Knight"},
  {num: 136,name: "Mito",             pose: "B", char: "Mito",               series: "Minor"},
  {num: 137,name: "Kinnikuman Great", pose: "B", char: "Kinnikuman Great",   series: "Justice"},
  {num: 138,name: "Terryman",         pose: "B", char: "Terryman",           series: "Justice"},
  {num: 139,name: "Robin Mask",       pose: "B", char: "Robin Mask",         series: "Justice"},
  {num: 140,name: "Wolfman",          pose: "B", char: "Wolfman",            series: "Justice"},
  // 141-150
  {num: 141,name: "Muscleman (Poster)", char: "Kinnikuman", series: "Hero", special: true},
  {num: 142,name: "Warsman",          pose: "D", char: "Warsman",            series: "Justice"},
  {num: 143,name: "Canadianman",      pose: "B", char: "Canadianman",        series: "Justice"},
  {num: 144,name: "Mister America",   char: "Mister America",     series: "Minor"},
  {num: 145,name: "Geronimo",         pose: "A", char: "Geronimo",           series: "Justice"},
  {num: 146,name: "Brocken Jr.",      pose: "B", char: "Brocken Jr.",        series: "Justice"},
  {num: 147,name: "Wolfman",          pose: "C", char: "Wolfman",            series: "Justice"},
  {num: 148,name: "Ramenman",         pose: "C", char: "Ramenman",           series: "Justice"},
  {num: 149,name: "Kinnikuman Soldier", pose: "B", char: "Kinnikuman Soldier", series: "Villain"},
  {num: 150,name: "Rikishiman",       pose: "A", char: "Rikishiman",         series: "Minor"},
  // 151-160
  {num: 151,name: "Mongolman",        pose: "B", char: "Mongolman",          series: "Justice"},
  {num: 152,name: "King the Tons",    pose: "A", char: "King the Tons",      series: "Villain"},
  {num: 153,name: "The Claw",         char: "The Claw",           series: "Minor"},
  {num: 154,name: "Pentagon",         pose: "B", char: "Pentagon",           series: "Devil Knight"},
  {num: 155,name: "Terryman",         pose: "D", char: "Terryman",           series: "Justice"},
  {num: 156,name: "Junkman",          pose: "B", char: "Junkman",            series: "Devil Knight"},
  {num: 157,name: "King the Tons",    pose: "B", char: "King the Tons",      series: "Villain"},
  {num: 158,name: "Mongolman",        pose: "C", char: "Mongolman",          series: "Justice"},
  {num: 159,name: "Akuma Shogun",     pose: "C", char: "Akuma Shogun",       series: "Villain"},
  {num: 160,name: "Robin Mask",       pose: "D", char: "Robin Mask",         series: "Justice"},
  // 161-170
  {num: 161,name: "Wolfman",          pose: "D", char: "Wolfman",            series: "Justice"},
  {num: 162,name: "Pentagon",         pose: "C", char: "Pentagon",           series: "Devil Knight"},
  {num: 163,name: "Mammothman",       pose: "A", char: "Mammothman",         series: "Villain"},
  {num: 164,name: "Mammothman",       pose: "B", char: "Mammothman",         series: "Villain"},
  {num: 165,name: "Sneagator",        pose: "A", char: "Sneagator",          series: "Devil Knight"},
  {num: 166,name: "Sneagator",        pose: "B", char: "Sneagator",          series: "Devil Knight"},
  {num: 167,name: "Kinnikuman",       pose: "G", char: "Kinnikuman",         series: "Hero"},
  {num: 168,name: "Terryman",         pose: "E", char: "Terryman",           series: "Justice"},
  {num: 169,name: "Canadianman",      pose: "C", char: "Canadianman",        series: "Justice"},
  {num: 170,name: "Kinnikuman Great", pose: "C", char: "Kinnikuman Great",   series: "Justice"},
  // 171-180
  {num: 171,name: "Buffaloman",       pose: "F", char: "Buffaloman",         series: "Justice"},
  {num: 172,name: "Robin Mask",       pose: "E", char: "Robin Mask",         series: "Justice"},
  {num: 173,name: "Mister Kamen",     char: "Mister Kamen",       series: "Minor"},
  {num: 174,name: "Ashuraman",        pose: "E", char: "Ashuraman",          series: "Devil Knight"},
  {num: 175,name: "Leoparudon",       char: "Leoparudon",         series: "Minor"},
  {num: 176,name: "Heavy Metal",      char: "Heavy Metal",        series: "Minor"},
  {num: 177,name: "Dai Ukon",         char: "Dai Ukon",           series: "Minor"},
  {num: 178,name: "Black Satan",      char: "Black Satan",        series: "Villain"},
  {num: 179,name: "Black Buffalo",    char: "Black Buffalo",      series: "Minor"},
  {num: 180,name: "Black Knight",     char: "Black Knight",       series: "Minor"},
  // 181-190
  {num: 181,name: "Strongman",        char: "Strongman",          series: "Minor"},
  {num: 182,name: "Junkman",          pose: "C", char: "Junkman",            series: "Devil Knight"},
  {num: 183,name: "Pinchman",         char: "Pinchman",           series: "Minor"},
  {num: 184,name: "Geronimo",         pose: "B", char: "Geronimo",           series: "Justice"},
  {num: 185,name: "King the Tons",    pose: "C", char: "King the Tons",      series: "Villain"},
  {num: 186,name: "Kendaman",         pose: "C", char: "Kendaman",           series: "Minor"},
  {num: 187,name: "The Hawkman",      pose: "B", char: "The Hawkman",        series: "Minor"},
  {num: 188,name: "Phoenixman",       char: "Phoenixman",         series: "Villain"},
  {num: 189,name: "Mito",             pose: "C", char: "Mito",               series: "Minor"},
  {num: 190,name: "Gan Satan",        char: "Gan Satan",          series: "Villain"},
  // 191-200
  {num: 191,name: "Satan King",       char: "Satan King",         series: "Villain"},
  {num: 192,name: "Mixer Taite",      pose: "A", char: "Mixer Taite",        series: "Minor"},
  {num: 193,name: "Cobra Satan",      char: "Cobra Satan",        series: "Villain"},
  {num: 194,name: "Haniwa Satan",     char: "Haniwa Satan",       series: "Villain"},
  {num: 195,name: "Sunshine",         pose: "F", char: "Sunshine",           series: "Devil Knight"},
  {num: 196,name: "Terryman",         pose: "F", char: "Terryman",           series: "Justice"},
  {num: 197,name: "Robin Mask",       pose: "F", char: "Robin Mask",         series: "Justice"},
  {num: 198,name: "Soldierman",       char: "Soldierman",         series: "Minor"},
  {num: 199,name: "Ashuraman",        pose: "D", char: "Ashuraman",          series: "Devil Knight"},
  {num: 200,name: "Kinnikuman",       pose: "H", char: "Kinnikuman",         series: "Hero"},
  // 201-210
  {num: 201,name: "King the Tons",    pose: "D", char: "King the Tons",      series: "Villain"},
  {num: 202,name: "Cannonballer",     char: "Cannonballer",       series: "Villain"},
  {num: 203,name: "Parthenon",        char: "Parthenon",          series: "Minor"},
  {num: 204,name: "Sunigator",        pose: "F", char: "Sunigator",          series: "Devil Knight"},
  {num: 205,name: "Powerfulman",      char: "Powerfulman",        series: "Minor"},
  {num: 206,name: "Kinnikuman",       pose: "I", char: "Kinnikuman",         series: "Hero"},
  {num: 207,name: "Satan Prince",     char: "Satan Prince",       series: "Villain"},
  {num: 208,name: "Dickieman",        char: "Dickieman",          series: "Minor"},
  {num: 209,name: "Mixer Taite",      pose: "B", char: "Mixer Taite",        series: "Minor"},
  {num: 210,name: "Kinnikuman Soldier", pose: "C", char: "Kinnikuman Soldier", series: "Villain"},
  // 211-220
  {num: 211,name: "Buffaloman",       pose: "G", char: "Buffaloman",         series: "Justice"},
  {num: 212,name: "Benkiman",         pose: "B", char: "Benkiman",           series: "Justice"},
  {num: 213,name: "Kinnikuman",       pose: "J", char: "Kinnikuman",         series: "Hero"},
  {num: 214,name: "Ramenman",         pose: "D", char: "Ramenman",           series: "Justice"},
  {num: 215,name: "Terryman",         pose: "G", char: "Terryman",           series: "Justice"},
  {num: 216,name: "Warsman",          pose: "E", char: "Warsman",            series: "Justice"},
  {num: 217,name: "Wolfman",          pose: "E", char: "Wolfman",            series: "Justice"},
  {num: 218,name: "Warsman",          pose: "F", char: "Warsman",            series: "Justice"},
  {num: 219,name: "Robin Mask",       pose: "G", char: "Robin Mask",         series: "Justice"},
  {num: 220,name: "Brocken Jr.",      pose: "C", char: "Brocken Jr.",        series: "Justice"},
  // 221-233
  {num: 221,name: "Buffaloman",       pose: "H", char: "Buffaloman",         series: "Justice"},
  {num: 222,name: "Kinnikuman",       pose: "K", char: "Kinnikuman",         series: "Hero"},
  {num: 223,name: "Sunshine",         pose: "G", char: "Sunshine",           series: "Devil Knight"},
  {num: 224,name: "Black Hole",       pose: "B", char: "Black Hole",         series: "Devil Knight"},
  {num: 225,name: "Kinnikuman Big Body", char: "Kinnikuman Big Body", series: "Villain"},
  {num: 226,name: "Kinnikuman Mariposa", char: "Kinnikuman Mariposa", series: "Villain"},
  {num: 227,name: "Kinnikuman Zebra", pose: "B", char: "Kinnikuman Zebra",   series: "Villain"},
  {num: 228,name: "Super Phoenix",    char: "Super Phoenix",      series: "Villain"},
  {num: 229,name: "Neptuneman",       pose: "D", char: "Neptuneman",         series: "Villain"},
  {num: 230,name: "Canadianman",      pose: "D", char: "Canadianman",        series: "Justice"},
  {num: 231,name: "Ramenman",         pose: "E", char: "Ramenman",           series: "Justice"},
  {num: 232,name: "Terryman",         pose: "H", char: "Terryman",           series: "Justice"},
  {num: 233,name: "Kinnikuman",       pose: "L", char: "Kinnikuman",         series: "Hero"},
  // 234-236 (Special)
  {num: 234,name: "Muscleman (Ring Figure)",   char: "Kinnikuman",  series: "Special", special: true},
  {num: 235,name: "Terri-Bull (Ring Figure)",  char: "Buffaloman",  series: "Special", special: true},
  {num: 236,name: "Satan Cross",               char: "Satan Cross", series: "Special", special: true},
];

/* ── Helpers ────────────────────────────────────────────────── */
const pad = n => String(n).padStart(3, '0');

const SERIES_COLORS = {
  Hero:          'var(--c-hero)',
  Justice:       'var(--c-justice)',
  Villain:       'var(--c-villain)',
  'Devil Knight':'var(--c-devil)',
  Minor:         'var(--c-minor)',
  Special:       'var(--c-special)',
};

const BADGE_CLASSES = {
  Hero:          'badge-Hero',
  Justice:       'badge-Justice',
  Villain:       'badge-Villain',
  'Devil Knight':'badge-Devil',
  Minor:         'badge-Minor',
  Special:       'badge-Special',
};

function seriesColor(series) {
  return SERIES_COLORS[series] || 'var(--c-minor)';
}

function badgeClass(series) {
  return BADGE_CLASSES[series] || 'badge-Minor';
}

/* ── Image URL strategy ─────────────────────────────────────── */
function imageUrls(num) {
  const p = pad(num);
  return [
    // Local downloaded images (run scripts/download-images.py to populate)
    `images/figure-${p}.jpg`,
    // musclefigures.com — primary online source
    `https://www.musclefigures.com/wp-content/uploads/figure-${p}.jpg`,
    `https://www.musclefigures.com/wp-content/uploads/figure${p}.jpg`,
    `https://www.musclefigures.com/wp-content/uploads/MUSCLE-${p}.jpg`,
    `https://www.musclefigures.com/wp-content/uploads/muscle-figure-${p}.jpg`,
    // uofmuscle.com — secondary online source
    `http://blog.uofmuscle.com/wp-content/uploads/MUSCLE-Figure-${p}.jpg`,
    `http://blog.uofmuscle.com/wp-content/uploads/figure-${p}.jpg`,
  ];
}

/* ── Count series ───────────────────────────────────────────── */
function countBySeries() {
  const counts = { all: figures.length };
  figures.forEach(f => {
    counts[f.series] = (counts[f.series] || 0) + 1;
  });
  return counts;
}

/* ── State ──────────────────────────────────────────────────── */
let activeSeries  = 'all';
let searchQuery   = '';
let modalIndex    = -1;   // index in filteredVisible
let visibleFigures = [...figures]; // currently visible after filter

/* ── DOM refs ───────────────────────────────────────────────── */
const grid        = document.getElementById('figureGrid');
const searchInput = document.getElementById('searchInput');
const searchClear = document.getElementById('searchClear');
const filterBtns  = document.querySelectorAll('.sf-btn');
const resultsCount= document.getElementById('resultsCount');
const noResults   = document.getElementById('noResults');
const resetBtn    = document.getElementById('resetBtn');

const modalOverlay  = document.getElementById('modalOverlay');
const modalBackdrop = document.getElementById('modalBackdrop');
const modalClose    = document.getElementById('modalClose');
const modalPrev     = document.getElementById('modalPrev');
const modalNext     = document.getElementById('modalNext');
const modalImg      = document.getElementById('modalImg');
const modalPh       = document.getElementById('modalPlaceholder');
const modalPhNum    = document.getElementById('modalPhNum');
const modalPhName   = document.getElementById('modalPhName');
const modalBadge    = document.getElementById('modalBadge');
const modalTitle    = document.getElementById('modalFigTitle');
const modalFigNum   = document.getElementById('modalFigNum');
const modalChar     = document.getElementById('modalChar');
const modalSeriesEl = document.getElementById('modalSeries');
const modalPoseRow  = document.getElementById('modalPoseRow');
const modalPose     = document.getElementById('modalPose');
const linkEbay      = document.getElementById('linkEbay');
const linkGoogle    = document.getElementById('linkGoogle');
const linkWiki      = document.getElementById('linkWiki');

/* ── Build card HTML ────────────────────────────────────────── */
function buildCard(fig, idx) {
  const p       = pad(fig.num);
  const color   = seriesColor(fig.series);
  const poseStr = fig.pose ? ` (${fig.pose})` : '';
  const urls    = imageUrls(fig.num);

  const card = document.createElement('article');
  card.className = 'fig-card';
  card.dataset.idx      = idx;
  card.dataset.series   = fig.series;
  card.dataset.name     = (fig.name + ' ' + fig.char).toLowerCase();
  card.dataset.urlIdx   = '0';
  card.dataset.figNum   = fig.num;
  card.style.setProperty('--series-color', color);

  card.innerHTML = `
    <div class="card-num">#${p}</div>
    <div class="card-series" title="${fig.series}"></div>
    <div class="card-image-zone">
      <img
        src="${urls[0]}"
        alt="M.U.S.C.L.E. Figure #${p} — ${fig.name}"
        loading="lazy"
        onerror="handleImgError(this)"
      >
      <div class="card-placeholder" style="display:none">
        <div class="ph-silhouette"></div>
        <span class="ph-num">#${p}</span>
        <span class="ph-name">${fig.name}</span>
      </div>
    </div>
    <div class="card-info">
      <div class="card-name" title="${fig.name}${poseStr}">${fig.name}${poseStr}</div>
      <div class="card-meta">
        <span class="card-series-label">${fig.series}</span>
        ${fig.pose ? `<span class="card-pose">· Pose ${fig.pose}</span>` : ''}
      </div>
    </div>
  `;

  card.addEventListener('click', () => openModal(idx));
  return card;
}

function handleImgError(img) {
  // Try the next fallback URL before showing placeholder
  const card   = img.closest('.fig-card');
  const figNum = card ? parseInt(card.dataset.figNum, 10) : null;
  if (figNum) {
    const urls  = imageUrls(figNum);
    const next  = parseInt(card.dataset.urlIdx || '0', 10) + 1;
    if (next < urls.length) {
      card.dataset.urlIdx = next;
      img.src = urls[next];
      return;
    }
  }
  // All URLs exhausted — show placeholder
  img.style.display = 'none';
  const ph = img.closest('.card-image-zone').querySelector('.card-placeholder');
  if (ph) ph.style.display = 'flex';
}
// Make available globally for inline onerror
window.handleImgError = handleImgError;

/* ── Render all cards ───────────────────────────────────────── */
function renderCards() {
  grid.innerHTML = '';
  figures.forEach((fig, idx) => {
    const card = buildCard(fig, idx);
    grid.appendChild(card);
  });
  // Observe for scroll animations
  setupScrollObserver();
}

/* ── Filter & Search ────────────────────────────────────────── */
function applyFilters() {
  const q     = searchQuery.toLowerCase().trim();
  let count   = 0;
  visibleFigures = [];

  document.querySelectorAll('.fig-card').forEach((card, i) => {
    const fig     = figures[i];
    const seriesOk = activeSeries === 'all' || fig.series === activeSeries;
    const searchOk = !q ||
      card.dataset.name.includes(q) ||
      pad(fig.num).includes(q) ||
      String(fig.num).includes(q);

    if (seriesOk && searchOk) {
      card.classList.remove('hidden-filtered');
      visibleFigures.push(fig);
      count++;
    } else {
      card.classList.add('hidden-filtered');
    }
  });

  // Update count label
  const label = count === 1 ? '1 figure' : `${count} figures`;
  resultsCount.textContent = label;

  // Show/hide no-results
  if (count === 0) {
    noResults.style.display = 'block';
    grid.style.display      = 'none';
  } else {
    noResults.style.display = 'none';
    grid.style.display      = 'grid';
  }

  // Show/hide reset button
  const isFiltered = activeSeries !== 'all' || q !== '';
  resetBtn.style.display = isFiltered ? 'block' : 'none';
}

/* ── Reset ──────────────────────────────────────────────────── */
function resetFilters() {
  activeSeries  = 'all';
  searchQuery   = '';
  searchInput.value = '';
  searchClear.classList.remove('visible');

  filterBtns.forEach(b => b.classList.toggle('active', b.dataset.series === 'all'));
  applyFilters();
}
window.resetFilters = resetFilters;

/* ── Update filter counts ───────────────────────────────────── */
function updateFilterCounts() {
  const counts = countBySeries();
  const map = {
    'all':         document.getElementById('fc-all'),
    'Hero':        document.getElementById('fc-hero'),
    'Justice':     document.getElementById('fc-justice'),
    'Villain':     document.getElementById('fc-villain'),
    'Devil Knight':document.getElementById('fc-devil'),
    'Minor':       document.getElementById('fc-minor'),
    'Special':     document.getElementById('fc-special'),
  };
  Object.entries(map).forEach(([key, el]) => {
    if (el) el.textContent = counts[key] || 0;
  });
}

/* ── Scroll-triggered card reveal ───────────────────────────── */
function setupScrollObserver() {
  const cards = document.querySelectorAll('.fig-card');
  let batchDelay = 0;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const card = entry.target;
        // Stagger within viewport batch
        const delay = batchDelay++ * 30;
        card.style.transitionDelay = `${delay}ms`;
        card.classList.add('revealed');
        observer.unobserve(card);
        // Reset batch delay so next scroll batch restarts
        setTimeout(() => { batchDelay = Math.max(0, batchDelay - 1); }, delay + 500);
      }
    });
  }, {
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.05,
  });

  cards.forEach(card => observer.observe(card));
}

/* ── Hero: animate count ────────────────────────────────────── */
function animateCount() {
  const el = document.getElementById('animCount');
  if (!el) return;
  let start = 0;
  const end = 236;
  const dur = 1800;
  const step = 16;
  const inc = (end / (dur / step));
  const timer = setInterval(() => {
    start = Math.min(start + inc, end);
    el.textContent = Math.floor(start);
    if (start >= end) {
      el.textContent = end;
      clearInterval(timer);
    }
  }, step);
}

/* ── Hero: floating figure numbers ─────────────────────────── */
function spawnFloatingNums() {
  const container = document.getElementById('heroFloatingNums');
  if (!container) return;

  const sample = [1, 17, 35, 46, 61, 82, 93, 110, 124, 141, 163, 178, 200, 219, 236];

  sample.forEach((num, i) => {
    const el = document.createElement('div');
    el.className = 'fn';
    el.textContent = `#${pad(num)}`;
    const x = 5 + Math.random() * 90;
    const dur = 12 + Math.random() * 18;
    const delay = -(Math.random() * dur);
    const rot = -15 + Math.random() * 30;
    el.style.cssText = `
      left: ${x}%;
      --rot: ${rot}deg;
      animation-duration: ${dur}s;
      animation-delay: ${delay}s;
      font-size: ${1.5 + Math.random() * 3}rem;
    `;
    container.appendChild(el);
  });
}

/* ── Modal ──────────────────────────────────────────────────── */
function openModal(figIdx) {
  // figIdx is index in figures array
  // Find position in visibleFigures
  const fig = figures[figIdx];
  modalIndex = visibleFigures.findIndex(f => f.num === fig.num);
  if (modalIndex < 0) {
    // If not in visible set, show anyway
    visibleFigures = [...figures];
    modalIndex = figIdx;
  }
  renderModal(fig);
  modalOverlay.classList.add('open');
  modalOverlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modalOverlay.classList.remove('open');
  modalOverlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  // Reset img so it doesn't linger
  setTimeout(() => { modalImg.src = ''; }, 300);
}

function renderModal(fig) {
  const p = pad(fig.num);

  // Image
  modalImg.style.display = '';
  modalPh.style.display  = 'none';
  modalImg.alt = `M.U.S.C.L.E. Figure #${p} — ${fig.name}`;

  const urls = imageUrls(fig.num);
  let urlIdx = 0;

  function tryNext() {
    if (urlIdx < urls.length) {
      modalImg.src = urls[urlIdx++];
    } else {
      // All failed: show placeholder
      modalImg.style.display = 'none';
      modalPh.style.display  = 'flex';
      modalPhNum.textContent  = `#${p}`;
      modalPhName.textContent = fig.name;
    }
  }

  modalImg.onerror = tryNext;
  tryNext();

  // Placeholder text (always set)
  modalPhNum.textContent  = `#${p}`;
  modalPhName.textContent = fig.name;

  // Info
  const poseStr = fig.pose ? `Pose ${fig.pose}` : '';
  modalBadge.textContent  = fig.series;
  modalBadge.className    = `modal-series-badge ${badgeClass(fig.series)}`;
  modalTitle.textContent  = fig.name + (fig.pose ? ` (${fig.pose})` : '');
  modalFigNum.textContent = `#${p}`;
  modalChar.textContent   = fig.char;
  modalSeriesEl.textContent = fig.series;

  if (poseStr) {
    modalPoseRow.style.display = '';
    modalPose.textContent = poseStr;
  } else {
    modalPoseRow.style.display = 'none';
  }

  // External links
  const searchTerm = encodeURIComponent(`MUSCLE figure #${fig.num} ${fig.name} Mattel`);
  const wikiTerm   = encodeURIComponent(fig.char);
  linkEbay.href   = `https://www.ebay.com/sch/i.html?_nkw=${searchTerm}`;
  linkGoogle.href = `https://www.google.com/search?q=${searchTerm}&tbm=isch`;
  linkWiki.href   = `https://kinnikuman.fandom.com/wiki/${wikiTerm}`;

  // Nav state
  modalPrev.disabled = modalIndex <= 0;
  modalNext.disabled = modalIndex >= visibleFigures.length - 1;
}

function navigateModal(dir) {
  const next = modalIndex + dir;
  if (next < 0 || next >= visibleFigures.length) return;
  modalIndex = next;
  const fig = visibleFigures[modalIndex];
  renderModal(fig);
}

/* ── Event listeners ────────────────────────────────────────── */

// Search
searchInput.addEventListener('input', () => {
  searchQuery = searchInput.value;
  searchClear.classList.toggle('visible', searchQuery.length > 0);
  applyFilters();
});

searchClear.addEventListener('click', () => {
  searchInput.value = '';
  searchQuery = '';
  searchClear.classList.remove('visible');
  applyFilters();
  searchInput.focus();
});

// Series filter
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    activeSeries = btn.dataset.series;
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    applyFilters();
  });
});

// Reset
resetBtn.addEventListener('click', resetFilters);

// Modal close
modalClose.addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', closeModal);
modalPrev.addEventListener('click', () => navigateModal(-1));
modalNext.addEventListener('click', () => navigateModal(1));

// Keyboard
document.addEventListener('keydown', e => {
  if (!modalOverlay.classList.contains('open')) return;
  if (e.key === 'Escape')     closeModal();
  if (e.key === 'ArrowLeft')  navigateModal(-1);
  if (e.key === 'ArrowRight') navigateModal(1);
});

/* ── Sticky filter bar shadow ───────────────────────────────── */
(function() {
  const bar = document.getElementById('filterBar');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    bar.style.boxShadow = window.scrollY > 10
      ? '0 4px 30px rgba(0,0,0,0.8)'
      : 'none';
  }, { passive: true });
})();

/* ── Hero parallax ──────────────────────────────────────────── */
(function() {
  const hero = document.getElementById('hero');
  if (!hero) return;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    requestAnimationFrame(() => {
      const scrolled = window.scrollY;
      if (scrolled < window.innerHeight) {
        const content = hero.querySelector('.hero-content');
        if (content) content.style.transform = `translateY(${scrolled * 0.25}px)`;
      }
      ticking = false;
    });
    ticking = true;
  }, { passive: true });
})();

/* ── Init ───────────────────────────────────────────────────── */
(function init() {
  updateFilterCounts();
  renderCards();
  spawnFloatingNums();

  // Animate count after brief delay
  setTimeout(animateCount, 800);

  // Smooth-scroll CTA
  document.querySelectorAll('a[href="#catalog"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const target = document.getElementById('catalog');
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  console.log(`%cM.U.S.C.L.E. Catalog%c
All ${figures.length} figures loaded.
Mattel 1985–1988 · Based on Kinnikuman`,
    'font-size:1.5rem;font-weight:bold;color:#F0A87A',
    'color:#888'
  );
})();
