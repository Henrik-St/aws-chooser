(async () => { // to allow async/await usage

  // add jsdoc type hints
  const sso_url = await getStorageKey("sso_url").catch(() => (""));
  const accounts = await getStorageKey("accounts").catch(() => ({}));
  const services = await getStorageKey("services").catch(() => ({}));

  // html objects
  /**  @type {HTMLInputElement} */
  const searchInput = document.getElementById("search");
  const settingsBtn = document.getElementById("settings-btn");
  const popup_content = document.getElementById("popup-content");
  let account = "";

  for (const entry of Object.entries(accounts)) {
    const acc_name = entry[0];
    addAccountButton(popup_content, acc_name);
  }

  settingsBtn.addEventListener("click", () => {
    window.open("../settings/settings.html", "_blank");
  });

  searchInput.addEventListener("input", (event) => {
    const filter = event.target.value.toLowerCase();
    if (account === "") {
      filterAccounts(filter);
    } else {
      filterServices(filter);
    }
  });

  function filterAccounts(filter) {
    popup_content.innerHTML = "";
    Object.keys(accounts).filter((key) => filter === "" || key.toLowerCase().includes(filter)).forEach((key) => {
      addAccountButton(popup_content, key);
    });
  }

  function filterServices(filter) {
    popup_content.innerHTML = "";
    Object.keys(services).filter((key) => filter === "" || key.toLowerCase().includes(filter)).forEach((key) => {
      addServiceButton(popup_content, account, key, services[key]);
    });
  }

  function addAccountButton(popup_content, acc_name) {
    const button = document.createElement("button");
    button.textContent = `${acc_name}`;
    popup_content.appendChild(button);
    button.addEventListener("click", () => {
      account = acc_name;
      searchInput.value = "";
      render_services(acc_name);
      searchInput.focus()
    });
  }

  // listen for enter key event 
  searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      if (account === "") {
        const firstAccountButton = popup_content.querySelector("button");
        if (firstAccountButton) {
          firstAccountButton.click();
        }
      } else {
        const firstServiceButton = popup_content.querySelector("button");
        if (firstServiceButton) {
          firstServiceButton.click();
        }
      }
    }
  });

  function addServiceButton(popup_content, acc_name, service, destination) {
    const button = document.createElement("button");
    button.textContent = `${service}`;
    popup_content.appendChild(button);
    button.addEventListener("click", () => {
      const url = get_url(accounts[acc_name].id, accounts[acc_name].role, destination);
      window.open(url, "_blank");
    });
  }

  function get_url(account, role = "AWSAdministratorAccess", destination) {
    let dest_enc = encodeURIComponent(destination);
    if (!sso_url || sso_url === "") {
      alert("SSO URL is not configured. Got to settings");
    }
    return `${sso_url}/console?account_id=${account}&role_name=${role}&destination=${dest_enc}`
  }

  function render_services(account) {
    popup_content.innerHTML = "";
    for (const [key, value] of Object.entries(services)) {
      addServiceButton(popup_content, account, key, value);
    }
  }
  async function getStorageKey(key) {
    const data = await browser.storage.local.get(key).catch((e) => alert(`Error retrieving ${key} from storage: ${e.message}`));
    if (data && key in data) {
      return data[key];
    } else {
      return Promise.reject();
    }
  }
})();