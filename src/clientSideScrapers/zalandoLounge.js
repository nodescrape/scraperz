const initializeZalandoScraper = () => {
    const KOLOR_TAB = "Kolor"
    const ROZMIAR_TAB = "Rozmiar"
    const PRICE_TAB = "Cena"

    const context = {
        tab: undefined,
        colors: [],
        sizeCategory: undefined,
        sizes: [],
        minPrice: undefined,
        maxPrice: undefined
    }

    // It's redundant to create an object if values will be numeric
    // TODO: This approach is really inflexible. Will there be any other cases though?
    const tabMap = [
        "kategorie",
        ROZMIAR_TAB,
        "marka",
        KOLOR_TAB,
        PRICE_TAB,
        "sortowanie"
    ]
    const abstractToggler = (baseSelector) => (text) => {
        const el = $(`${baseSelector} span:contains("${text}"):not([class])`)
        if (el) {

        }
    }
    const toggleTab = (tab) => {
        const el = $(`.tabs___link___UQInA span:contains("${tab}"):not([class])`)
            .get()[0]
        if (el) {
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

    const toggleSizeCategory = (sizeCategory) => {
        if (context.tab === ROZMIAR_TAB) {
            const el = $(`.sizeTab___tab___1Gx2e span:contains("${sizeCategory}"):not([class])`)
                .get()[0];
            if (el) {
                el.click();
                context.sizeCategory = sizeCategory;
                return true;
            } else {
                console.log(`There is no such size category: ${sizeCategory}`);
                return false;
            }
        }
    }

    const toggleSize = (size) => {
        if (context.tab === ROZMIAR_TAB) {
            const el = $(`.sizeSelectors___size-wrapper___2x_yi [aria-label*="${size}"]`)
                .get()[0]
            if (el) {
                context.size = size
                el.click()
                if (size in context.sizes) {
                    context.sizes = context.sizes.filter(s => s !== size)
                } else {
                    context.sizes.push(size)
                }
            } else {
                console.log(`There is no such size: ${size}`)
                return false
            }
        }
    }
    const setPriceBoundaries = (min, max) => {
        if (context.tab === PRICE_TAB) {
            const minInput = $('#price-min')
            const maxInput = $('#price-max')
            minInput.val(min)
            maxInput.val(max)
            context.minPrice = min
            context.maxPrice = max
            minInput.click()
            minInput.focus()
            setTimeout(() => {
                $("#inner-wrapper")
                    .get()[0].click()
            })
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
    };
    const shareToWindow = {
        scrapeLounge,
        toggleColor,
        toggleSizeCategory,
        toggleTab,
        toggleSize,
        setPriceBoundaries
    };
    Object.entries(shareToWindow)
        .forEach(([k, v]) => {
            window[k] = v
        });
}
initializeZalandoScraper()