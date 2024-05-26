import { animation, useAnimation } from "@angular/animations";
import { transformOpacity } from "./transform-opacity";

export const leaveTransform = animation(useAnimation(transformOpacity), {
  params: {
    oStart: 1,
    oEnd: 0,
    transformStart: "translateY(0px)",
    transformEnd: "translateY(10px)",
  }
})
