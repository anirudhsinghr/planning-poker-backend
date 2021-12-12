const Packs = {
  fibonacci: ["0", "1", "2", "3", "5", "8", "13", "21", "34", "55", "89"],
  sequential: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
  has: (name) => Packs.hasOwnProperty(name)
}

module.exports = Packs;