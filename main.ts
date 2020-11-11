import { Sprite2DApplication } from "./game/Sprite2DApplication";
import { ApplicationTest } from "./test/ApplicationTest";
import { BasicWebGLApplication } from "./test/BasicWebGLApplication";
import { Shape_Hit_Draw_TestDemo } from "./test/Shape_Hit_Draw_TestDemo";
import { SkeletonPersonTets } from "./test/SkeletonPersonTest";
import { TankFollowBezierPathDemo } from "./test/TankFollowBezierPathDemo";
import { TestCanvas2dApplication } from "./test/TestCanvas2dApplication";

/*function timerCallback(id: number, data: string): void {
    console.log("当前调用的Timer的id：" + id + " data: " + data);
}*/

let canvas: HTMLCanvasElement | null = document.getElementById(
    "canvas"
) as HTMLCanvasElement;

function resize() {
    canvas!.width = window.innerWidth;
    canvas!.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

let fpsNumber: HTMLElement | null = document.getElementById("number");
let app: BasicWebGLApplication = new BasicWebGLApplication(canvas);

//let app:Sprite2DApplication = new Sprite2DApplication(canvas);

app.addTimer(
    () => {
        fpsNumber!.innerText = app.fps.toFixed(1);
    },
    0,
    false
);

//new TankFollowBezierPathDemo(app);
//new SkeletonPersonTets(app);

//new Shape_Hit_Draw_TestDemo(app);

/*let app = new TestCanvas2dApplication(canvas);
app.start();
let button: HTMLButtonElement = document.getElementById(
    "change"
) as HTMLButtonElement;
let state: number = 4;
app.state = state;
button.onclick = () => {
    state++;
    app.state = state;
};*/
/*let app = new ApplicationTest(canvas);

let timer0: number = app.addTimer(
    timerCallback,
    3,
    true,
    "data0是timerCallback的数据"
);

let timer1: number = app.addTimer(
    timerCallback,
    5,
    false,
    "data1是timerCallback的数据"
);

let startButton: HTMLButtonElement | null = document.getElementById(
    "start"
) as HTMLButtonElement;
let stopButton: HTMLButtonElement | null = document.getElementById(
    "stop"
) as HTMLButtonElement;

startButton.onclick = (ev: MouseEvent): void => {
    app.start();
};

stopButton.onclick = (ev: MouseEvent): void => {
    app.removeTimer(timer1);
    console.log(app.timers.length);
    let id: number = app.addTimer(timerCallback, 10, true, " data 是新加的");
    console.log(id === 0);
    //app.stop();
};

app.start();*/
