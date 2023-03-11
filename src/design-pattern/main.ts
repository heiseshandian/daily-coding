import { Animate, AnimatePropName } from './strategy';
import { MoveCommand, MoveCommandSchedular } from './command';

const ball = document.getElementById('ball')!;
const moveBtn = document.getElementById('moveBtn')!;
const cancelBtn = document.getElementById('cancelBtn')!;
const endPos = document.getElementById('endPos')! as HTMLInputElement;

const animate = new Animate(ball);
const directions: AnimatePropName[] = ['left', 'top'];
const moveCommandSchedular = new MoveCommandSchedular(animate);

let i = 0;
moveBtn.addEventListener('click', () => {
    const index = i % 2;
    const isPositive = [0, 1].includes(i % 4);
    const val = parseInt(endPos.value);

    i++;

    const moveCommand = new MoveCommand(animate, directions[index], isPositive ? val : 0);
    moveCommandSchedular.runCommand(moveCommand);
});

cancelBtn.addEventListener('click', () => {
    moveCommandSchedular.undoCommand();
});
