
const pepperScraper = () => {
  // Remember to load artoo before calling this function
    const normalize = (str) => str.replace(/\n/g, '')
        .trim();
    console.log(artoo.scrape({
        iterator: ".threadCardLayout--card",
        data: {
            name() {
                return normalize($(this)
                    .find(".thread-title--card")
                    .text())
            },
            votes() {
                return +normalize($(this)
                        .find(".cept-vote-temp")
                        .text())
                    .replace('°', '')
            },
            price() {
                return +normalize($(this)
                        .find(".thread-price")
                        .text())
                    .replace("zł", '')
                    .replace('.', '')
                    .replace(',', '.')
            }
        }
    }))
}
