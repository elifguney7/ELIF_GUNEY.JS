(() => {
    const API_URL = "https://gist.githubusercontent.com/sevindi/5765c5812bbc8238a38b3cf52f233651/raw/56261d81af8561bf0a7cf692fe572f9e1e91f372/products.json";
    let products = [];
    const STORAGE_KEY = "productsYouMayLikeData";
    const FAVORITES_KEY = "favoriteProducts";
    const favorites = JSON.parse(localStorage.getItem(FAVORITES_KEY)) || {};
  
    const init = async () => {
      products = JSON.parse(localStorage.getItem(STORAGE_KEY)) || (await fetchProducts());
      buildHTML();
      buildCSS();
      setEvents();
    };
  
    const fetchProducts = async () => {
      const response = await fetch(API_URL);
      const data = await response.json();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return data;
    };
  
    const buildHTML = () => {
      const carouselHTML = `
              <div class="product-carousel">
                  <div class="carousel-outer-container">
                      <h2>You Might Also Like</h2>
                      <div class="carousel-container">
                      <button class="carousel-prev">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14.242" height="24.242" viewBox="0 0 14.242 24.242"><path fill="none" stroke="#333" stroke-linecap="round" stroke-width="3px" d="M2106.842 2395.467l-10 10 10 10" transform="translate(-2094.721 -2393.346)"></path></svg>
                      </button>
                      <div class="carousel-track-wrapper">
                          <div class="carousel-track">${products
                            .map((product) => createProductCard(product))
                            .join("")}</div>
                      </div>
                      <button class="carousel-next">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14.242" height="24.242" viewBox="0 0 14.242 24.242"><path fill="none" stroke="#333" stroke-linecap="round" stroke-width="3px" d="M2106.842 2395.467l-10 10 10 10" transform="translate(-2094.721 -2393.346)"></path></svg>                       </button>
                      </div>
                  </div>
              </div>`;
  
      document
        .querySelector(".product-detail")
        .insertAdjacentHTML("afterend", carouselHTML);
    };
  
    const createProductCard = (product) => {
      return `
              <div class="carousel-item" data-id="${product.id}">
                  <a href="${product.url}" target="_blank">
                      <img src="${product.img}" alt="${product.name}">
                  </a>
                  <p>${product.name}</p>
                  <span>${product.price} TL</span>
  
                  <button class="favorite-btn ${
                    favorites[product.id] ? "favorited" : ""
                  }">
      <svg xmlns="http://www.w3.org/2000/svg" width="20.576" height="19.483" viewBox="0 0 20.576 19.483">
          <path fill="${
            favorites[product.id] ? "#193db0" : "none"
          }" stroke="#555" stroke-width="1.5px"
              d="M19.032 7.111c-.278-3.063-2.446-5.285-5.159-5.285a5.128 5.128 0 0 0-4.394 2.532 4.942 4.942 0 0 0-4.288-2.532C2.478 1.826.31 4.048.032 7.111a5.449 5.449 0 0 0 .162 2.008 8.614 8.614 0 0 0 2.639 4.4l6.642 6.031 6.755-6.027a8.615 8.615 0 0 0 2.639-4.4 5.461 5.461 0 0 0 .163-2.012z"
              transform="translate(.756 -1.076)">
          </path>
      </svg>
  </button>
  
   
              </div>`;
    };
  
    const buildCSS = () => {
      const css = `
              .product-carousel { max-width: 90%; padding: 20px; overflow: hidden; margin: 0 auto; }
              .product-carousel h2 { max-width: 90%; margin: 20px auto; }
              .product-carousel span {width: 100%; color: #193db0; align-items:start; font-size:18px; font-weight: 600}
              .carousel-container { display: flex; align-items: center; }
              .carousel-track-wrapper { overflow: hidden; width: 100%; }
              .carousel-track { display: flex; gap:15; transition: transform 0.3s ease-in-out; }
              .carousel-item { 
                  min-width: 20%; 
                  padding-right: 10px; 
                  text-align: start; 
                  display: flex; 
                  flex-direction: column; 
                  align-items: center; 
                  box-sizing: border-box;
                  position: relative;
              }
              .carousel-item img { width: 100%; height: auto; display: block; }
              .carousel-prev, .carousel-next { background: none; border: none; cursor: pointer; padding: 20px; font-size: 24px; }
              .carousel-next {transform: rotate(180deg);}
              .favorite-btn { background: none; border: 1px solid gray; border-radius: 10%; font-size: 20px; cursor: pointer; display: flex; padding: 5px; position: absolute; top: 10px; right: 20px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);}
              .favorited { color: blue; }
  
              @media (max-width: 1200px) {
                  .carousel-item { min-width: 30%; } 
              }
              @media (max-width: 900px) {
                  .carousel-item { min-width: 40%; } 
              }
              @media (max-width: 600px) {
                  .carousel-item { min-width: 40%; } 
                  .carousel-next, .carousel-prev {display: none;}
                  .carousel-outer-container {display: flex; flex-direction: row;}
                  .product-carousel h2 { font-size: 24px; display: flex; align-items: center }
              }            
          `;
      document.head.insertAdjacentHTML("beforeend", `<style>${css}</style>`);
    };
  
    const setEvents = () => {
      let index = 0;
      const track = document.querySelector(".carousel-track");
      const items = document.querySelectorAll(".carousel-item");
      const prevButton = document.querySelector(".carousel-prev");
      const nextButton = document.querySelector(".carousel-next");
      const itemWidth = items[0].offsetWidth + 15;
      const maxIndex =
        items.length - Math.floor(track.parentElement.offsetWidth / itemWidth);
  
      prevButton.addEventListener("click", () => {
        index = Math.max(index - 1, 0);
        track.style.transform = `translateX(-${index * itemWidth}px)`;
      });
  
      nextButton.addEventListener("click", () => {
        index = Math.min(index + 1, maxIndex);
        track.style.transform = `translateX(-${index * itemWidth}px)`;
      });
  
      window.addEventListener("resize", () => {
        const newItemWidth = items[0].offsetWidth + 15;
        const newMaxIndex =
          items.length -
          Math.floor(track.parentElement.offsetWidth / newItemWidth);
        index = Math.min(index, newMaxIndex);
        track.style.transform = `translateX(-${index * newItemWidth}px)`;
      });
  
      document.querySelectorAll(".favorite-btn").forEach((button) => {
        button.addEventListener("click", (e) => {
          e.preventDefault();
          const buttonElement = e.currentTarget;
          const productId = buttonElement.closest(".carousel-item").dataset.id;
          favorites[productId] = !favorites[productId];
          localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  
          buttonElement.classList.toggle("favorited", favorites[productId]);
  
          const svgPath = buttonElement.querySelector("path");
          if (svgPath) {
            svgPath.setAttribute(
              "fill", favorites[productId] ? "#193db0" : "none"
            );
          }
        });
      });
    };
  
    init();
  })();