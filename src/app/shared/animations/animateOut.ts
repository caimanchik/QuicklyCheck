import { animate, animation, style } from "@angular/animations";

export const animateOut = animation([
  style({
    'max-height': '500px',
    overflow: 'hidden',
  }),

  animate('300ms ease-in-out',
    style({
      'max-height': 0,
    })
  )
])
