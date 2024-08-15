import { getSimpleModeEnabled, setSimpleModeEnabled } from "./API";
import { LocalizationManager } from "./Localization";

const switchInput = document.querySelector('#switch input');

async function init() {
    if (!(switchInput instanceof HTMLInputElement))
        return;

    switchInput.addEventListener('change', onSwitchClicked);

    switchInput.checked = await getSimpleModeEnabled();
}

async function onSwitchClicked(e: Event) {
    if (!(switchInput instanceof HTMLInputElement))
        return;

    await setSimpleModeEnabled(switchInput.checked);
}


await init()
await LocalizationManager.loadLocalisationBanks("/strings/common.json",
    "/strings/settings.json")