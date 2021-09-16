let humidity = 0
let hasBeenWattered = false
let WATTER_TIMEOUT = 20 // seconds for now
let lastWattering = 0

const WATTERING_TIME = 5000
const MEASUREMENTS_TIMEOUT = 2

let showDisplayInfo = false

OLED.init(128, 64)

function debugInfo(time: number, wattered: boolean) {
    OLED.clear()
    OLED.writeStringNewLine(`Time: ${time}`)
    OLED.writeStringNewLine(`Status: ${wattered ? "Enough water." : "More watter."}`)
}

input.onButtonPressed(Button.A, function() {
    showDisplayInfo = !showDisplayInfo
    if (!showDisplayInfo) {
        OLED.clear()
    }
})

input.onButtonPressed(Button.B, function () {
    waterDown()
})

function waterDown() {
    basic.showIcon(IconNames.Duck)
    smarthome.Relay(DigitalPin.P2, smarthome.RelayStateList.Off)
    pause(WATTERING_TIME);
    smarthome.Relay(DigitalPin.P2, smarthome.RelayStateList.On)
    hasBeenWattered = true
    lastWattering += 5
}

basic.forever(function () {
    if (showDisplayInfo) {
        debugInfo(lastWattering, hasBeenWattered);
    }

	if (smarthome.ReadSoilHumidity(AnalogPin.P1) > 50) {
        if (hasBeenWattered) {
            basic.showIcon(IconNames.Tortoise)
        } else {
            waterDown()
        }
    }

    for (let i = MEASUREMENTS_TIMEOUT; i > 0; i--) {
        if (hasBeenWattered) {
            if (lastWattering > WATTER_TIMEOUT) {
                hasBeenWattered = false
                lastWattering = 0
            } else {
                lastWattering++
            }
        }
        pause(1000);
    }

    basic.clearScreen()
})
