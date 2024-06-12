import { animate, animation, style } from "@angular/animations";

export const animateIn = animation([
  style({
    overflow: 'hidden',
    'max-height': 0,
    transition: 'max-height 0.5s cubic-bezier(0, 1, 0, 1)'
  }),

  animate('300ms ease-in-out',
    style({
      'max-height': '1000px'
    })
  )
])
