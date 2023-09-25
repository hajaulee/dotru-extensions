function KimMiNa() {

    this.name = "KimMiNa";
    this.version = "0.0.1";
    this.thumbnail = "https://kimminatt.com/wp-content/uploads/2023/02/logo.png";
    this.lang = "vi";
    this.baseUrl = "https://kimminatt.com";
    this.supportsLatest = true;
  
    this.headerBuilder = () => {
      return {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:84.0) Gecko/20100101 Firefox/84.0",
        "Referer": this.baseUrl
      }
    }
  
    // Popular
    this.popularMangaRequest = (page) => `${this.baseUrl}/bang-xep-hang/`;
    this.popularMangaNextPageSelector = () => "a.next-page, a[rel=next]";
    this.popularMangaSelector = () => "li.position-relative";
    this.popularMangaFromElement = (e) => {
        const url = e.querySelector("a").getAttribute("href");
        const title = e.querySelector("img").getAttribute("alt").trim().replace("Truyên tranh", "");
        const thumbnailUrl = imageOrNull(e.querySelector("img"));
        return {url, thumbnailUrl, title};
    }
  
    // Latest
    this.latestUpdatesRequest = (page) => `${this.baseUrl}/page/${page}/`;
    this.latestUpdatesNextPageSelector = this.popularMangaNextPageSelector;
    this.latestUpdatesSelector = () => "div.comic-item-box";
    this.latestUpdatesFromElement = this.popularMangaFromElement;
  
  
    // Search
    this.searchMangaRequest = (page, query, filters) => {
        return `${this.baseUrl}/tim-truyen?keyword=${query}&page=${page}`
        // Todo Filters
    }
  
    this.searchMangaNextPageSelector = this.popularMangaNextPageSelector;
    this.searchMangaSelector = () => "div.comic-item-box";
    this.searchMangaFromElement  = this.popularMangaFromElement;
  
  
    //Detail
  
    this.mangaDetailsParse = (doc) => {
    	if (!window.CryptoJS){
    		let scriptEle = document.createElement("script");
    		scriptEle.setAttribute("src", "https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js");
    		document.body.appendChild(scriptEle);
    	}
    	
        let info = doc.querySelector("div.comic-info");
        let author = info.querySelector(".comic-intro-text span:nth-child(5)")?.innerText?.trim();
        let artist = info.querySelector(".comic-intro-text span:nth-child(8)")?.innerText?.trim();
        let glist = [];
        info.querySelectorAll(".tags a").forEach(it =>  { glist.push(it.innerText) });
        let genre = glist.join(", ");
        let description = doc.querySelector("div.intro-container div:nth-child(2)")?.innerText?.trim();
        let status = parseStatus(info.querySelector(".comic-intro-text .comic-stt")?.innerText?.trim());
        return {
          author, artist, genre, description, status
        }
     }
  
    // Chapters
    this.chapterListSelector = () => ".chapter-table tr:nth-child(n+2)";
    this.chapterFromElement = (element) => {
        const url = addHttpsSchema(element.querySelector("a")?.getAttribute("href"));
        const name = element.querySelector("a span:nth-child(1)")?.innerText?.trim();
        const dateUpload = parseDate(element.querySelector("td:nth-child(4)")?.innerText?.trim());
        return {url, name, dateUpload}
    }
  
    // Pages
  
    this.pageListParse = (document) => {
        const pages = [];
        let scriptContent = document.querySelector("#view-chapter script").innerText;
        const htmlContent = scriptContent
             .slice(scriptContent.indexOf("{"), scriptContent.lastIndexOf("}") + 1)
             .replace(/\\\"/g, "\"")
             .replace(/\\\\/g, "\\")
             .replace(/\\\//g, "/");
        if (htmlContent){
	        let chapterHTML = CryptoJSAesDecrypt('CQMz2W' + '8XZeZB' + '5ABDqU', JSON.stringify(JSON.parse(htmlContent)) );
	        const div = document.createElement("div");
	        div.innerHTML = chapterHTML;
	        console.log(chapterHTML)
	        
        	div.querySelectorAll("img").forEach((element, index) => {
            	const url = addHttpsSchema(imageOrNull(element));
            	const name = "";
            	pages.push({index, name, url });
        	});
	    }
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
      if (agoWords.some(word => dateString?.toLowerCase()?.includes(word))){
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
      let imgLink = element.getAttribute("data-cqmz2w");
      imgLink = imgLink.replace(/CQMz2W/g, '.');
	  imgLink = imgLink.replace(/8XZeZB/g, ':');
	  imgLink = imgLink.replace(/5ABDqU/g, '/');
	  console.log(imgLink)
      return imgLink;
    }
    
    const addHttpsSchema = (strUrl) => {
    	return strUrl?.startsWith("//") ? ("https:" + strUrl) : strUrl;
    }
    
    const CryptoJSAesDecrypt = (passphrase, encrypted_json_string) => {
		var obj_json = JSON.parse(encrypted_json_string);
		var encrypted = obj_json.ciphertext;
		var salt = CryptoJS.enc.Hex.parse(obj_json.salt);
		var iv = CryptoJS.enc.Hex.parse(obj_json.iv);
		var key = CryptoJS.PBKDF2(passphrase, salt, {
			hasher: CryptoJS.algo.SHA512,
			keySize: 64 / 8,
			iterations: 999
		});
		var decrypted = CryptoJS.AES.decrypt(encrypted, key, {
			iv: iv
		});
		return decrypted.toString(CryptoJS.enc.Utf8);
	}
  
  }
