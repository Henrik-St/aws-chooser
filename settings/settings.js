const url_input = document.getElementById("url-input");
const accounts_textarea = document.getElementById("accounts");
const services_textarea = document.getElementById("services");


// eslint-disable-next-line no-undef
const storage_provider = typeof browser !== "undefined" ? browser : chrome; // Support both Firefox and Chrome

storage_provider.storage.local.get(["accounts", "services", "sso_url"]).then((result) => {
    if (result.accounts) {
        accounts_textarea.value = JSON.stringify(result.accounts, null, 4);
    }

    if (result.services) {
        services_textarea.value = JSON.stringify(result.services, null, 4);
    }

    if (result.sso_url) {
        url_input.value = result.sso_url;
    }
});
const save_acc_btn = document.getElementById("save-acc-btn");
const save_svc_btn = document.getElementById("save-svc-btn");
const save_url_btn = document.getElementById("save-url-btn");

save_acc_btn.addEventListener("click", () => {
    saveKey("accounts", "accounts");
});

save_svc_btn.addEventListener("click", () => {
    saveKey("services", "services");
});

save_url_btn.addEventListener("click", () => {
    const input_text = document.getElementById("url-input").value;
    if (input_text.trim()) {
        try {
            storage_provider.storage.local.set({
                sso_url: input_text,
            }, () => {
                window.alert("Settings saved!");
            });
        } catch (e) {
            window.alert("Invalid JSON in url field." + e.message);
            return;
        }
    }
});


function saveKey(textarea_id, storage_key) {
    const textarea_text = document.getElementById(textarea_id).value;
    if (textarea_text.trim()) {
        try {
            const parsed = JSON.parse(textarea_text);

            storage_provider.storage.local.set({
                [storage_key]: parsed,
            }, () => {
                window.alert("Settings saved!");
            });
        } catch (e) {
            window.alert(`Invalid JSON in ${textarea_id} field: ${e.message}`);
            return;
        }
    }
}