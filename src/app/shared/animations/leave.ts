import { animation, useAnimation } from "@angular/animations";
import { opacity } from "./opacity";

export const leave = animation(useAnimation(opacity), {
  params: {
    oStart: 1,
    oEnd: 0,
  }
})
