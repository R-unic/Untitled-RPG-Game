import { KnitServer as Knit } from "@rbxts/knit";
import { Players } from "@rbxts/services";
import StrictMap from "shared/Util/StrictMap";
import Logger from "shared/Logger";

declare global {
    interface KnitServices {
        ScoreService: typeof ScoreService;
    }
}

interface Score {
    Kills: number;
    Deaths: number;
    Streak: number;
    KDR: number;
}

const defaultScore = {
    Kills: 0,
    Deaths: 0,
    Streak: 0,
    KDR: 0
};

const ScoreService = Knit.CreateService({
    Name: "ScoreService",
    ScoreSet: new StrictMap<Player, Score>(),

    Client: {
        AddKill(plr: Player): void {
            this.Server.AddKill(plr);
        },
        AddDeath(plr: Player): void {
            this.Server.AddDeath(plr);
        }
    },

    AddKill(plr: Player): void {
        const score = this.ScoreSet.Get(plr);
        score.Kills += 1;
        score.Streak += 1;
        score.KDR = score.Kills / score.Deaths;
        this.ScoreSet.Set(plr, score);
    },

    AddDeath(plr: Player): void {
        const score = this.ScoreSet.Get(plr);
        score.Deaths += 1;
        score.Streak = 0;
        score.KDR = score.Kills / score.Deaths;
        this.ScoreSet.Set(plr, score);
    },

    ResetScores(): void {
        for (const plr of Players.GetPlayers())
            this.ScoreSet.Set(plr, defaultScore);
    },

    KnitInit() {
        Logger.ComponentActive(this.Name);
        Players.PlayerRemoving.Connect(plr => this.ScoreSet.Delete(plr));
        Players.PlayerAdded.Connect(plr => this.ScoreSet.Set(plr, defaultScore));
    }
});

export = ScoreService;