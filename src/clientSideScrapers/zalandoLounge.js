// Scrape products of a zalando lounge campaign
// TODO: Handle scrolling automatically
const scrapeLounge = () => {
    // Remember to load artoo before calling this function
    const normalizePrice = (price) => {
        return +price.replace(/zł.*$/, '')
            .trim()
            .replace(',', '.')
    };
    return artoo.scrape({
            iterator: ".Articlestyles__ArticleWrapper-hib3gs-0",
            data: {
                name() {
                    return $(this)
                        .find(".Articlestyles__ArticleNameWrapper-hib3gs-2")
                        .text()
                },
                price() {
                    return normalizePrice($(this)
                        .find(".frGAYy")
                        .text())
                },
                prevPrice() {
                    return normalizePrice($(this)
                        .find('.jsWzcU')
                        .text())
                },
                badge() {
                    return $(this)
                        .find(".articleBadge___wrapper___5qDAN")
                        .text()
                },
                image() {
                    return $(this)
                        .find(".fLfeyA")
                        .attr('style')
                        .match(/(?<=\(").+(?="\))/)[0]
                }
            }
        })
        .map(el => ({
            ...el,
            discount: Math.floor((1 - (el.price / el.prevPrice)) * 100)
        }))
}