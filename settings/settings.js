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
            browser.storage.local.set({
                sso_url: input_text,
            }, () => {
                alert("Settings saved!");
            });
        } catch (e) {
            alert("Invalid JSON in url field." + e.message);
            return;
        }
    }
});


function saveKey(textarea_id, storage_key) {
    const textarea_text = document.getElementById(textarea_id).value;
    if (textarea_text.trim()) {
        try {
            const parsed = JSON.parse(textarea_text);

            browser.storage.local.set({
                [storage_key]: parsed,
            }, () => {
                alert("Settings saved!");
            });
        } catch (e) {
            alert(`Invalid JSON in ${textarea_id} field.`);
            return;
        }
    }
}