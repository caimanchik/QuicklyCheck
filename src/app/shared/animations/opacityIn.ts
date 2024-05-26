import { animation, useAnimation } from "@angular/animations";
import { opacity } from "./opacity";

export const opacityIn = animation(useAnimation(opacity), {
  params: {
    oStart: 0,
    oEnd: 1,
  }
})
