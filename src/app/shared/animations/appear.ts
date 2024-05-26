import { animation, useAnimation } from "@angular/animations";
import { transformOpacity } from "./transform-opacity";

export const appear = animation(useAnimation(transformOpacity), {
  params: {
    oStart: 0,
    oEnd: 1,
    transformStart: "translateY(10px)",
    transformEnd: "translateY(0px)",
  }
})
