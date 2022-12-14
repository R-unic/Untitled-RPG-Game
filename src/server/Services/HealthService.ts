import { KnitServer as Knit } from "@rbxts/knit";
import { Players } from "@rbxts/services";
import { Character } from "shared/Classes/Character";

declare global {
    interface KnitServices {
        HealthService: typeof HealthService;
    }
}

const HealthService = Knit.CreateService({
    Name: "HealthService",

    KnitStart() {
        const conn = Players.PlayerAdded.Connect(p => {
            const chars = Knit.GetService("CharacterService");
            const data = Knit.GetService("DataService");
            data.DataUpdated.Connect((plr: Player, name: string, equippedChar) => {
                if (name === "equippedCharacter" && p === plr) {
                    do task.wait(); while (!chars && !data);
                    const char = chars.GetFromParty(plr, <number>equippedChar);
                    const plrChar = plr.Character || plr.CharacterAdded.Wait()[0];
                    const hum = <Humanoid>plrChar!.WaitForChild("Humanoid");
                    hum.MaxHealth = char.State.Stats.MaxHealth;
                    hum.Health = char.State.Stats.Health;
                }
            });
        });
        conn.Disconnect();
    },
});

export = HealthService;