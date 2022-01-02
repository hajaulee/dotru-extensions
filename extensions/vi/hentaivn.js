function HentaiVNX() {
    this.name = "HentaiVNX";
    this.version = "0.0.6";
    this.thumbnail = "https://raw.githubusercontent.com/hajaulee/dotru-extensions/main/icon/hentaivn/icon.png";
    this.lang = "vi";
    this.baseUrl = "https://hentaivn.moe";
    this.supportsLatest = true;
    this.headerBuilder = () => {
        return {}
    }
    // Popular
    this.popularMangaRequest = (page) => `${this.baseUrl}/danh-sach.html?page=${page}`;
    this.popularMangaNextPageSelector = () => "ul.pagination > li:contains(Next)";
    this.popularMangaSelector = () => ".main > .block-left > .block-item > ul > li.item";
    this.popularMangaFromElement = (e) => {
        const relativeUrl = e.querySelector(".box-description a").getAttribute("href");
        const url = new URL(relativeUrl, this.baseUrl).href;
        const title = e.querySelector(".box-description a").innerText.trim();
        const thumbnailUrl = e.querySelector(".box-cover a img").getAttribute("data-src");
        return {
            url,
            thumbnailUrl,
            title
        };
    }
    // Latest
    this.latestUpdatesRequest = (page) => `${this.baseUrl}/chap-moi.html?page=${page}`;
    this.latestUpdatesNextPageSelector = this.popularMangaNextPageSelector;
    this.latestUpdatesSelector = this.popularMangaSelector;
    this.latestUpdatesFromElement = this.popularMangaFromElement;
    // Search
    this.searchMangaRequest = (page, query, filters) => {
        let requestUrl = `${this.baseUrl}/tim-kiem-truyen.html?key=${query.replaceAll(' ', '+')}`;
        if (page > 1) {
            requestUrl += `&page=${page}`;
        }
        return requestUrl;
        // Todo Filters
    }
    this.searchMangaNextPageSelector = this.popularMangaNextPageSelector;;
    this.searchMangaSelector = this.popularMangaSelector;
    this.searchMangaFromElement = this.popularMangaFromElement;
    //Detail
    this.mangaDetailsParse = (doc) => {
        function parseStatus(status) {
            return status == null ? "UNKNOWN" :
                status.includes("Đang tiến hành") ? "ONGOING" :
                status.includes("Đã hoàn thành") ? "COMPLETED" : "UNKNOWN";
        }
        let infoElement = doc.querySelector(".main > .page-left > .left-info > .page-info");
        let author = '';
        let artist = author;
        let description = '';
        let status = '';
        let innerText = '';
        let infos = infoElement.querySelectorAll("p");
        infos.forEach((item, index) => {
            innerText = item.innerText.trim();
            if (innerText.startsWith("Tác giả:")) {
                author = innerText.replace("Tác giả:", "");
                artist = artist;
            } else if (innerText.startsWith("Tình Trạng:")) {
                status = innerText.replace("Tình Trạng:", "");
            } else if (innerText.startsWith("Nội dung:")) {
                description = infos[index + 1]?.innerText.trim();
            }
        });
        let genreList = []
        infoElement.querySelectorAll("a.tag").forEach(item => genreList.push(item.innerText));
        let genre = genreList.join(", ");
        let thumbnailUrl = doc.querySelector(".main > .page-right > .right-info > .page-ava > img").getAttribute("src");
        status = parseStatus(status);
        return {
            author,
            artist,
            genre,
            description,
            thumbnailUrl,
            status
        }
    }
    // Chapters
    this.chapterListSelector = () => ".page-info > table.listing > tbody > tr";
    this.chapterFromElement = (element) => {
        const parseDate = (dateString) => new Date(dateString.split("/").reverse().join('/')).getTime();
        const name = element.querySelector("a").querySelector("h2").innerText;
        const relativeUrl = element.querySelector("a").getAttribute("href");
        const dateUpload = parseDate(element.querySelector("td:nth-child(2)").innerText.trim());
        return {
            relativeUrl,
            name,
            dateUpload
        }
    }
    // Pages
    this.pageListParse = (document) => {
        const pages = [];
        document.querySelectorAll("#image > img").forEach(
            (item, index) => {
                pages.push({
                    index,
                    name: "",
                    url: item.getAttribute("src")
                });
            });
        return pages
    }
}
