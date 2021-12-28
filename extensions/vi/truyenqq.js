function TruyenQQ() {

  this.name = "TruyenQQ";
  this.version = "0.0.1";
  this.thumbnail = "https://raw.githubusercontent.com/hajaulee/dotru-extensions/main/icon/truyenqq/icon.png";
  this.lang = "vi";
  this.baseUrl = "https://truyenqqtop.com";
  this.supportsLatest = true;

  this.headerBuilder = () => {
    return {}
  }

  // Popular
  this.popularMangaRequest = (page) => `${this.baseUrl}/top-thang/trang-${page}.html`;
  this.popularMangaNextPageSelector = () => "a.pagination-link:contains(›)";
  this.popularMangaSelector = () => "div.story-item";
  this.popularMangaFromElement = (e) => {
      const url = e.querySelector("a").getAttribute("href");
      const thumbnailUrl = e.querySelector("img.story-cover").getAttribute("src");
      const title = e.querySelector(".title-book a").innerText;
      return {url, thumbnailUrl, title};
  }

  // Latest
  this.latestUpdatesRequest = (page) => `${this.baseUrl}/truyen-moi-cap-nhat/trang-${page}.html`;
  this.latestUpdatesNextPageSelector = this.popularMangaNextPageSelector;
  this.latestUpdatesSelector = this.popularMangaSelector;
  this.latestUpdatesFromElement = this.popularMangaFromElement;


  // Search
  this.searchMangaRequest = (page, query, filters) => {
      return `${this.baseUrl}/tim-kiem/trang-${page}.html?q=${query}`
      // Todo Filters
  }

  this.searchMangaNextPageSelector = this.popularMangaNextPageSelector;
  this.searchMangaSelector  = this.popularMangaSelector;
  this.searchMangaFromElement  = this.popularMangaFromElement;


  //Detail

  this.mangaDetailsParse = (doc) => {
      let title = doc.querySelector("h1").innerText;
      let infoItems = doc.querySelectorAll(".info-item");
      let author = infoItems[infoItems.length - 2].innerText.split(":").slice(1).join(":").trim()
      let artist = author;
      let glist = [];
      doc.querySelectorAll(".list01 li").forEach(it =>  { glist.push(it.innerText) });
      let genre = glist.join(", ");
      let description = doc.querySelector(".story-detail-info").innerText.trim();
      let thumbnailUrl = doc.querySelector("div.left img").getAttribute("src");
      let status = infoItems[infoItems.length - 1].innerText.split(":").slice(1).join(":").trim();
      status = "Đang Cập Nhật" ? "ONGOING" : "UNKNOWN";
      return {
        title, author, artist, genre, description, thumbnailUrl, status
      }
   }

  // Chapters
  this.chapterListSelector = () => "div.works-chapter-list div.works-chapter-item";
  this.chapterFromElement = (element) => {
      const parseDate = (dateString) => new Date(dateString.split("/").reverse().join('-')).getTime();
      const url = element.querySelector("a").getAttribute("href");
      const name = element.querySelector("a").innerText.trim();
      const dateUpload = parseDate(element.querySelector("div.text-right").innerText.trim())
      const chapterNumber = parseFloat(name.split("Chương").slice(1).join("Chương").trim());
      return {url, name, dateUpload, chapterNumber}
  }

  // Pages

  this.pageListParse = (document) => {
      const pages = [];
      document.querySelectorAll("img.lazy").forEach((element, index) => {
          const src = element.getAttribute("src");
          const dataCdn = element.getAttribute("data-cdn");
          const url = src.includes("truyenvua") ? src : dataCdn;
          const name = "";
          pages.push({index, name, url });
      });
      return pages;
  }

}
