const scrape = () => {
    // Remember to load artoo before calling this function

    let accumulator = {
        page: 1
    };

    const getName = (context) => {
        $(context)
            .find(".m-offerBox_data")
            .text()
            .replace(/\n/g, '')
            .trim()
    }

    const scraper = {
        iterator: '.m-grid_item',
        data: {
            name() {
                return $(this)
                    .find(".m-offerBox_data")
                    .text()
                    .replace(/\n/g, '')
                    .trim()
            },
            // this is not 100% bulletproof
            brand() {
                return $(this)
                    .find(".m-offerBox_data")
                    .text()
                    .replace(/\n/g, '')
                    .trim()
                    .split(' ')[0]
            },

            price() {
                return +$(this)
                    .find(".m-priceBox_new")
                    .text()
                    .replace(/(\s|\n)/g, '')
                    .replace(/zł/, '')
                    .replace(',', '.')
            },

            url() {
                return `${location.origin}${$(this).find(".m-offerBox_data a").attr('href')}`
            },

            badges() {
                return $(this)
                    .find('.image_widget img')
                    .map(function (i, el) {
                        return el.src
                    })
                    .get()
            },

            page() {
                return accumulator.page
            }
        }
    }

    const getNextURL = ($page) => {
        const href = $page.find(".m-pagination_next")
            .attr("href")
        return href && `${href}`
    }

    artoo.log.debug('Starting the scraper...');

    const frontpage = artoo.scrape(scraper);

    artoo.ajaxSpider(
        function (i, $data) {
            const next = getNextURL(!i ? artoo.$(document) : $data);
            accumulator.page++
            return next
        }, {
            scrape: scraper,
            concat: true,
            done: function (data) {
                artoo.log.debug('Finished retrieving data. Downloading...');
                frontpage.push(...data)
                console.log(frontpage)
                artoo.savePrettyJson(
                    frontpage, {
                        filename: `alsen${location.pathname.replace(/\//g, '-')}.json`
                    }
                );
            }
        }
    );
}

