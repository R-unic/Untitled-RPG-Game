import { Janitor, KnitServer as Knit } from "@rbxts/knit";
import { Players } from "@rbxts/services";
import { Character } from "shared/Classes/Character";
import CharacterList from "server/Classes/CharacterList";
import Logger from "shared/Logger";

declare global {
    interface KnitServices {
        DataManager: typeof DataManager;
    }
}

const DataManager = Knit.CreateService({
    Name: "DataManager",
    
    KnitStart(): void {
        Logger.ComponentActive(this.Name);

        const data = Knit.GetService("DataService");
        Players.PlayerAdded.Connect(plr => {
            task.wait(3.2);
            
            data.Store<[number, number, number]>(plr, "location", [0, 5, 0]);
            data.Store<number>(plr, "adventureXP", 0);
            data.Store<number>(plr, "equippedCharacter", 1);
            data.Store<Character[]>(plr, "characterSetups", [CharacterList[0]]);
            data.Store<string[]>(plr, "partySetup", ["Adventurer"]);
            data.Store<boolean>(plr, "newPlayer", true);
            data.Store<string>(plr, "nickname", "Adventurer");

            data.Store<number>(plr, "coins", 200);
            data.Store<number>(plr, "divinityCoins", 0);

            const loc = data.Get<[number, number, number]>(plr, "location");
            const janitor = new Janitor;
            janitor.Add(plr.CharacterAdded.Connect(c => {
                c.SetPrimaryPartCFrame(new CFrame(loc[0], loc[1], loc[2]));
                janitor.Cleanup();
            }));
        });
    }
});

export = DataManager;