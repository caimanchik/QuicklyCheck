import { animation, useAnimation } from "@angular/animations";
import { opacity } from "./opacity";

export const opacityOut = animation(useAnimation(opacity), {
  params: {
    oStart: 1,
    oEnd: 0,
  }
})
