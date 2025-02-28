import { EventBus } from './event';

/* 
策略模式指的是定义一系列的算法，把它们一个个封装起来。将不变的部分和变化的部分隔开是每个设计模式的主题，
策略模式也不例外，策略模式的目的就是将算法的使用与算法的实现分离开来。
*/
enum BonusLevel {
  S,
  A,
  B,
}

// 算法定义
const bonusStrategies: Record<BonusLevel, (salary: number) => number> = {
  [BonusLevel.S](salary: number) {
    return salary * 4;
  },
  [BonusLevel.A](salary: number) {
    return salary * 3;
  },
  [BonusLevel.B](salary: number) {
    return salary * 2;
  },
};

export function calculateBonus(
  bonusLevel: BonusLevel,
  baseSalary: number
): number {
  // 算法使用
  return bonusStrategies[bonusLevel](baseSalary);
}

export enum AnimationType {
  Linear,
  EaseIn,
  StrongEaseIn,
  StrongEaseOut,
  SinEaseIn,
  SinEaseOut,
}

// 缓动算法定义
const Tween: Record<
  AnimationType,
  (
    elapsedTime: number,
    sourcePosition: number,
    destPosition: number,
    totalTime: number
  ) => number
> = {
  [AnimationType.Linear]: function (t, b, c, d) {
    return (c * t) / d + b;
  },
  [AnimationType.EaseIn]: function (t, b, c, d) {
    return c * (t /= d) * t + b;
  },
  [AnimationType.StrongEaseIn]: function (t, b, c, d) {
    return c * (t /= d) * t * t * t * t + b;
  },
  [AnimationType.StrongEaseOut]: function (t, b, c, d) {
    return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
  },
  [AnimationType.SinEaseIn]: function (t, b, c, d) {
    return c * (t /= d) * t * t + b;
  },
  [AnimationType.SinEaseOut]: function (t, b, c, d) {
    return c * ((t = t / d - 1) * t * t + 1) + b;
  },
};

export type AnimatePropName = keyof Omit<DOMRect, 'toJSON' | 'x' | 'y'>;

export enum AnimateEventType {
  AnimationStart,
  AnimationEnd,
}

export class Animate extends EventBus<AnimateEventType> {
  dom: HTMLElement;
  startTime = 0;
  startPos = 0;
  endPos = 0;
  propName: AnimatePropName | null = null;
  animationType: AnimationType | null = null;
  duration: number = 0;

  constructor(dom: HTMLElement) {
    super();
    this.dom = dom;
  }

  public start(
    propName: AnimatePropName,
    endPos: number,
    duration: number = 2000,
    animationType: AnimationType = AnimationType.Linear
  ) {
    this.startTime = Date.now();
    this.startPos = this.dom.getBoundingClientRect()[propName];
    this.propName = propName;
    this.duration = duration;
    this.animationType = animationType;
    this.endPos = endPos;

    this.trigger(AnimateEventType.AnimationStart);

    const self = this;
    const timeId = setInterval(() => {
      if (self.step() === false) {
        clearInterval(timeId);
      }
    }, 19);
  }

  private step(): boolean {
    const currentTime = Date.now();
    if (currentTime >= this.startTime + this.duration) {
      this.update(this.endPos);
      this.trigger(AnimateEventType.AnimationEnd);
      return false;
    }

    // 使用缓动算法计算下一个位置信息
    const nextPos = Tween[this.animationType!](
      currentTime - this.startTime,
      this.startPos,
      this.endPos - this.startPos,
      this.duration
    );
    this.update(nextPos);
    return true;
  }

  private update(pos: number) {
    if (!this.propName) {
      return;
    }

    this.dom.style[this.propName] = pos + 'px';
  }
}

export enum FormValidateType {
  IsNonEmpty,
  MinLength,
  IsMobile,
  IsNumber,
}

type FormValidateOptions = { value: any; errorMsg: string; length?: number };

// 表单校验规则（广义的算法）
const FormValidateStrategies: Record<
  FormValidateType,
  (options: FormValidateOptions) => string | void
> = {
  [FormValidateType.IsNonEmpty]({ value, errorMsg }) {
    if (/^\s*$/.test(value)) {
      return errorMsg;
    }
  },
  [FormValidateType.IsMobile]({ value, errorMsg }) {
    if (!/1[3|5|8][0-9]{9}/.test(value)) {
      return errorMsg;
    }
  },
  [FormValidateType.MinLength]({ value, length, errorMsg }) {
    if (!value || (value as string).length < length!) {
      return errorMsg;
    }
  },
  [FormValidateType.IsNumber]({ value, errorMsg }) {
    if (!/^[0-9]+$/.test(value)) {
      return errorMsg;
    }
  },
};

export function validate(
  validateOptions: Array<{
    type: FormValidateType;
    options: FormValidateOptions;
  }>
): string | undefined {
  for (let i = 0; i < validateOptions.length; i++) {
    const { type, options } = validateOptions[i];
    const errorMsg = FormValidateStrategies[type](options);
    // 只要有一个规则校验不通过直接返回
    // 当然validate也可以实现成运行完所有校验规则然后把所有的errorMsg放在数组中返回
    // 怎么实现主要还是看业务需求，我们这里简化起见有一个不通过就直接返回
    if (errorMsg) {
      return errorMsg;
    }
  }
}
