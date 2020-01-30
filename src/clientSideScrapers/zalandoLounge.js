const KOLOR_TAB = "kolor"

const context = {
    tab: undefined,
    colors: []
}

// It's redundant to create an object if values will be numeric
// TODO: This approach is really inflexible. Will there be any other cases though?
const tabMap = [
    "kategorie",
    "rozmiar",
    "marka",
    KOLOR_TAB,
    "cena",
    "sortowanie"
]

const toggleTab = (tab) => {
    const tabIndex = tabMap.indexOf(tab)
    if (tabIndex > -1) {
        const el = $(".tabs___link___UQInA")
            .eq(tabIndex)
            .get()[0]
        el.click()
        context.tab = tab
        return true
    } else {
        console.log(`There's no such tab: ${tab}`)
        return false
    }
}

const toggleColor = (color) => {
    if (context.tab === KOLOR_TAB) {
        let el = $(`span:contains("${color}"):not([class])`)
            .get()
        el = el[1] || el[0]
        if (el) {
            // This is inflexible
            el.parentElement.parentElement.click();
            if (color in context.colors) {
              context.colors = context.colors.filter(c => c !== color)
            } else {
              context.colors.push(color)
            }
            return true
        }
    } else {
      console.log(`There is no such color: ${color}`)
      return false
    }
}

// Scrape products of a zalando lounge campaign
// TODO: Handle scrolling automatically
const scrapeLounge = () => {
    // Remember to load artoo before calling this function
    const normalizePrice = (price) => {
        return +price.replace(/zł.*$/, '')
            .replace(/[a-z]/gi, '')
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