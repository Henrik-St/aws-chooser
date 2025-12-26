(async () => { // to allow async/await usage

  // add jsdoc type hints
  const sso_url = await getStorageKey("sso_url").catch(() => (""));
  const accounts = await getStorageKey("accounts").catch(() => ({}));
  const services = await getStorageKey("services").catch(() => ({}));

  // html objects
  /**  @type {HTMLInputElement} */
  const searchInput = document.getElementById("search");
  searchInput.focus();
  const settingsBtn = document.getElementById("settings-btn");
  const popup_content = document.getElementById("popup-content");

  let account = "";
  let selectedIndex = 0;

  render_accounts();

  settingsBtn.addEventListener("click", () => {
    window.open("../settings/settings.html", "_blank");
  });

  searchInput.addEventListener("input", (event) => {
    const filter = event.target.value.toLowerCase();
    selectedIndex = 0;
    if (account === "") {
      filterAccounts(filter);
    } else {
      filterServices(filter);
    }
  });

  /**
   * @param {string} filter - The string used to filter service keys. If empty, all services are shown.
   */
  function filterAccounts(filter) {
    popup_content.innerHTML = "";
    Object.keys(accounts).filter((key) => filter === "" || key.toLowerCase().includes(filter)).forEach((key, i) => {
      const button = createAccountButton(key);
      i === selectedIndex && button.classList.add("selected");
      popup_content.appendChild(button);
    });
  }

  /**
   * @param {string} filter - The string used to filter service keys. If empty, all services are shown.
   */
  function filterServices(filter) {
    popup_content.innerHTML = "";
    Object.keys(services).filter((key) => filter === "" || key.toLowerCase().includes(filter)).forEach((key, i) => {
      const button = createServiceButton(account, key, services[key]);
      i === selectedIndex && button.classList.add("selected");
      popup_content.appendChild(button);
    });
  }

  /**
   * Creates and appends an account selection button to the popup content.
   *
   * @param {string} acc_name - The name of the AWS account.
   * @returns {HTMLButtonElement} The created account button element.
   */
  function createAccountButton(acc_name) {
    const button = document.createElement("button");
    button.textContent = `${acc_name}`;
    button.addEventListener("click", () => {
      account = acc_name;
      searchInput.value = "";
      selectedIndex = 0;
      render_services(acc_name);
      searchInput.focus()
    });
    return button;
  }

  // listen for enter key event 
  searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      if (account === "") {
        const firstAccountButton = popup_content.querySelector("button.selected");
        if (firstAccountButton) {
          firstAccountButton.click();
        }
      } else {
        const firstServiceButton = popup_content.querySelector("button.selected");
        if (firstServiceButton) {
          firstServiceButton.click();
        }
      }
    } else if (event.key === "ArrowLeft") {
      account = "";
      render_accounts();
    } else if (event.key === "ArrowDown") {
      selectedIndex++;
      rerenderSelection();
    } else if (event.key === "ArrowUp") {
      selectedIndex--;
      rerenderSelection();
    }
  });

  function rerenderSelection() {
    const filter = searchInput.value.toLowerCase();
    if (account === "") {
      filterAccounts(filter);
    } else {
      filterServices(filter);
    }
  }

  /**
   * Creates and appends an account selection button to the popup content.
   *
   * @returns {HTMLButtonElement} The created account button element.
   */
  function createServiceButton(acc_name, service, destination) {
    const button = document.createElement("button");
    button.textContent = `${service}`;
    button.addEventListener("click", () => {
      const url = get_url(accounts[acc_name].id, accounts[acc_name].role, destination);
      window.open(url, "_blank");
    });
    return button;
  }

  function get_url(account, role = "AWSAdministratorAccess", destination) {
    let dest_enc = encodeURIComponent(destination);
    if (!sso_url || sso_url === "") {
      window.alert("SSO URL is not configured. Got to settings");
    }
    return `${sso_url}/console?account_id=${account}&role_name=${role}&destination=${dest_enc}`;
  }

  function render_accounts() {
    popup_content.innerHTML = "";
    Object.keys(accounts).forEach((acc_name, i) => {
      const button = createAccountButton(acc_name);
      i === selectedIndex && button.classList.add("selected");
      popup_content.appendChild(button);
    });
  }

  function render_services(account) {
    popup_content.innerHTML = "";
    Object.entries(services).forEach(([key, value], i) => {
      const button = createServiceButton(account, key, value);
      i === selectedIndex && button.classList.add("selected");
      popup_content.appendChild(button);
    });
  }
  async function getStorageKey(key) {
    const data = await browser.storage.local.get(key).catch((e) => window.alert(`Error retrieving ${key} from storage: ${e.message}`));
    if (data && key in data) {
      return data[key];
    } else {
      return Promise.reject();
    }
  }
})();