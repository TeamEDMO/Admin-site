import { getSimpleModeEnabled, setSimpleModeEnabled } from "./api";

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

init()