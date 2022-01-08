function SenManga() {

    this.name = "SenManga";
    this.version = "0.0.1";
    this.thumbnail = "https://raw.githubusercontent.com/hajaulee/dotru-extensions/main/icon/senmanga/image.png";
    this.lang = "ja";
    this.baseUrl = "https://raw.senmanga.com";
    this.supportsLatest = true;
  
    this.headerBuilder = () => {
      return {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:84.0) Gecko/20100101 Firefox/84.0",
        "Referer": this.baseUrl
      }
    }
  
    // Popular
    this.popularMangaRequest = (page) => `${this.baseUrl}/directory/popular?page=${page}`;
    this.popularMangaNextPageSelector = () => "ul.pagination a[rel=next]";
    this.popularMangaSelector = () => "div.item";
    this.popularMangaFromElement = (e) => {
        const url = e.querySelector("a").getAttribute("href");
        const title = e.querySelector("a").querySelector("div.series-title").innerText;
        const thumbnailUrl = e.querySelector("img").getAttribute("src");
        return {url, thumbnailUrl, title};
    }
  
    // Latest
    this.latestUpdatesRequest = (page) => `${this.baseUrl}/directory/last_update?page=${page}`;
    this.latestUpdatesNextPageSelector = this.popularMangaNextPageSelector;
    this.latestUpdatesSelector = this.popularMangaSelector;
    this.latestUpdatesFromElement = this.popularMangaFromElement;
  
  
    // Search
    this.searchMangaRequest = (page, query, filters) => {
        return `${this.baseUrl}/search?s=${query}&page=${page}`
        // Todo Filters
    }
  
    this.searchMangaNextPageSelector = this.popularMangaNextPageSelector;
    this.searchMangaSelector = this.popularMangaSelector;
    this.searchMangaFromElement  = this.popularMangaFromElement;
  
  
    //Detail
  
    this.mangaDetailsParse = (doc) => {
       let title = doc.querySelector("h1.series").innerText;
       let thumbnailUrl = doc.querySelector("div.cover img").getAttribute("src");
       let description = doc.querySelector("div.summary").innerText.trim();
       
       let info = doc.querySelector("div.series-desc .info");
        let author = info.querySelectorAll(".item")[3]?.innerText.trim().split(": ").reverse()[0];
        let artist = author;
        let genre = info.querySelectorAll(".item")[0]?.innerText.trim().split(": ").reverse()[0];
        let status = parseStatus(info.querySelector(".item")[1]?.innerText.trim());
        return {
          title, thumbnailUrl, author, artist, genre, description, status
        }
     }
  
    // Chapters
    this.chapterListSelector = () => "ul.chapter-list li";
    this.chapterFromElement = (element) => {
        const url = element.querySelector("a").getAttribute("href");
        const name = element.querySelector("a").innerText.trim();
        const dateUpload = parseDate(element.querySelector("time").getAttribute("datetime"));
        return {url, name, dateUpload}
    }
  
    // Pages
  
    this.pageListParse = (doc) => {
        const maxPage = parseInt(doc.querySelector("select[name=page] option:last-of-type").innerText);
        const firstPageLink = doc.querySelector(".picture").getAttribute("src").slice(0, -1);
        return Array.from({length: maxPage}, (_, i) => i + 1).map((i, index) => {
        	return {
        		index: index,
        		name: "",
        		url: firstPageLink + i
        	};
        });
    }
    
    // Utils
    const parseDate = (dateString) => {
      const date = new Date(dateString);
      return date.toTimeString() != 'Invalid Date' ? date.getTime() : 0;
    }
    
    const parseStatus = (stat) => {
       if (!stat) { return "UNKNOWN"}
       if (stat.toLowerCase().includes("ongoing")){ return "ONGOING"}
       if (stat.toLowerCase().includes("complete")){ return "COMPLETED"}
       return "UNKNOWN";
    }
  
  }
