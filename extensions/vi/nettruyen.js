function NetTruyen() {

    this.name = "NetTruyen";
    this.version = "0.0.2";
    this.thumbnail = "https://raw.githubusercontent.com/hajaulee/dotru-extensions/main/icon/nettruyen/icon.png";
    this.lang = "vi";
    this.baseUrl = "http://www.nettruyengo.com";
    this.supportsLatest = true;
  
    this.headerBuilder = () => {
      return {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:84.0) Gecko/20100101 Firefox/84.0",
        "Referer": this.baseUrl
      }
    }
  
    // Popular
    this.popularMangaRequest = (page) => `${this.baseUrl}/hot${page > 1? ("?page=" + page) : ""}`;
    this.popularMangaNextPageSelector = () => "a.next-page, a[rel=next]";
    this.popularMangaSelector = () => "div.items div.item";
    this.popularMangaFromElement = (e) => {
        const url = e.querySelector("h3 a").getAttribute("href");
        const title = e.querySelector("h3 a").innerText;
        const thumbnailUrl = imageOrNull(e.querySelector("div.image:first-of-type img"));
        return {url, thumbnailUrl, title};
    }
  
    // Latest
    this.latestUpdatesRequest = (page) => `${this.baseUrl}${page > 1? ("?page=" + page) : ""}`;
    this.latestUpdatesNextPageSelector = this.popularMangaNextPageSelector;
    this.latestUpdatesSelector = this.popularMangaSelector;
    this.latestUpdatesFromElement = this.popularMangaFromElement;
  
  
    // Search
    this.searchMangaRequest = (page, query, filters) => {
        return `${this.baseUrl}/tim-truyen?keyword=${query}&page=${page}`
        // Todo Filters
    }
  
    this.searchMangaNextPageSelector = this.popularMangaNextPageSelector;
    this.searchMangaSelector = () => "div.items div.item div.image a";
    this.searchMangaFromElement  = (e) => {
        const title = e.getAttribute("title");
        const url = "https:" + e.getAttribute("href").replace("https:", "");
        const thumbnailUrl = imageOrNull(e.querySelector("img"));
        return {url, thumbnailUrl, title};
    }
  
  
    //Detail
  
    this.mangaDetailsParse = (doc) => {
       
        let info = doc.querySelector("article#item-detail");
        let author = info.querySelector("li.author p.col-xs-8").innerText.trim()
        let artist = author;
        let glist = [];
        info.querySelectorAll("li.kind p.col-xs-8 a").forEach(it =>  { glist.push(it.innerText) });
        let genre = glist.join(", ");
        let description = info.querySelector("div.detail-content p").innerText.trim();
        let status = parseStatus(info.querySelector("li.status p.col-xs-8").innerText.trim());
        return {
          author, artist, genre, description, status
        }
     }
  
    // Chapters
    this.chapterListSelector = () => "div.list-chapter li.row:not(.heading)";
    this.chapterFromElement = (element) => {
        const url = "https:" + element.querySelector("a").getAttribute("href").replace("https:", "").replace("http:", "");
        const name = element.querySelector("a").innerText.trim();
        const dateUpload = parseDate(element.querySelector("div.col-xs-4").innerText.trim());
        return {url, name, dateUpload}
    }
  
    // Pages
  
    this.pageListParse = (document) => {
        const pages = [];
        document.querySelectorAll("div.page-chapter > img, li.blocks-gallery-item img").forEach((element, index) => {
            const url = "https:" + imageOrNull(element).replace("https:", "");
            const name = "";
            pages.push({index, name, url });
        });
        return pages;
    }
    
    // Utils
    const parseDate = (dateString) => {
      const secondWords = ["second", "seconds", "giây"];
      const minuteWords = ["minute", "minutes", "phút"];
      const hourWords = ["hour", "hours",  "giờ"];
      const dayWords = ["day", "days", "ngày"];
      const agoWords = ["ago", "trước"];
      const now = new Date().getTime();
      if (agoWords.some(word => dateString.toLowerCase().includes(word))){
          let splittedDate = dateString.split(" ");
          if (secondWords.includes(splittedDate[1])){
              return now - splittedDate[0] * 1000;
          }else if (minuteWords.includes(splittedDate[1])){
              return now - splittedDate[0] * 1000 * 60;
          }else if (hourWords.includes(splittedDate[1])){
              return now - splittedDate[0] * 1000 * 60 * 60;
          }else if (dayWords.includes(splittedDate[1])){
              return now - splittedDate[0] * 1000 * 60 * 60 * 24;
          }else {
              return now;
          }
      }else if (/\d+\/\d+\/\d+/.test(dateString)){
          return new Date("20" + dateString.split("/").reverse().join('/')).getTime()
      }else if (/\d+\/\d+/.test(dateString)){
          return new Date(new Date().getFullYear() + "/" + dateString.split("/").reverse().join('/')).getTime();
      }
      return 0;
    }
    
    const parseStatus = (stat) => {
       const ongoingWords = ["ongoing", "updating", "đang tiến hành"];
       const completedWords = ["complete", "hoàn thành"];
       if (ongoingWords.includes(stat.toLowerCase())){ return "ONGOING"}
       if (completedWords.includes(stat.toLowerCase())){ return "COMPLETED"}
       return "UNKNOWN";
    }
    
    // sources sometimes have an image element with an empty attr that isn't really an image
    const imageOrNull = (element) => {
      const srcAttrs = ["data-original", "data-src", "src"];
      for(let attr of srcAttrs){
         if (element.getAttribute(attr)?.includes("//")) return "https:" + element.getAttribute(attr).replace("https:", "");
      }
      return null;
    }
  
  }
