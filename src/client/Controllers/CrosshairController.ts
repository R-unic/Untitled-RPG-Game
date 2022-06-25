import { KnitClient as Knit } from "@rbxts/knit";
import { Player } from "@rbxts/knit/Knit/KnitClient";
import { ReplicatedFirst as Replicated, RunService } from "@rbxts/services";
import UI from "shared/UI";

declare global {
    interface KnitControllers {
        CrosshairController: typeof CrosshairController;
    }
}

const crosshair = Replicated.Assets.Crosshair;
let mouseMove: RBXScriptConnection;
let gui: typeof crosshair;

const CrosshairController = Knit.CreateController({
    Name: "CrosshairController",
    Enabled: false,

    Toggle(on: boolean): void {
        this.Enabled = on;
        if (on) {
            const ms = Player.GetMouse();
            gui = Replicated.Assets.Crosshair.Clone();
            gui.Parent = UI.Main().Parent;
            mouseMove = RunService.Stepped.Connect(() => gui.Box.Position = new UDim2(0, ms.X, 0, ms.Y));
        } else {
            mouseMove?.Disconnect();
            gui?.Destroy();
        }
    },

    GetTweenPositions(line: Frame): { Closed: UDim2; Open: UDim2 } {
        return { 
            Closed: <UDim2>line.GetAttribute("Closed"),
            Open: <UDim2>line.GetAttribute("Open")
         };
    },

    FireAnim(): void {
        //todo: tween each part of crosshair diff direction (gross)
        const ch = gui.Box;
        const t = this.GetTweenPositions(ch.T),
            b = this.GetTweenPositions(ch.B),
            l = this.GetTweenPositions(ch.L),
            r = this.GetTweenPositions(ch.R);

        const time = .05;
        const dir = Enum.EasingDirection.In, style = Enum.EasingStyle.Sine
        ch.T.TweenPosition(t.Open, dir, style, time, undefined, () => {
            ch.T.TweenPosition(t.Closed, dir, style, time);
        });
        ch.B.TweenPosition(b.Open, dir, style, time, undefined, () => {
            ch.B.TweenPosition(b.Closed, dir, style, time);
        });
        ch.L.TweenPosition(l.Open, dir, style, time, undefined, () => {
            ch.L.TweenPosition(l.Closed, dir, style, time);
        });
        ch.R.TweenPosition(r.Open, dir, style, time, undefined, () => {
            ch.R.TweenPosition(r.Closed, dir, style, time);
        });
    }
});

export = CrosshairController;