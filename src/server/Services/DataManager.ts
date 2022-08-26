import { KnitServer as Knit } from "@rbxts/knit";
import { Players } from "@rbxts/services";
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
            data.Store<[number, number, number]>(plr, "location", [0, 0, 0]);
            data.Store<number>(plr, "xp", 0);
            // data.Store<Character[]>(plr, "characterSetups", []);
            data.Store<string[]>(plr, "partySetup", ["Traveler"]);

            const loc = data.Get<[number, number, number]>(plr, "location")
            let conn: RBXScriptConnection;
            conn = plr.CharacterAdded.Connect(c => {
                c.SetPrimaryPartCFrame(new CFrame(loc[0], loc[1], loc[2]));
                conn.Disconnect();
            });
        });
    }
});

export = DataManager;